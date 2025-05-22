import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";

export function ErrorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(error);

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  response.status(500).json({ error: "Error internal server" });
}
