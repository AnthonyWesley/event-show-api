import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(resource: string, message = "Conflict:") {
    super(`${message} ${resource}`, 409);
  }
}
