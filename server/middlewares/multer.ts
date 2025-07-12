// multer.ts
import multer from "multer";

const storage = multer.memoryStorage(); // Change from diskStorage to memoryStorage

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;