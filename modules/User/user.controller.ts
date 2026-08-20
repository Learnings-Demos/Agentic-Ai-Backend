import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import * as UserService from "./user.service";
import { SendResponse } from "../../src/utils/http.helpers";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.createUser(req.body);

    return SendResponse({
      res,
      status: HttpStatusCode.Created,
      data: user,
      message: "User created successfully",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();

    return SendResponse({
      res,
      data: users,
      status: HttpStatusCode.Ok,
      message: "Fetched all users",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await UserService.getUserById(userId as string);
    if (!user) {
      return SendResponse({
        res,
        status: HttpStatusCode.NotFound,
        message: "User not found",
      });
    }
    return SendResponse({
      res,
      status: HttpStatusCode.Ok,
      data: user,
      message: "Fetched user",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const updated = await UserService.updateUser(userId as string, req.body);
    return SendResponse({
      res,
      status: HttpStatusCode.Ok,
      data: updated,
      message: "User updated",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const result = await UserService.deleteUser(userId as string);
    return SendResponse({
      res,
      status: HttpStatusCode.Ok,
      data: result,
      message: "User deleted",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};
