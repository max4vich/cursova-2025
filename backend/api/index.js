const serverless = require("serverless-http");
const app = require("../src/app");
const { connectPrisma } = require("../src/libs/prisma");

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    await connectPrisma();
    handler = serverless(app);
  }

  return handler(req, res);
};


