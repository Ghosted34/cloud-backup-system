import { Request, Response, NextFunction } from "express";
import {
  uploadFile,
  uploadFileToFolder,
  downloadFile,
  streamMediaFile,
  deleteMultipleFiles,
  downloadCompressedFile,
} from "../utils/aws/index.js";
import AppError from "../utils/AppError.js";
import { File } from "../models/file.js";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { Folder } from "../models/folder.js";
import { Op } from "sequelize";
import { errorResponse, successResponse } from "../utils/customResponse.js";

export class FileService {
  static async uploadFile(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { file, body } = req;
      const { user } = req;
      //   console.log(file, user, body);
      if (!file) {
        return next(new AppError("Please upload a file", 400, { error: null }));
      }

      const key = await uploadFile(req);
      console.log(key);

      const newFile = {
        name: req.file?.originalname,
        type: req.file?.mimetype,
        key: key,
        userId: user.id,
      };

      await File.create(newFile);
      successResponse(res, 201, "File uploaded successfully", null);
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return error;
    }
  }
  static async uploadFiletoFolder(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { file, body } = req;
      const { user } = req;
      console.log(body);

      if (!file) {
        return next(new AppError("Please upload a file", 400, { error: null }));
      }

      if (!body.folderId && !body.folderName) {
        return next(
          new AppError("Please select a folder", 400, { error: null })
        );
      }

      const folder: any = await Folder.findOne({
        where: {
          [Op.or]: [{ id: body.folderId }, { name: body.folderName }],
        },
      });

      if (!folder) {
        return next(
          new AppError("Please select an existing folder", 400, { error: null })
        );
      }

      const folderKey = folder?.key;
      const uuid = folder?.userId;
      const folderId = folder.id;

      if (uuid !== user.id) {
        return next(
          new AppError(
            "You do not have permission to upload to this folder",
            401,
            { error: null }
          )
        );
      }

      const key = await uploadFileToFolder(req, folderKey);

      const newFile = {
        name: req.file?.originalname,
        type: req.file?.mimetype,
        key: key,
        userId: user.id,
        folderId: folderId,
      };

      await File.create(newFile);
      return successResponse(res, 201, "File uploaded successfully", null);
    } catch (error: any) {
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  static async downloadFile(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { fileKey },
      } = req;

      if (!fileKey) {
        return next(
          new AppError("Please select a file to download", 400, { error: null })
        );
      }

      const file = await File.findOne({
        where: { userId: req.user.userId, key: String(fileKey) },
      });
      if (!file)
        return next(new AppError("No file found", 404, { error: null }));

      await downloadFile(req, res, file.dataValues.key);
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  static async downloadCompressedFile(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { fileKey },
      } = req;

      if (!fileKey) {
        return next(
          new AppError("Please select a file to download", 400, { error: null })
        );
      }

      const file = await File.findOne({
        where: { userId: req.user.userId, key: String(fileKey) },
      });
      if (!file)
        return next(new AppError("No file found", 404, { error: null }));

      await downloadCompressedFile(req, res, file.key);
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  static async streamMediaFile(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { fileKey },
      } = req;

      if (!fileKey) {
        return next(new AppError("Please select a file", 400, { error: null }));
      }

      const file = await File.findOne({
        where: { userId: req.user.userId, key: String(fileKey) },
      });
      if (!file)
        return next(new AppError("No file found", 404, { error: null }));

      const fileTypes = [
        "audio/mpeg",
        "audio/mp4",
        "audio/mp3",
        "audio/ogg",
        "audio/vnd.wav",
        "audio/wave",
        "video/mp4",
        "video/3gpp",
        "video/quicktime",
        "video/x-ms-wmv",
        "video/x-msvideo",
        "video/x-flv",
        "video/mkv",
      ];

      if (!fileTypes.includes(file.type)) {
        return next(
          new AppError("Please select a media file", 400, { error: null })
        );
      }

      await streamMediaFile(file.type, res, file.key, req);
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  // To User Controller
  static async fetchUserFiles(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { user } = req;

      if (!user) {
        return next(new AppError("Please login", 401, { error: null }));
      }

      const files = await File.findAll({ where: { userId: user.id } });

      return files;
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  // To Admin Controller
  static async fetchAllFiles(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const files = await File.findAll();

      return files;
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  static async markFile(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { key } = req.body;
      await File.update({ safe: false }, { where: { key: key } });
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  static async markFiles(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { keys } = req.body;
      await File.update({ safe: false }, { where: { key: keys as string[] } });
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }

  static async deleteUnsafeFiles(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const unsafeFiles = await File.findAll({ where: { safe: false } });
      const filepaths = unsafeFiles.map((file) => ({ Key: file.key }));

      await deleteMultipleFiles(req, filepaths);

      await File.destroy({ where: { safe: false } });
    } catch (error: any) {
      console.log(error);
      logger.error(formatLog(req, error.message));
      errorResponse(res, error.statusCode, error.message);
      return next(error);
    }
  }
}
