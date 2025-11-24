const path = require("path");
const express = require("express");
const app = require("./app");
const config = require("./config/env");
const { connectPrisma, disconnectPrisma } = require("./libs/prisma");
const { ensureAdminUser } = require("./services/authService");

let server;

const start = async () => {
  try {
    await connectPrisma();
    await ensureAdminUser();

    server = app.listen(config.port, () => {
      console.log(`API listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    await disconnectPrisma().catch(() => {});
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await disconnectPrisma().catch((err) => {
    console.error("Error disconnecting Prisma during shutdown", err);
  });

  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();

const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

