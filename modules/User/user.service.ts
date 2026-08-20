import { HashPassword } from "../../src/utils/security.helpers";
import { RegisterRequest } from "../Auth/auth.interface";
import UsersModel from "./user.model";

export const createUser = async (userData: RegisterRequest) => {
  const existingUser = await UsersModel.findOne({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new Error("Email already exist..!!");
  }

  const hashedPassword = await HashPassword(userData.password);

  return await UsersModel.create({
    ...userData,
    password: hashedPassword,
  });
};

export const getAllUsers = async () => {
  return await UsersModel.findAll({
    attributes: {
      exclude: ["password"],
    },
  });
};

export const getUserById = async (userId: string) => {
  const user = await UsersModel.findByPk(userId, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) throw new Error("User not found..!!");

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await UsersModel.findOne({
    where: { email },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    throw new Error("User not found..!!");
  }

  return user;
};

export const updateUser = async (
  userId: string,
  updateData: Partial<RegisterRequest>
) => {
  const user = await UsersModel.findByPk(userId);
  if (!user) throw new Error("User not found..!!");

  return await user.update(updateData);
};

export const deleteUser = async (userId: string) => {
  const user = await UsersModel.findByPk(userId);
  if (!user) throw new Error("User not found..!!");

  await user.destroy();
  return { message: "User deleted successfully" };
};
