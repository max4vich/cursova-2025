const path = require("path");
const express = require("express");
const app = require("./app");
const config = require("./config/env");
const { ensureAdminUser } = require("./services/authService");

let server;

const start = async () => {
  try {
    // ⚠️ Prisma НЕ конектимо вручну
    // Prisma підключиться автоматично при першому запиті

    await ensureAdminUser();

    server = app.listen(config.port, () => {
      console.log(`API listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// static uploads (локально / VPS)
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

start();
