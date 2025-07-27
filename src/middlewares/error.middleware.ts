import { NextFunction, Request, Response } from "express";
import { env } from "../config/config";

const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err?.statusCode ?? 500;

  res.status(statusCode).json({
    message: err?.message || "Internal server error",
    success: err?.success || false,
    data: err?.data || null,
    error: err?.error || [],
    stack: env?.NODE_ENV === "development" ? err?.stack : "",
  });
};

export default errorHandler;
