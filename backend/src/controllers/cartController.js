const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const cartService = require("../services/cartService");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user.id);
  return success(res, cart);
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body.productId, req.body.quantity);
  return success(res, cart);
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(
    req.user.id,
    req.params.itemId,
    req.body.quantity
  );
  return success(res, cart);
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);
  return success(res, cart);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  return success(res, cart);
});

const applyPromotion = asyncHandler(async (req, res) => {
  const cart = await cartService.applyPromotion(req.user.id, req.body.code);
  return success(res, cart);
});

const removePromotion = asyncHandler(async (req, res) => {
  const cart = await cartService.removePromotion(req.user.id);
  return success(res, cart);
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  applyPromotion,
  removePromotion,
};

