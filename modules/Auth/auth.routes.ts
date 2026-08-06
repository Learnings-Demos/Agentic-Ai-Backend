import express from "express";
import * as AuthController from "./auth.controller";
import { validateLogin, validateRegister } from "./auth.validator";
import { validateRequest } from "../../middlewares/validate";

const app = express();

app.post("/login", validateLogin, validateRequest, AuthController.login);
app.post(
  "/register",
  validateRegister,
  validateRequest,
  AuthController.register
);

export default app;
