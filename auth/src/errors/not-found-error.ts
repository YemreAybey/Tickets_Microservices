import { CustomError, ICustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  readonly statusCode = 404;

  constructor() {
    super("Route not found");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ICustomError[] {
    return [{ message: "Not Found" }];
  }
}
