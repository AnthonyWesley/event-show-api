import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(resource: string, message = "Forbidden") {
    super(` ${message} ${resource}`, 403);
  }
}
