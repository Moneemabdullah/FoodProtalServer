import type { UploadApiOptions } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "./index";

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

const folderName = "food-portal";

const storage = new CloudinaryStorage({
    cloudinary,
    params: (): UploadApiOptions => ({
        folder: folderName,
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    }),
});

export default storage;
