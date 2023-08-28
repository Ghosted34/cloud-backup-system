import { Request, Response, NextFunction } from "express";
import { FileService } from "../services/file.service.js";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { errorResponse, successResponse } from "../utils/customResponse.js";

export class FileController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    logger.info(`Upload ${req.file?.mimetype}`);
    logger.info(formatLog(req, `Upload ${req.file?.mimetype}`));

    try {
      return await FileService.uploadFile(req, res, next);
      successResponse(res, 201, "File Uploaded", null);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  static async uploadFileToFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(`Upload ${req.file?.mimetype} to ${req.body?.folderName}`);
    logger.info(formatLog(req, `Uploading ${req.file?.mimetype}`));

    try {
      return await FileService.uploadFiletoFolder(req, res, next);
      successResponse(res, 201, "File Uploaded To Folder", null);
    } catch (error: any) {
      return next(error);
    }
  }

  static async downloadFile(req: Request, res: Response, next: NextFunction) {
    logger.info(`Download ${req.params.fileKey}`);
    logger.info(formatLog(req, `Downloading ${req.params?.fileKey}`));

    try {
      return await FileService.downloadFile(req, res, next);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  }

  static async downloadCompressedFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(`Download Compressed ${req.params.fileKey}`);
    logger.info(
      formatLog(req, `Downloading compressed ${req.params?.fileKey}`)
    );

    try {
      return await FileService.downloadCompressedFile(req, res, next);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  }

  static async streamMediaFile(req: any, res: Response, next: NextFunction) {
    logger.info(`Stream ${req.params.fileKey}`);
    logger.info(formatLog(req, `Streaming ${req.params?.fileKey}`));

    try {
      return await FileService.streamMediaFile(req, res, next);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  }

  static async getFileHistory(req: any, res: Response, next: NextFunction) {
    logger.info(`Getting ${req.user?.name}'s`);
    logger.info(formatLog(req, `Getting ${req.user?.name}'s`));

    try {
      const history = await FileService.fetchUserFileHistory(req, res, next);
      successResponse(res, 201, "File History Gotten", history);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}
