import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import * as AuthService from "./auth.service";
import { SendResponse } from "../../src/utils/http.helpers";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const payload = { email, password };

    const developer = await AuthService.login(payload);
    return SendResponse({
      res,
      data: developer,
      status: HttpStatusCode.Ok,
      message: "Login Success..!!",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const payload = { name, email, password };

    const developer = await AuthService.register(payload);
    return SendResponse({
      res,
      data: developer,
      status: HttpStatusCode.Ok,
      message: "Registered Successfully..!!",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};
