const express = require("express");
const catalogController = require("../controllers/catalogController");

const router = express.Router();

router.get("/products", catalogController.listProducts);
router.get("/products/:id", catalogController.getProduct);
router.get("/categories", catalogController.listCategories);

module.exports = router;

