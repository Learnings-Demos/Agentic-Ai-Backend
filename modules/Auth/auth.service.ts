import { LoginRequest, RegisterRequest } from "./auth.interface";
import UsersModel from "../User/user.model";
import {
  ComparePassword,
  generateToken,
  HashPassword,
} from "../../src/utils/security.helpers";

export const login = async (data: LoginRequest) => {
  const userInstance = await UsersModel.findOne({
    where: { email: data.email },
  });

  if (!userInstance) {
    throw new Error("User not found..!!");
  }

  let user = userInstance.toJSON();

  const isPasswordValid = await ComparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = generateToken(payload);

  return {
    token,
    ...payload,
  };
};

export const register = async (data: RegisterRequest) => {
  const existingDeveloper = await UsersModel.findOne({
    where: { email: data.email },
  });

  if (existingDeveloper) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await HashPassword(data.password);

  await UsersModel.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return {
    success: true,
  };
};
