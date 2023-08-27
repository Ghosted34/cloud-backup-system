var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { errorResponse, successResponse } from "../utils/customResponse.js";
import { UserService } from "../services/user.service.js";
import { FileService } from "../services/file.service.js";
export class AdminController {
    static getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Getting All Users"));
            try {
                const users = yield UserService.getAllUsers(req, res, next);
                successResponse(res, 200, "Gotten all users", users);
            }
            catch (error) {
                console.log(error);
                errorResponse(res, 500, "Server Error");
                return next(error);
            }
        });
    }
    static getUserbyId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Getting Specific User"));
            try {
                const user = yield UserService.getUserById(req, res, next);
                successResponse(res, 200, "Gotten user", user);
            }
            catch (error) {
                console.log(error);
                errorResponse(res, 500, "Server Error");
                return next(error);
            }
        });
    }
    static markFileUnsafe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Marking Unsafe File"));
            try {
                yield FileService.markFile(req, res, next);
                return successResponse(res, 200, "File marked as unsafe", null);
            }
            catch (error) {
                console.log(error);
                errorResponse(res, 500, "Server Error");
                return next(error);
            }
        });
    }
    static markFilesUnsafe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Marking Unsafe File"));
            try {
                yield FileService.markFiles(req, res, next);
                return successResponse(res, 200, "Files marked as unsafe", null);
            }
            catch (error) {
                console.log(error);
                errorResponse(res, 500, "Server Error");
                return next(error);
            }
        });
    }
    static deleteUnsafeFiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Deleting Unsafe Files"));
            try {
                yield FileService.deleteUnsafeFiles(req, res, next);
                return successResponse(res, 200, "Unsafe Files Deleted", null);
            }
            catch (error) {
                console.log(error);
                errorResponse(res, 500, "Server Error");
                return next(error);
            }
        });
    }
}
