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

const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name is too short"),
  body("phone")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Phone must contain at least 6 digits"),
];

const addressValidation = [
  body("label").optional().trim().isLength({ max: 120 }).withMessage("Label is too long"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("street").trim().notEmpty().withMessage("Street is required"),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required"),
  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),
];

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.get("/me", authenticate, authController.profile);
router.put("/me", authenticate, validate(updateProfileValidation), authController.updateProfile);

router.get("/addresses", authenticate, authController.listAddresses);
router.post("/addresses", authenticate, validate(addressValidation), authController.createAddress);
router.put(
  "/addresses/:id",
  authenticate,
  validate(addressValidation),
  authController.updateAddress
);
router.delete("/addresses/:id", authenticate, authController.deleteAddress);

module.exports = router;

