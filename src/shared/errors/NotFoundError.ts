import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(resource: string, message = "not found") {
    super(`${resource} ${message}`, 404);
  }
}
