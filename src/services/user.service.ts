import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { User } from "../models/user.js";
import { jwtSecret } from "../config/index.js";

const secret: Secret = jwtSecret as Secret;
export class UserService {
  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      return users;
    } catch (error) {
      console.log(error);
      res.json({
        message: "Server Error, please try again later",
      });
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params as any;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  static async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        return next(
          new AppError("You are not logged in.", 401, { error: null })
        );
      }

      const decodedData: any = jwt.verify(token, secret);

      const currentUser = await User.findByPk(decodedData.id);

      if (!currentUser) {
        return next(
          new AppError("User no longer exists", 401, { error: null })
        );
      }

      return currentUser;
    } catch (error) {}
  }
}
