import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { decodeToken } from "../src/utils/security.helpers";
import { SendResponse } from "../src/utils/http.helpers";
import { HttpStatusCode } from "axios";

/* -------------------------------------------------------------------------- */
/*                         Validate Request Middleware                        */
/* -------------------------------------------------------------------------- */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return SendResponse({
      res,
      status: HttpStatusCode.BadRequest,
      message: "Validation failed",
      data: errors.array(),
    });
  }
  next();
};

/* -------------------------------------------------------------------------- */
/*                             Is Admin Middleware                            */
/* -------------------------------------------------------------------------- */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = decodeToken(token);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/* -------------------------------------------------------------------------- */
/*                           Is Developer Middleware                          */
/* -------------------------------------------------------------------------- */
export const isDeveloper = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = decodeToken(token);

    if (decoded.role !== "developer") {
      return res.status(403).json({ message: "Forbidden: Developers only" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
