var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileService } from "../services/file.service.js";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { successResponse } from "../utils/customResponse.js";
export class FileController {
    static uploadFile(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Upload ${(_a = req.file) === null || _a === void 0 ? void 0 : _a.mimetype}`);
            logger.info(formatLog(req, `Upload ${(_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype}`));
            try {
                return yield FileService.uploadFile(req, res, next);
                successResponse(res, 201, "File Uploaded", null);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }
    static uploadFileToFolder(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Upload ${(_a = req.file) === null || _a === void 0 ? void 0 : _a.mimetype} to ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.folderName}`);
            logger.info(formatLog(req, `Uploading ${(_c = req.file) === null || _c === void 0 ? void 0 : _c.mimetype}`));
            try {
                return yield FileService.uploadFiletoFolder(req, res, next);
                successResponse(res, 201, "File Uploaded To Folder", null);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    static downloadFile(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Download ${req.params.fileKey}`);
            logger.info(formatLog(req, `Downloading ${(_a = req.params) === null || _a === void 0 ? void 0 : _a.fileKey}`));
            try {
                return yield FileService.downloadFile(req, res, next);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }
    static downloadCompressedFile(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Download Compressed ${req.params.fileKey}`);
            logger.info(formatLog(req, `Downloading compressed ${(_a = req.params) === null || _a === void 0 ? void 0 : _a.fileKey}`));
            try {
                return yield FileService.downloadCompressedFile(req, res, next);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }
    static streamMediaFile(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Stream ${req.params.fileKey}`);
            logger.info(formatLog(req, `Streaming ${(_a = req.params) === null || _a === void 0 ? void 0 : _a.fileKey}`));
            try {
                return yield FileService.streamMediaFile(req, res, next);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }
}
