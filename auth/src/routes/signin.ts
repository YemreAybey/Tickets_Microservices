import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  body,
  validationResult,
  Result,
  ValidationError,
} from "express-validator";
import { RequestValidationError } from "../errors/request-validation";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-req-error";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email")
      .trim()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("You must provide an email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("You must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("There is no such user");
    }
  }
);

export { router as signinRouter };
