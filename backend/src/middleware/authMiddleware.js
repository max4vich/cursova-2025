const jwt = require("jsonwebtoken");
const { prisma } = require("../libs/prisma");
const config = require("../config/env");

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    const error = new Error("Authorization token missing");
    error.status = 401;
    throw error;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

const requireRole = (role) => (req, _res, next) => {
  if (req.user?.role !== role) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
  next();
};

module.exports = {
  authenticate,
  requireRole,
};

