"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
// utils/cloudinary.ts
const cloudinary_1 = require("../config/cloudinary");
const stream_1 = require("stream");
const uploadToCloudinary = (fileBuffer, folder = 'items') => new Promise((resolve, reject) => {
    const stream = cloudinary_1.cloudinary.uploader.upload_stream({ folder }, (err, result) => (err ? reject(err) : resolve(result)));
    stream_1.Readable.from(fileBuffer).pipe(stream);
});
exports.uploadToCloudinary = uploadToCloudinary;
