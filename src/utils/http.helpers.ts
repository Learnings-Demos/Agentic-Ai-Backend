import { HttpStatusCode } from "axios";

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
