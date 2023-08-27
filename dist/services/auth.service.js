var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import { RegistrationValidation, LoginValidation, } from "../utils/AuthValidation.js";
import AppError from "../utils/AppError.js";
import { User } from "../models/user.js";
export class AuthService {
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token;
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith("Bearer")) {
                    token = req.headers.authorization.split(" ")[1];
                }
                else if (req.cookies.jwt) {
                    token = req.cookies.jwt;
                }
                if (token) {
                    return next(new AppError("A user is already logged in, Please log out", 401, {
                        error: null,
                    }));
                }
                const { body } = req;
                const { error } = RegistrationValidation(body);
                if (error) {
                    return next(new AppError(`${error.message}`, 401, { error }));
                }
                const userFound = yield User.findOne({
                    where: {
                        email: body.email,
                    },
                });
                if (userFound) {
                    return next(new AppError("User already exists", 400, {
                        error: null,
                    }));
                }
                const user = User.create(body);
                return user;
            }
            catch (error) {
                console.log(error);
                return next(new AppError("Oops, Please try again later", 500, { error: null }));
            }
        });
    }
    static signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const { error } = LoginValidation(body);
                if (error) {
                    if (error) {
                        return next(new AppError("Error, Incomplete Values", 401, { error }));
                    }
                }
                const userFound = yield User.findOne({
                    where: {
                        email: body.email,
                    },
                });
                if (!userFound) {
                    return next(new AppError("User does not exist", 400, {
                        error: null,
                    }));
                }
                const confirmPasswd = bcrypt.compare(body.password, userFound.password);
                if (!confirmPasswd) {
                    return next(new AppError("Invalid credentials try again", 400, {
                        error: null,
                    }));
                }
                return userFound;
            }
            catch (error) {
                console.log(error);
                return next(new AppError("Oops, Please try again later", 500, { error: null }));
            }
        });
    }
    static adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const { error } = LoginValidation(body);
                if (error) {
                    if (error) {
                        return next(new AppError("Error, Incomplete Values", 401, { error }));
                    }
                }
                const userFound = yield User.findOne({
                    where: {
                        email: body.email,
                    },
                });
                if (!userFound) {
                    return next(new AppError("User does not exist", 400, {
                        error: null,
                    }));
                }
                const confirmPasswd = bcrypt.compare(body.password, userFound.password);
                if (!confirmPasswd) {
                    return next(new AppError("Invalid credentials try again", 400, {
                        error: null,
                    }));
                }
                if (userFound.role != "admin") {
                    return next(new AppError("User does not have authorization", 403, { error: null }));
                }
                return userFound;
            }
            catch (error) {
                console.log(error);
                return next(new AppError("Oops, Please try again later", 500, { error: null }));
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("jwt");
            res.status(200).json({ status: "success" });
        });
    }
}
