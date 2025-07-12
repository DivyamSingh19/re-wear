import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { uploadToCloudinary } from '../utils/cloudinary';

// Extend Express Request to include userId from auth middleware
interface AuthenticatedRequest extends Request {
  userId: string;
}

 
export const uploadItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, category, condition, size, pointsValue } = req.body;
    const files = req.files as Express.Multer.File[];

    // Validate required fields
    if (!title || !description || !category || !condition || !size || !pointsValue) {
      return res.status(400).json({
        error: 'Missing required fields: title, description, category, condition, size, pointsValue'
      });
    }

    // Convert pointsValue to number
    const points = parseInt(pointsValue);
    if (isNaN(points) || points <= 0) {
      return res.status(400).json({
        error: 'pointsValue must be a positive number'
      });
    }

    // Upload images to Cloudinary
    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const uploadResult = await uploadToCloudinary(file.buffer);
          imageUrls.push(uploadResult.url);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          return res.status(500).json({
            error: 'Failed to upload one or more images'
          });
        }
      }
    }

    // Create item with images in a transaction
    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        condition,
        size,
        pointsValue: points,
        status: 'AVAILABLE',
        ownerId: req.userId,
        images: {
          create: imageUrls.map(url => ({ url }))
        }
      },
      include: {
        images: true,
        owner: {
          select: {
            displayName: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Item created successfully',
      item
    });

  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      error: 'Failed to create item'
    });
  }
};

/**
 * Get all available items
 * GET /api/items
 */
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: 'AVAILABLE'
      },
      include: {
        images: true,
        owner: {
          select: {
            displayName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      items,
      count: items.length
    });

  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      error: 'Failed to fetch items'
    });
  }
};

/**
 * Get a single item by ID
 * GET /api/items/:id
 */
export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        images: true,
        owner: {
          select: {
            displayName: true
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    res.status(200).json({ item });

  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      error: 'Failed to fetch item'
    });
  }
};

/**
 * Get all items belonging to the authenticated user
 * GET /api/items/my-items
 */
// items.controller.ts

export const getMyItems = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string; // ← Fake user ID in header

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
  }

  try {
    const items = await prisma.item.findMany({
      where: {
        ownerId: userId
      },
      include: {
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      items,
      count: items.length
    });

  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({
      error: 'Failed to fetch your items'
    });
  }
};

/**
 * Delete an item (only by owner)
 * DELETE /api/items/:id
 */
export const deleteItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if item exists and get owner info
    const item = await prisma.item.findUnique({
      where: { id },
      select: {
        ownerId: true
      }
    });

    if (!item) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    // Check if user is the owner
    if (item.ownerId !== req.userId) {
      return res.status(403).json({
        error: 'Unauthorized: You can only delete your own items'
      });
    }

    // Delete item and related images (cascade delete should handle images)
    await prisma.item.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      error: 'Failed to delete item'
    });
  }
};

/**
 * Update an item (only by owner, excluding images)
 * PATCH /api/items/:id
 */
export const updateItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, condition, size, pointsValue, status } = req.body;

    // Check if item exists and get owner info
    const existingItem = await prisma.item.findUnique({
      where: { id },
      select: {
        ownerId: true
      }
    });

    if (!existingItem) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    // Check if user is the owner
    if (existingItem.ownerId !== req.userId) {
      return res.status(403).json({
        error: 'Unauthorized: You can only update your own items'
      });
    }

    // Build update data object (only include provided fields)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (condition !== undefined) updateData.condition = condition;
    if (size !== undefined) updateData.size = size;
    if (status !== undefined) updateData.status = status;
    if (pointsValue !== undefined) {
      const points = parseInt(pointsValue);
      if (isNaN(points) || points <= 0) {
        return res.status(400).json({
          error: 'pointsValue must be a positive number'
        });
      }
      updateData.pointsValue = points;
    }

    // Update item
    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        owner: {
          select: {
            displayName: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      error: 'Failed to update item'
    });
  }
};