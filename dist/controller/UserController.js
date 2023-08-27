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
import { UserService } from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/customResponse.js";
import { FileService } from "../services/file.service.js";
export class UserController {
    static getMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Getting User"));
            try {
                const me = yield UserService.getMe(req, res, next);
                if (!me) {
                    return errorResponse(res, 401, "Not Logged In");
                }
                return successResponse(res, 200, "Gotten me", me);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }
    static getMyFiles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Getting My Files"));
            try {
                const files = yield FileService.fetchUserFiles(req, res, next);
                return successResponse(res, 200, "Found My Files", files);
            }
            catch (error) {
                logger.error(formatLog(req, "Error Getting My Files"));
                console.log(error);
                return next(error);
            }
        });
    }
}
