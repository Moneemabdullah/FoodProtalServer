import multer from "multer";
import storage from "../config/cloudinary.config.js";


const upload = multer({ storage: storage });

export const uploadMiddleware = upload;
