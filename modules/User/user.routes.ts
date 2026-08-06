import express from "express";
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} from "./user.validator";
import * as UserController from "./user.controller";
import { validateRequest } from "../../middlewares/validate";

const app = express();

app.get("/", UserController.getAllUsers);
app.get("/:id", validateUserId, validateRequest, UserController.getUserById);
app.post("/", validateCreateUser, validateRequest, UserController.createUser);
app.put("/:id", validateUpdateUser, validateRequest, UserController.updateUser);
app.delete("/:id", validateUserId, validateRequest, UserController.deleteUser);

export default app;
