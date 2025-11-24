const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const productService = require("../services/productService");

const listProducts = asyncHandler(async (req, res) => {
  const data = await productService.listProducts({
    search: req.query.search,
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    inStock: req.query.inStock === "true",
    page: Number(req.query.page) || 1,
    pageSize: Number(req.query.pageSize) || 20,
  });
  return success(res, data);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  return success(res, product);
});

const listCategories = asyncHandler(async (_req, res) => {
  const categories = await productService.listCategories();
  return success(res, categories);
});

module.exports = {
  listProducts,
  getProduct,
  listCategories,
};

