var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AppError from "../utils/AppError.js";
import { Folder } from "../models/folder.js";
import { createFolder } from "../utils/aws/index.js";
import formatLog from "../utils/log/formatLog.js";
import logger from "../utils/log/logger.js";
import { successResponse, errorResponse } from "../utils/customResponse.js";
export class FolderService {
    static createFolder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                if (!body || !body.name) {
                    return next(new AppError("Please input a folder name", 401, { error: null }));
                }
                const foundFolder = yield Folder.findOne({ where: { name: body.name } });
                if (foundFolder) {
                    throw new AppError("This folder already exists, Please enter another name", 401, { error: null });
                }
                const key = body.name;
                body.key = key;
                body.userId = req.user.id;
                const folder = yield Folder.create(body);
                const status = yield createFolder(req);
                if (!status) {
                    yield Folder.destroy({ where: { id: folder.id } });
                }
                logger.info(formatLog(req, "Folder created"));
                successResponse(res, 201, "Folder Created", null);
            }
            catch (error) {
                console.log(error, 1);
                logger.error(formatLog(req, error.message));
                errorResponse(res, 400, error.message);
            }
        });
    }
}
