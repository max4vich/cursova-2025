const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone")
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Phone must contain at least 6 digits"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.get("/me", authenticate, authController.profile);

module.exports = router;

