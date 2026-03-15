import { configDotenv } from "dotenv";
import path from "path";

configDotenv({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    dbUrl: process.env.DATABASE_URL as string,
    OriginUrl: process.env.ORIGIN_URL as string,
    BaseUrl: process.env.BASE_URL as string,
    GoogleClientId: process.env.GOOGLE_CLIENT_ID as string,
    GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    AppHost: process.env.APP_HOST as string,
    AppPort: process.env.APP_PORT as string,
    AppUser: process.env.APP_USER as string,
    AppPassword: process.env.APP_PASSWORD as string,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
};

export default config;
