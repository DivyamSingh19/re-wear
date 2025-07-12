// utils/cloudinary.ts
import { cloudinary } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder = 'items'
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result as UploadApiResponse))
    );
    Readable.from(fileBuffer).pipe(stream);
  });