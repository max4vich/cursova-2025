const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/env");
const path = require("path");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: config.env === "development" ? "http://localhost:3000" : true,
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
  });
});


app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.env === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Database health check endpoint (using - instead of / to avoid routing issues on Vercel)
app.get("/health-db", async (_req, res) => {
  try {
    const { prisma } = require("./libs/prisma");
    // Try a simple query to test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPreview: process.env.DATABASE_URL 
        ? process.env.DATABASE_URL.split("@")[0] + "@***" 
        : "not set"
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPreview: process.env.DATABASE_URL 
        ? process.env.DATABASE_URL.split("@")[0] + "@***" 
        : "not set"
    });
  }
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

