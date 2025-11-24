const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/apiResponse");
const orderService = require("../services/orderService");

const checkout = asyncHandler(async (req, res) => {
  const order = await orderService.checkout(req.user.id, req.body);
  return created(res, order);
});

const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders(req.user.id);
  return success(res, orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.params.id, req.user.id, req.user.role === "ADMIN");
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  return success(res, order);
});

module.exports = {
  checkout,
  listOrders,
  getOrder,
};

