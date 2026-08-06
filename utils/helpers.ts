import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { JWTRequest } from "../modules/Auth/auth.interface";

interface ResponsePayload<T> {
  res: any;
  status?: number;
  data?: T | null;
  message?: string;
}

export const SendResponse = <T>({
  res,
  status = HttpStatusCode.Ok,
  data = null,
  message = "",
}: ResponsePayload<T>) => {
  return res.status(status).json({
    status,
    data,
    message,
  });
};

export const HashPassword = async (password: string): Promise<string> => {
  const salt_rounds = 10;
  return await bcrypt.hash(password, salt_rounds);
};

export const ComparePassword = async (
  plain: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

export const generateToken = (payload: JWTRequest) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

export const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const generateUUID = () => {
  return uuidv4();
};
