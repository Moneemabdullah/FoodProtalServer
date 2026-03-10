import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "../config/index.js";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = config.dbUrl;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
