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
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.env === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

