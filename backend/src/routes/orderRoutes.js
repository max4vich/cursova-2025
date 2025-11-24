const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.use(authenticate);

router.post("/checkout", orderController.checkout);
router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrder);

module.exports = router;

