import multer from "multer";
import storage from "../config/cloudinary.config";


const upload = multer({ storage: storage });

export const uploadMiddleware = upload;
