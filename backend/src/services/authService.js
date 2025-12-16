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

const updateProfile = async (userId, payload) => {
  const data = {};
  if (payload.name !== undefined) {
    data.name = payload.name;
  }
  if (payload.phone !== undefined) {
    data.phone = payload.phone;
  }
  if (Object.keys(data).length === 0) {
    return getProfile(userId);
  }
  await prisma.user.update({
    where: { id: userId },
    data,
  });
  return getProfile(userId);
};

const listAddresses = (userId) =>
  prisma.address.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });

const ensureAddressOwner = async (addressId, userId) => {
  const address = await prisma.address.findUnique({
    where: { id: Number(addressId) },
  });
  if (!address || address.userId !== userId) {
    const error = new Error("Address not found");
    error.status = 404;
    throw error;
  }
  return address;
};

const createAddress = (userId, payload) =>
  prisma.address.create({
    data: {
      userId,
      label: payload.label,
      city: payload.city,
      street: payload.street,
      postalCode: payload.postalCode,
      metadata: payload.metadata || null,
    },
  });

const updateAddress = async (userId, addressId, payload) => {
  await ensureAddressOwner(addressId, userId);
  return prisma.address.update({
    where: { id: Number(addressId) },
    data: {
      label: payload.label,
      city: payload.city,
      street: payload.street,
      postalCode: payload.postalCode,
      metadata: payload.metadata || null,
    },
  });
};

const deleteAddress = async (userId, addressId) => {
  await ensureAddressOwner(addressId, userId);
  await prisma.address.delete({
    where: { id: Number(addressId) },
  });
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
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  ensureAdminUser,
};

