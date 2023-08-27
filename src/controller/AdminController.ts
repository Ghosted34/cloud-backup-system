import { Request, Response, NextFunction } from "express";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { errorResponse, successResponse } from "../utils/customResponse.js";
import { UserService } from "../services/user.service.js";
import { FileService } from "../services/file.service.js";

export class AdminController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    logger.info(formatLog(req, "Getting All Users"));

    try {
      const users = await UserService.getAllUsers(req, res, next);

      successResponse(res, 200, "Gotten all users", users);
    } catch (error: any) {
      console.log(error);

      errorResponse(res, 500, "Server Error");
      return next(error);
    }
  }

  static async getUserbyId(req: Request, res: Response, next: NextFunction) {
    logger.info(formatLog(req, "Getting Specific User"));

    try {
      const user = await UserService.getUserById(req, res, next);

      successResponse(res, 200, "Gotten user", user);
    } catch (error: any) {
      console.log(error);

      errorResponse(res, 500, "Server Error");
      return next(error);
    }
  }

  static async markFileUnsafe(req: Request, res: Response, next: NextFunction) {
    logger.info(formatLog(req, "Marking Unsafe File"));
    try {
      await FileService.markFile(req, res, next);
      return successResponse(res, 200, "File marked as unsafe", null);
    } catch (error: any) {
      console.log(error);

      errorResponse(res, 500, "Server Error");
      return next(error);
    }
  }
  static async markFilesUnsafe(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(formatLog(req, "Marking Unsafe File"));

    try {
      await FileService.markFiles(req, res, next);
      return successResponse(res, 200, "Files marked as unsafe", null);
    } catch (error: any) {
      console.log(error);

      errorResponse(res, 500, "Server Error");
      return next(error);
    }
  }
  static async deleteUnsafeFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(formatLog(req, "Deleting Unsafe Files"));

    try {
      await FileService.deleteUnsafeFiles(req, res, next);
      return successResponse(res, 200, "Unsafe Files Deleted", null);
    } catch (error: any) {
      console.log(error);

      errorResponse(res, 500, "Server Error");
      return next(error);
    }
  }
}
