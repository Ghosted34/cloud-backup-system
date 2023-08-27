import { Request, Response, NextFunction } from "express";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { UserService } from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/customResponse.js";
import { FileService } from "../services/file.service.js";

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    logger.info(formatLog(req, "Getting User"));
    try {
      const me = await UserService.getMe(req, res, next);
      if (!me) {
        return errorResponse(res, 401, "Not Logged In");
      }
      return successResponse(res, 200, "Gotten me", me);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  }

  static async getMyFiles(req: Request, res: Response, next: NextFunction) {
    logger.info(formatLog(req, "Getting My Files"));
    try {
      const files = await FileService.fetchUserFiles(req, res, next);

      return successResponse(res, 200, "Found My Files", files);
    } catch (error: any) {
      logger.error(formatLog(req, "Error Getting My Files"));
      console.log(error);
      return next(error);
    }
  }
}
