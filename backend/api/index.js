const serverless = require("serverless-http");
const app = require("../src/app");

// ❗ НЕ імпортуємо Prisma
// ❗ НЕ викликаємо connectPrisma
// ❗ НЕ робимо cold-start логіки

const handler = serverless(app);

module.exports = async (req, res) => {
  return await handler(req, res);
};
