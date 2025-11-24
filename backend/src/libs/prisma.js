require("../config/env");
const { PrismaClient, Prisma } = require("@prisma/client");

if (Prisma?.Decimal) {
  Prisma.Decimal.prototype.toJSON = function toJSON() {
    return this.toNumber();
  };
}

const createClient = () => new PrismaClient();

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = createClient();
} else {
  if (!global.__prisma) {
    global.__prisma = createClient();
  }
  prisma = global.__prisma;
}

let isConnected = false;

async function connectPrisma() {
  if (!isConnected) {
    await prisma.$connect();
    isConnected = true;
  }
  return prisma;
}

async function disconnectPrisma() {
  if (isConnected) {
    await prisma.$disconnect();
    isConnected = false;
  }
}

module.exports = {
  prisma,
  connectPrisma,
  disconnectPrisma,
};