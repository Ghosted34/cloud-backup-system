var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { uploadFile, uploadFileToFolder, downloadFile, streamMediaFile, deleteMultipleFiles, downloadCompressedFile, } from "../utils/aws/index.js";
import AppError from "../utils/AppError.js";
import { File } from "../models/file.js";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { Folder } from "../models/folder.js";
import { Op } from "sequelize";
import { errorResponse, successResponse } from "../utils/customResponse.js";
export class FileService {
    static uploadFile(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { file, body } = req;
                const { user } = req;
                //   console.log(file, user, body);
                if (!file) {
                    return next(new AppError("Please upload a file", 400, { error: null }));
                }
                const key = yield uploadFile(req);
                console.log(key);
                const newFile = {
                    name: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                    type: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
                    key: key,
                    userId: user.id,
                };
                yield File.create(newFile);
                successResponse(res, 201, "File uploaded successfully", null);
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return error;
            }
        });
    }
    static uploadFiletoFolder(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { file, body } = req;
                const { user } = req;
                console.log(body);
                if (!file) {
                    return next(new AppError("Please upload a file", 400, { error: null }));
                }
                if (!body.folderId && !body.folderName) {
                    return next(new AppError("Please select a folder", 400, { error: null }));
                }
                const folder = yield Folder.findOne({
                    where: {
                        [Op.or]: [{ id: body.folderId }, { name: body.folderName }],
                    },
                });
                if (!folder) {
                    return next(new AppError("Please select an existing folder", 400, { error: null }));
                }
                const folderKey = folder === null || folder === void 0 ? void 0 : folder.key;
                const uuid = folder === null || folder === void 0 ? void 0 : folder.userId;
                const folderId = folder.id;
                if (uuid !== user.id) {
                    return next(new AppError("You do not have permission to upload to this folder", 401, { error: null }));
                }
                const key = yield uploadFileToFolder(req, folderKey);
                const newFile = {
                    name: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                    type: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
                    key: key,
                    userId: user.id,
                    folderId: folderId,
                };
                yield File.create(newFile);
                return successResponse(res, 201, "File uploaded successfully", null);
            }
            catch (error) {
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    static downloadFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { fileKey }, } = req;
                if (!fileKey) {
                    return next(new AppError("Please select a file to download", 400, { error: null }));
                }
                const file = yield File.findOne({
                    where: { userId: req.user.userId, key: String(fileKey) },
                });
                if (!file)
                    return next(new AppError("No file found", 404, { error: null }));
                yield downloadFile(req, res, file.dataValues.key);
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    static downloadCompressedFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { fileKey }, } = req;
                if (!fileKey) {
                    return next(new AppError("Please select a file to download", 400, { error: null }));
                }
                const file = yield File.findOne({
                    where: { userId: req.user.userId, key: String(fileKey) },
                });
                if (!file)
                    return next(new AppError("No file found", 404, { error: null }));
                yield downloadCompressedFile(req, res, file.key);
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    static streamMediaFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { fileKey }, } = req;
                if (!fileKey) {
                    return next(new AppError("Please select a file", 400, { error: null }));
                }
                const file = yield File.findOne({
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
                    return next(new AppError("Please select a media file", 400, { error: null }));
                }
                yield streamMediaFile(file.type, res, file.key, req);
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    // To User Controller
    static fetchUserFiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                if (!user) {
                    return next(new AppError("Please login", 401, { error: null }));
                }
                const files = yield File.findAll({ where: { userId: user.id } });
                return files;
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    // To Admin Controller
    static fetchAllFiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield File.findAll();
                return files;
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    static markFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { key } = req.body;
                yield File.update({ safe: false }, { where: { key: key } });
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    static markFiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keys } = req.body;
                yield File.update({ safe: false }, { where: { key: keys } });
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
    static deleteUnsafeFiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unsafeFiles = yield File.findAll({ where: { safe: false } });
                const filepaths = unsafeFiles.map((file) => ({ Key: file.key }));
                yield deleteMultipleFiles(req, filepaths);
                yield File.destroy({ where: { safe: false } });
            }
            catch (error) {
                console.log(error);
                logger.error(formatLog(req, error.message));
                errorResponse(res, error.statusCode, error.message);
                return next(error);
            }
        });
    }
}
