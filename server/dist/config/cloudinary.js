"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.connectCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ← make sure .env is loaded first
// Call this **once**, right after you spin‑up Express.
const connectCloudinary = () => {
    const opts = {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
        secure: true // https URLs by default
    };
    cloudinary_1.v2.config(opts);
    console.log('✅  Cloudinary connected');
};
exports.connectCloudinary = connectCloudinary;
