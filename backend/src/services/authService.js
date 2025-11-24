const { prisma } = require("../libs/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");
const config = require("../config/env");

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const register = async ({ name, email, password, phone }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashed,
      cart: {
        create: {},
      },
    },
  });
  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      orders: {
        take: 5,
        orderBy: { placedAt: "desc" },
      },
    },
  });

  return sanitizeUser(user);
};

const ensureAdminUser = async () => {
  if (!config.admin.email || !config.admin.password) return;
  const admin = await prisma.user.findUnique({
    where: { email: config.admin.email },
  });
  if (admin) return;
  const hashed = await hashPassword(config.admin.password);
  await prisma.user.create({
    data: {
      name: "Administrator",
      email: config.admin.email,
      password: hashed,
      role: "ADMIN",
      cart: { create: {} },
    },
  });
  console.info("Default admin user created");
};

module.exports = {
  register,
  login,
  getProfile,
  ensureAdminUser,
};

