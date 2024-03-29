import { Request, Response, NextFunction } from "express";

import {
  UnauthorizedError,
  BadRequestError,
} from "@src/exceptions/api-error";

interface ExtendedError extends Error {
  status: number;
  errors: any[];
}

export default function errorHandler(
  err: ExtendedError,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.log(err);
  if (err instanceof UnauthorizedError || err instanceof BadRequestError) {
    const { status, message, errors } = err;
    return res.status(status).json({ message, errors });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
}
