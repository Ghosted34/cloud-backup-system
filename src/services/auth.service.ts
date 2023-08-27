import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import {
  RegistrationValidation,
  LoginValidation,
} from "../utils/AuthValidation.js";
import AppError from "../utils/AppError.js";
import { User } from "../models/user.js";
import { sendToken } from "../utils/createToken.js";

export class AuthService {
  static async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      let token: any;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (token) {
        return next(
          new AppError("A user is already logged in, Please log out", 401, {
            error: null,
          })
        );
      }

      const { body } = req;

      const { error } = RegistrationValidation(body);

      if (error) {
        return next(new AppError(`${error.message}`, 401, { error }));
      }

      const userFound = await User.findOne({
        where: {
          email: body.email,
        },
      });

      if (userFound) {
        return next(
          new AppError("User already exists", 400, {
            error: null,
          })
        );
      }

      const user = User.create(body);
      return user;
    } catch (error) {
      console.log(error);
      return next(
        new AppError("Oops, Please try again later", 500, { error: null })
      );
    }
  }

  static async signIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { body } = req;
      const { error } = LoginValidation(body);

      if (error) {
        if (error) {
          return next(new AppError("Error, Incomplete Values", 401, { error }));
        }
      }

      const userFound = await User.findOne({
        where: {
          email: body.email,
        },
      });

      if (!userFound) {
        return next(
          new AppError("User does not exist", 400, {
            error: null,
          })
        );
      }

      const confirmPasswd = bcrypt.compare(body.password, userFound.password);

      if (!confirmPasswd) {
        return next(
          new AppError("Invalid credentials try again", 400, {
            error: null,
          })
        );
      }

      return userFound;
    } catch (error) {
      console.log(error);
      return next(
        new AppError("Oops, Please try again later", 500, { error: null })
      );
    }
  }

  static async adminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { body } = req;
      const { error } = LoginValidation(body);

      if (error) {
        if (error) {
          return next(new AppError("Error, Incomplete Values", 401, { error }));
        }
      }

      const userFound = await User.findOne({
        where: {
          email: body.email,
        },
      });

      if (!userFound) {
        return next(
          new AppError("User does not exist", 400, {
            error: null,
          })
        );
      }

      const confirmPasswd = bcrypt.compare(body.password, userFound.password);

      if (!confirmPasswd) {
        return next(
          new AppError("Invalid credentials try again", 400, {
            error: null,
          })
        );
      }

      if (userFound.role != "admin") {
        return next(
          new AppError("User does not have authorization", 403, { error: null })
        );
      }
      return userFound;
    } catch (error) {
      console.log(error);
      return next(
        new AppError("Oops, Please try again later", 500, { error: null })
      );
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    res.clearCookie("jwt");
    res.status(200).json({ status: "success" });
  }
}
