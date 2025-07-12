"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItem = exports.deleteItem = exports.getMyItems = exports.getItemById = exports.getAllItems = exports.uploadItem = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
const uploadItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, condition, size, pointsValue } = req.body;
        const files = req.files;
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
        const imageUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    const uploadResult = yield (0, cloudinary_1.uploadToCloudinary)(file.buffer);
                    imageUrls.push(uploadResult.url);
                }
                catch (uploadError) {
                    console.error('Failed to upload image:', uploadError);
                    return res.status(500).json({
                        error: 'Failed to upload one or more images'
                    });
                }
            }
        }
        // Create item with images in a transaction
        const item = yield prisma_1.default.item.create({
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
    }
    catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({
            error: 'Failed to create item'
        });
    }
});
exports.uploadItem = uploadItem;
/**
 * Get all available items
 * GET /api/items
 */
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma_1.default.item.findMany({
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
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({
            error: 'Failed to fetch items'
        });
    }
});
exports.getAllItems = getAllItems;
/**
 * Get a single item by ID
 * GET /api/items/:id
 */
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield prisma_1.default.item.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({
            error: 'Failed to fetch item'
        });
    }
});
exports.getItemById = getItemById;
/**
 * Get all items belonging to the authenticated user
 * GET /api/items/my-items
 */
// items.controller.ts
const getMyItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id']; // ← Fake user ID in header
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }
    try {
        const items = yield prisma_1.default.item.findMany({
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
    }
    catch (error) {
        console.error('Error fetching user items:', error);
        res.status(500).json({
            error: 'Failed to fetch your items'
        });
    }
});
exports.getMyItems = getMyItems;
/**
 * Delete an item (only by owner)
 * DELETE /api/items/:id
 */
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if item exists and get owner info
        const item = yield prisma_1.default.item.findUnique({
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
        yield prisma_1.default.item.delete({
            where: { id }
        });
        res.status(200).json({
            message: 'Item deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({
            error: 'Failed to delete item'
        });
    }
});
exports.deleteItem = deleteItem;
/**
 * Update an item (only by owner, excluding images)
 * PATCH /api/items/:id
 */
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, category, condition, size, pointsValue, status } = req.body;
        // Check if item exists and get owner info
        const existingItem = yield prisma_1.default.item.findUnique({
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
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (category !== undefined)
            updateData.category = category;
        if (condition !== undefined)
            updateData.condition = condition;
        if (size !== undefined)
            updateData.size = size;
        if (status !== undefined)
            updateData.status = status;
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
        const updatedItem = yield prisma_1.default.item.update({
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
    }
    catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({
            error: 'Failed to update item'
        });
    }
});
exports.updateItem = updateItem;
