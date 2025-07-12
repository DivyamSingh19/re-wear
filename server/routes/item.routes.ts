import { NextFunction, Router } from 'express';
import {
  uploadItem,
  getAllItems,
  getItemById,
  getMyItems,
  deleteItem,
  updateItem,
} from '../controllers/product.controller';

import upload from '../middlewares/multer'; // multer setup for image uploads
import { Request,Response } from 'express';
const itemRouter = Router();

/* ---------- PUBLIC ROUTES ---------- */
itemRouter.get('/', getAllItems);            // GET  /api/items
itemRouter.get('/:id', getItemById);         // GET  /api/items/:id

/* ---------- SIMPLIFIED AUTH (via headers) ROUTES ---------- */
itemRouter.get('/my-items', getMyItems);     // GET  /api/items/my-items

// Create a new item (+ images)
itemRouter.post(
  '/',
  upload.array('images', 6),             // Multer handles image uploads
  async (req:Request,res:Response, next:NextFunction) => {
    try {
        uploadItem 
    } catch (error) {
        next()
    }
  }
);

// Update or delete an existing item
itemRouter.patch('/:id', async (req:Request,res:Response, next:NextFunction) => {
    try {
        updateItem 
    } catch (error) {
        next()
    }
  });        // PATCH /api/items/:id
itemRouter.delete('/:id', async (req:Request,res:Response, next:NextFunction) => {
    try {
        deleteItem 
    } catch (error) {
        next()
    }
  });       

export default itemRouter;
