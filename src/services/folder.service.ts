import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import { Folder } from "../models/folder.js";
import { createFolder } from "../utils/aws/index.js";
import formatLog from "../utils/log/formatLog.js";
import logger from "../utils/log/logger.js";
import { successResponse, errorResponse } from "../utils/customResponse.js";

export class FolderService {
  static async createFolder(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body, user } = req;

      if (!user || !body.name) {
        return next(
          new AppError("Please input a folder name", 401, { error: null })
        );
      }

      const foundFolder = await Folder.findOne({ where: { name: body.name } });

      if (foundFolder) {
        throw new AppError(
          "This folder already exists, Please enter another name",
          401,
          { error: null }
        );
      }

      const key = body.name;
      body.key = key;
      body.userId = req.user.id;

      const folder = await Folder.create(body);

      const status = await createFolder(req);

      if (!status) {
        await Folder.destroy({ where: { id: folder.id } });
      }

      logger.info(formatLog(req, "Folder created"));
      successResponse(res, 201, "Folder Created", null);
    } catch (error: any) {
      console.log(error, 1);
      logger.error(formatLog(req, error.message));
      errorResponse(res, 400, error.message);
    }
  }
}
