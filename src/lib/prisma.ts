/* File: src/lib/prisma.ts */

import { PrismaClient } from "@prisma/client";

/* Singleton PrismaClient — menghindari multiple instance saat hot reload */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
