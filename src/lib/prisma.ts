import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import config from "../config/index";

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
    prismaPool?: Pool;
};

const pool =
    globalForPrisma.prismaPool ??
    new Pool({
        connectionString: config.dbUrl,
    });

const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForPrisma.prismaPool = pool;
}

export { prisma };
