const jwt = require("jsonwebtoken");
const config = require("../config/env");

const generateToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

module.exports = { generateToken };

