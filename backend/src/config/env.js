const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: process.env.ENV_FILE
    ? path.resolve(process.cwd(), process.env.ENV_FILE)
    : undefined,
});

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@shop.com",
    password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
  },
};

module.exports = config;

