const { PrismaClient } = require("@prisma/client");

/**
 * Prisma singleton for serverless environments (Vercel friendly)
 *
 * - No explicit $connect()
 * - Prevents multiple connections in hot reload / serverless
 * - Uses globalThis to persist instance
 */

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

module.exports = { prisma };
