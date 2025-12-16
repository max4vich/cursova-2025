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

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  return success(res, user);
});

const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await authService.listAddresses(req.user.id);
  return success(res, addresses);
});

const createAddress = asyncHandler(async (req, res) => {
  const address = await authService.createAddress(req.user.id, req.body);
  return created(res, address);
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await authService.updateAddress(req.user.id, req.params.id, req.body);
  return success(res, address);
});

const deleteAddress = asyncHandler(async (req, res) => {
  await authService.deleteAddress(req.user.id, req.params.id);
  return success(res, { deleted: true });
});

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};

