const express = require("express");
const { authenticate, requireRole } = require("../middleware/authMiddleware");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));

router.get("/sales-by-category", reportController.salesByCategory);
router.get("/revenue", reportController.revenue);
router.get("/top-products", reportController.topProducts);

module.exports = router;

