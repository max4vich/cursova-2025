const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/apiResponse");
const productService = require("../services/productService");
const adminService = require("../services/adminService");
const orderService = require("../services/orderService");

const listProducts = asyncHandler(async (req, res) => {
  const data = await productService.listProducts({
    search: req.query.search,
    category: req.query.category,
    page: Number(req.query.page) || 1,
    pageSize: Number(req.query.pageSize) || 50,
    inStock: req.query.inStock === "true" ? true : undefined,
  });
  return success(res, data);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return created(res, product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return success(res, product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return success(res, { deleted: true });
});

const listCategories = asyncHandler(async (_req, res) => {
  const categories = await adminService.listCategories();
  return success(res, categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await adminService.createCategory(req.body);
  return created(res, category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await adminService.updateCategory(req.params.id, req.body);
  return success(res, category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await adminService.deleteCategory(req.params.id);
  return success(res, { deleted: true });
});

const listPromotions = asyncHandler(async (_req, res) => {
  const promotions = await adminService.listPromotions();
  return success(res, promotions);
});

const upsertPromotion = asyncHandler(async (req, res) => {
  const promotion = await adminService.upsertPromotion(req.body);
  return success(res, promotion);
});

const listOrders = asyncHandler(async (_req, res) => {
  const orders = await orderService.listAllOrders();
  return success(res, orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  return success(res, order);
});

const listUsers = asyncHandler(async (_req, res) => {
  const users = await adminService.listUsers();
  return success(res, users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const allowedRoles = ["ADMIN", "CUSTOMER"];
  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }
  const user = await adminService.updateUserRole(req.params.id, role);
  return success(res, user);
});

const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Файл не завантажено");
    error.status = 400;
    throw error;
  }
  const imageUrl = adminService.buildPublicUploadUrl(req, req.file.filename);
  return success(res, { url: imageUrl });
});

const deletePromotion = asyncHandler(async (req, res) => {
  await adminService.deletePromotion(req.params.id);
  return success(res, { deleted: true });
});

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listPromotions,
  upsertPromotion,
  listOrders,
  updateOrderStatus,
  listUsers,
  updateUserRole,
  deletePromotion,
  uploadProductImage,
};

