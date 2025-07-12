"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// multer.ts
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage(); // Change from diskStorage to memoryStorage
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
exports.default = upload;
