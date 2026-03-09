import { configDotenv } from "dotenv";
import path from "path/win32";

configDotenv({ path: path.join(process.cwd(), ".env") });

const config = {
    PORT: process.env.PORT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    dbUrl: process.env.DATABASE_URL as string,
    OriginUrl: process.env.ORIGIN_URL as string,
    BaseUrl: process.env.BASE_URL as string,
};

export default config;
