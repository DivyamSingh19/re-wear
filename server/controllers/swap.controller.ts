import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ItemStatus, SwapStatus, LedgerReason } from '@prisma/client';

// Extended Request interface to include userId
interface AuthenticatedRequest extends Request {
  userId: string;
}

 
export const requestSwap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { itemId, message } = req.body;
    const requesterId = req.userId;

    // Validate required fields
    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    // Check if item exists and is available
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { owner: true }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.deletedAt) {
      return res.status(404).json({ error: 'Item is no longer available' });
    }

    if (item.status !== ItemStatus.AVAILABLE) {
      return res.status(400).json({ error: 'Item is not available for swap' });
    }

    // Check if requester is not the owner
    if (item.ownerId === requesterId) {
      return res.status(403).json({ error: 'Cannot request swap for your own item' });
    }

    // Get requester's current points
    const requester = await prisma.user.findUnique({
      where: { id: requesterId }
    });

    if (!requester) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if requester has enough points
    if (requester.points < item.pointsValue) {
      return res.status(400).json({ 
        error: 'Insufficient points',
        required: item.pointsValue,
        available: requester.points
      });
    }

    // Start transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points from requester
      await tx.user.update({
        where: { id: requesterId },
        data: { points: { decrement: item.pointsValue } }
      });

      // Create swap record
      const swap = await tx.swap.create({
        data: {
          itemId,
          requesterId,
          pointsUsed: item.pointsValue,
          message: message || null,
          status: SwapStatus.PENDING
        }
      });

      // Create point ledger entry
      await tx.pointLedger.create({
        data: {
          userId: requesterId,
          delta: -item.pointsValue,
          reason: LedgerReason.SWAP_REDEEM,
          itemId,
          swapId: swap.id,
          notes: `Swap request for item: ${item.title}`
        }
      });

      // Update item status to pending swap
      await tx.item.update({
        where: { id: itemId },
        data: { status: ItemStatus.PENDING_SWAP }
      });

      return swap;
    });

    // Return swap with item details
    const swapWithDetails = await prisma.swap.findUnique({
      where: { id: result.id },
      include: {
        item: {
          include: { images: true }
        },
        requester: {
          select: { id: true, displayName: true, email: true }
        }
      }
    });

    return res.status(201).json({
      message: 'Swap requested successfully',
      swap: swapWithDetails
    });

  } catch (error) {
    console.error('Error requesting swap:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Cancel a pending swap
 * POST /api/swaps/:id/cancel
 */
export const cancelSwap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the swap
    const swap = await prisma.swap.findUnique({
      where: { id },
      include: { item: true }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is the requester
    if (swap.requesterId !== userId) {
      return res.status(403).json({ error: 'You can only cancel your own swaps' });
    }

    // Check if swap is pending
    if (swap.status !== SwapStatus.PENDING) {
      return res.status(400).json({ error: 'Only pending swaps can be canceled' });
    }

    // Start transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Refund points to requester
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: swap.pointsUsed } }
      });

      // Update swap status to canceled
      await tx.swap.update({
        where: { id },
        data: { status: SwapStatus.CANCELED }
      });

      // Create point ledger entry for refund
      await tx.pointLedger.create({
        data: {
          userId,
          delta: swap.pointsUsed,
          reason: LedgerReason.ADMIN_ADJUSTMENT,
          itemId: swap.itemId,
          swapId: swap.id,
          notes: `Refund for canceled swap: ${swap.item.title}`
        }
      });

      // Update item status back to available
      await tx.item.update({
        where: { id: swap.itemId },
        data: { status: ItemStatus.AVAILABLE }
      });
    });

    return res.status(200).json({
      message: 'Swap canceled successfully',
      refundedPoints: swap.pointsUsed
    });

  } catch (error) {
    console.error('Error canceling swap:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Complete a swap (typically called by item owner or admin)
 * POST /api/swaps/:id/complete
 */
export const completeSwap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the swap
    const swap = await prisma.swap.findUnique({
      where: { id },
      include: { 
        item: { include: { owner: true } },
        requester: true
      }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is the item owner (only owner can complete swaps)
    if (swap.item.ownerId !== userId) {
      return res.status(403).json({ error: 'Only the item owner can complete swaps' });
    }

    // Check if swap is pending
    if (swap.status !== SwapStatus.PENDING) {
      return res.status(400).json({ error: 'Only pending swaps can be completed' });
    }

    // Start transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update swap status to completed
      await tx.swap.update({
        where: { id },
        data: { status: SwapStatus.COMPLETED }
      });

      // Update item status to swapped
      await tx.item.update({
        where: { id: swap.itemId },
        data: { status: ItemStatus.SWAPPED }
      });
    });

    return res.status(200).json({
      message: 'Swap completed successfully',
      swap: {
        id: swap.id,
        status: SwapStatus.COMPLETED,
        item: swap.item,
        requester: {
          id: swap.requester.id,
          displayName: swap.requester.displayName,
          email: swap.requester.email
        }
      }
    });

  } catch (error) {
    console.error('Error completing swap:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all swaps requested by the current user
 * GET /api/swaps/my-swaps
 */
export const getMySwaps = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { status, limit, offset } = req.query;

    // Build where clause
    const where: any = { requesterId: userId };
    if (status && Object.values(SwapStatus).includes(status as SwapStatus)) {
      where.status = status as SwapStatus;
    }

    // Parse pagination params
    const limitNum = limit ? parseInt(limit as string, 10) : 20;
    const offsetNum = offset ? parseInt(offset as string, 10) : 0;

    // Get swaps with item details
    const swaps = await prisma.swap.findMany({
      where,
      include: {
        item: {
          include: { 
            images: true,
            owner: {
              select: { id: true, displayName: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum,
      skip: offsetNum
    });

    // Get total count for pagination
    const totalCount = await prisma.swap.count({ where });

    return res.status(200).json({
      swaps,
      pagination: {
        total: totalCount,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < totalCount
      }
    });

  } catch (error) {
    console.error('Error getting user swaps:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get a specific swap by ID
 * GET /api/swaps/:id
 */
export const getSwapById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const swap = await prisma.swap.findUnique({
      where: { id },
      include: {
        item: {
          include: { 
            images: true,
            owner: {
              select: { id: true, displayName: true, email: true }
            }
          }
        },
        requester: {
          select: { id: true, displayName: true, email: true }
        }
      }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user has permission to view this swap
    // (either the requester or the item owner)
    if (swap.requesterId !== userId && swap.item.ownerId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view this swap' });
    }

    return res.status(200).json({ swap });

  } catch (error) {
    console.error('Error getting swap by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};