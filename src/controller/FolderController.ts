import { Request, Response, NextFunction } from "express";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { errorResponse, successResponse } from "../utils/customResponse.js";
import { FolderService } from "../services/folder.service.js";

export class FolderController {
  static async createFolder(req: Request, res: Response, next: NextFunction) {
    logger.info("Create folder");
    logger.info(formatLog(req, "Creating folder"));

    return await FolderService.createFolder(req, res, next);
  }
}
