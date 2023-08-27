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
import { FolderService } from "../services/folder.service.js";
export class FolderController {
    static createFolder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Create folder");
            logger.info(formatLog(req, "Creating folder"));
            return yield FolderService.createFolder(req, res, next);
        });
    }
}
