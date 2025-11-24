const express = require("express");
const authRoutes = require("./authRoutes");
const catalogRoutes = require("./catalogRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const adminRoutes = require("./adminRoutes");
const reportRoutes = require("./reportRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/catalog", catalogRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);
router.use("/reports", reportRoutes);

module.exports = router;

