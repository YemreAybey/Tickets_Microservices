import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@eatickets/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email")
      .trim()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("You must provide an email")
      .isEmail()
      .withMessage("Email must be valid"),
    // .custom(async (email: string) => {
    //   const user = await User.findOne({ email });
    //   if (user) {
    //     return Promise.reject("E-mail already in use");
    //   }
    // }),
    body("password")
      .trim()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("You must provide a password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store it in the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
