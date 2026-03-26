import { configDotenv } from "dotenv";
import path from "path";

configDotenv({ path: path.join(process.cwd(), ".env") });

const defaultClientOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
];

const parseOriginList = (...values: Array<string | undefined>) => {
    const origins = values
        .flatMap((value) => (value ? value.split(",") : []))
        .map((origin) => origin.trim())
        .filter(Boolean);

    return [...new Set(origins)];
};

const port = process.env.PORT || "4040";
const baseUrl = process.env.BASE_URL?.trim() || `http://localhost:${port}`;
const allowedOrigins = parseOriginList(
    process.env.ORIGIN_URL,
    ...defaultClientOrigins,
);
const isSecureAuth = baseUrl.startsWith("https://");

const config = {
    port,
    JWT_SECRET: process.env.JWT_SECRET as string,
    dbUrl: process.env.DATABASE_URL as string,
    OriginUrl: process.env.ORIGIN_URL?.trim() || defaultClientOrigins[0],
    allowedOrigins,
    BaseUrl: baseUrl,
    isSecureAuth,
    isProduction: process.env.NODE_ENV === "production",
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
