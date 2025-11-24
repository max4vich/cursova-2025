const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const reportService = require("../services/reportService");

const salesByCategory = asyncHandler(async (_req, res) => {
  const data = await reportService.salesByCategory();
  return success(res, data);
});

const revenue = asyncHandler(async (req, res) => {
  const data = await reportService.revenueByPeriod({
    from: req.query.from,
    to: req.query.to,
  });
  return success(res, data);
});

const topProducts = asyncHandler(async (req, res) => {
  const data = await reportService.topProducts(Number(req.query.limit) || 5);
  return success(res, data);
});

module.exports = {
  salesByCategory,
  revenue,
  topProducts,
};

