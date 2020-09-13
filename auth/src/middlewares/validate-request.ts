import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
import { RequestValidationError } from "../errors/request-validation";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
