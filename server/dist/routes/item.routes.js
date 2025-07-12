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
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = __importDefault(require("../middlewares/multer")); // multer setup for image uploads
const itemRouter = (0, express_1.Router)();
/* ---------- PUBLIC ROUTES ---------- */
itemRouter.get('/', product_controller_1.getAllItems); // GET  /api/items
itemRouter.get('/:id', product_controller_1.getItemById); // GET  /api/items/:id
/* ---------- SIMPLIFIED AUTH (via headers) ROUTES ---------- */
itemRouter.get('/my-items', product_controller_1.getMyItems); // GET  /api/items/my-items
// Create a new item (+ images)
itemRouter.post('/', multer_1.default.array('images', 6), // Multer handles image uploads
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        product_controller_1.uploadItem;
    }
    catch (error) {
        next();
    }
}));
// Update or delete an existing item
itemRouter.patch('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        product_controller_1.updateItem;
    }
    catch (error) {
        next();
    }
})); // PATCH /api/items/:id
itemRouter.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        product_controller_1.deleteItem;
    }
    catch (error) {
        next();
    }
}));
exports.default = itemRouter;
