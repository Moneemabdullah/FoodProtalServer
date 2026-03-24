import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "../config/index";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = config.dbUrl;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
