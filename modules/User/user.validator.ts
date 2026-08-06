import { param, body } from "express-validator";

export const validateUserId = [
  param("id")
    .isUUID(4)
    .withMessage("Invalid user ID"),
];

export const validateCreateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateUpdateUser = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
  body("name").optional().notEmpty().withMessage("Name must not be empty"),
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
