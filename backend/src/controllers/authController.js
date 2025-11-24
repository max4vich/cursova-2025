const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/apiResponse");
const authService = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return created(res, result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return success(res, result);
});

const profile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  return success(res, user);
});

module.exports = {
  register,
  login,
  profile,
};

