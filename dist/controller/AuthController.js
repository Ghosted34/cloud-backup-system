var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthService } from "../services/auth.service.js";
import { sendToken } from "../utils/createToken.js";
import logger from "../utils/log/logger.js";
import formatLog from "../utils/log/formatLog.js";
import { errorResponse } from "../utils/customResponse.js";
export class AuthController {
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info("Sign up");
            logger.info(formatLog(req, "Sign Up"));
            try {
                const user = yield AuthService.signUp(req, res, next);
                if (user)
                    return sendToken(user, 201, res);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
            return;
        });
    }
    static signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Sign in");
            try {
                const user = yield AuthService.signIn(req, res, next);
                if (user)
                    return sendToken(user, 201, res);
            }
            catch (error) {
                console.log(error);
                errorResponse(res, 401, "User does not exist");
                return next(error);
            }
        });
    }
    static adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Admin login");
            try {
                const admin = yield AuthService.adminLogin(req, res, next);
                if (admin)
                    return sendToken(admin, 201, res);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
            finally {
                return next();
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(formatLog(req, "Logging Out"));
            try {
                return yield AuthService.logout(req, res, next);
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
