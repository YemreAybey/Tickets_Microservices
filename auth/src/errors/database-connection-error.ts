import { CustomError, ICustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  readonly statusCode = 500;
  private readonly reason = "Error connecting to database";

  constructor() {
    super("Error connecting to database");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ICustomError[] {
    return [{ message: this.reason }];
  }
}
