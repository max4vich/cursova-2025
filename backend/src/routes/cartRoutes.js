const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:itemId", cartController.updateItem);
router.delete("/items/:itemId", cartController.removeItem);
router.delete("/", cartController.clearCart);
router.post("/apply-promo", cartController.applyPromotion);
router.delete("/promo", cartController.removePromotion);

module.exports = router;

