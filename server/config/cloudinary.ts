import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();                              // ← make sure .env is loaded first

// Call this **once**, right after you spin‑up Express.
export const connectCloudinary = () => {
  const opts: ConfigOptions = {
    cloud_name : process.env.CLOUDINARY_NAME!,
    api_key    : process.env.CLOUDINARY_API_KEY!,
    api_secret : process.env.CLOUDINARY_SECRET_KEY!,
    secure     : true                       // https URLs by default
  };

  cloudinary.config(opts);
  console.log('✅  Cloudinary connected');
};

export { cloudinary };     