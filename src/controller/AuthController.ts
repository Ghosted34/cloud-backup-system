import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { sendToken } from "../utils/createToken.js";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { errorResponse } from "../utils/customResponse.js";

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    // logger.info("Sign up");
    logger.info(formatLog(req, "Sign Up"));
    try {
      const user = await AuthService.signUp(req, res, next);
      if (user) return sendToken(user, 201, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }

    return;
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    logger.info("Sign in");

    try {
      const user = await AuthService.signIn(req, res, next);
      if (user) return sendToken(user, 201, res);
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 401, "User does not exist");
      return next(error);
    }
  }

  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    logger.info("Admin login");

    try {
      const admin = await AuthService.adminLogin(req, res, next);

      if (admin) return sendToken(admin, 201, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    } finally {
      return next();
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    logger.info(formatLog(req, "Logging Out"));
    try {
      return await AuthService.logout(req, res, next);
    } catch (error: any) {
      return next(error);
    }
  }
}
