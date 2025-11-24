const express = require("express");
const { authenticate, requireRole } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));

router.get("/products", adminController.listProducts);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

router.get("/categories", adminController.listCategories);
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.get("/promotions", adminController.listPromotions);
router.post("/promotions", adminController.upsertPromotion);
router.put("/promotions/:id", adminController.upsertPromotion);
router.delete("/promotions/:id", adminController.deletePromotion);

router.get("/orders", adminController.listOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

router.get("/users", adminController.listUsers);
router.patch("/users/:id/role", adminController.updateUserRole);

router.post("/uploads", upload.single("file"), adminController.uploadProductImage);

module.exports = router;

