const { PrismaClient } = require("@prisma/client");

/**
 * Prisma singleton for serverless environments (Vercel friendly)
 *
 * - Uses globalThis to persist instance across hot reloads
 * - Optimized for serverless with proper connection handling
 * - Handles connection errors gracefully
 */

let prisma;

// Prisma Client options
const prismaOptions = {
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
};

// Use singleton pattern for both dev and production to prevent connection exhaustion
if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient(prismaOptions);

  // Handle connection errors (Prisma event handling)
  // Note: Prisma error events are handled automatically by the client

  // Graceful shutdown
  if (process.env.NODE_ENV !== "production") {
    process.on("beforeExit", async () => {
      await globalThis.prisma.$disconnect();
    });
  }
}

prisma = globalThis.prisma;

module.exports = { prisma };
