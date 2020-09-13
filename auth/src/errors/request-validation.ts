import { ValidationError } from "express-validator";
import { CustomError, ICustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  readonly statusCode = 400;
  constructor(private errors: ValidationError[]) {
    super("Invalid Request Error");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): ICustomError[] {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
