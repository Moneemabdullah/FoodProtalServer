import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import config from "./index.js";

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.dbUrl,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
});

export default prisma;
