import { env } from "../config/config";
import { PrismaClient } from "../generated/prisma/index";

const globalWithPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient;
};

const prisma = globalWithPrisma.prisma ?? new PrismaClient();

if (env?.NODE_ENV === "development") globalWithPrisma.prisma = prisma;

export default prisma;
