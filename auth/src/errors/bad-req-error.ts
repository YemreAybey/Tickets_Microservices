import { CustomError, ICustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  readonly statusCode = 400;

  constructor(private reason: string) {
    super(reason);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ICustomError[] {
    return [{ message: this.reason }];
  }
}
