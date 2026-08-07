import { body, param } from "express-validator";

export const validateQuery = [
  body("query").notEmpty().withMessage("Query Message is required"),
];

export const validateParamThreadId = [
  param("threadId").optional().isUUID(4).withMessage("Invalid Thread ID"),
];

export const validateUpdateThreadPayload = [
  body("title").optional().isString().withMessage("Title must be a string"),
  body("status").optional().isString().withMessage("Status must be a string"),
];

export const validateHumanApproval = [
  body("user_response")
    .exists({ checkFalsy: true })
    .withMessage("user_response is required")
    .isIn(["Approve", "Reject"])
    .withMessage("user_response must be either 'Approve' or 'Reject'"),
];
