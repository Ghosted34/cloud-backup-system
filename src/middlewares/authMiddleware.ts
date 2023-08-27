import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import jwt, { Secret } from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../models/user.js";

const secret: Secret = process.env.JWT_SECRET as Secret;

export const authenticate = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in", 401, {
          error: null,
        })
      );
    }

    const decodedData: any = jwt.verify(token, secret);

    const currentUser = await User.findByPk(decodedData.id);

    if (!currentUser)
      return next(new AppError("User no longer exists", 401, { error: null }));

    // if (currentUser.changedPasswordAfter(decodedData.iat))
    //   next(
    //     new AppError("Password was recently changed. Please Login In Again", 401)
    //   );

    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  } catch (error: any) {
    return next(error);
  }
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      if (!token) return next();

      const decodedData: any = jwt.verify(token, secret);
      const currentUser = await User.findByPk(decodedData.id);

      if (!currentUser) return next();

      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next(error);
    }
  }
  next();
};

export const authorize =
  (...roles: any) =>
  (req: any, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!roles.includes(user.role))
      return next(
        new AppError(
          "User does not have permission to access this reource",
          403,
          { error: null }
        )
      );
    next();
  };
