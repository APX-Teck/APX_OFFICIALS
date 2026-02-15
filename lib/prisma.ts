import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { config } from "dotenv";
config();

declare global {
  var prisma: PrismaClient | undefined;
  var pool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL environment variable is not set");
}

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL;

const pool =
  global.pool ||
  new Pool({
    connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    max: isProduction ? 20 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

const adapter = new PrismaPg(pool);

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

if (!isProduction) {
  global.prisma = prisma;
  global.pool = pool;
}

export default prisma;
