var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { User } from "../models/user.js";
const secret = process.env.JWT_SECRET;
export class UserService {
    static getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User.findAll({
                    attributes: { exclude: ["password"] },
                });
                return users;
            }
            catch (error) {
                console.log(error);
                res.json({
                    message: "Server Error, please try again later",
                });
            }
        });
    }
    static getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield User.findByPk(id, {
                    attributes: { exclude: ["password"] },
                });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.jwt;
                if (!token) {
                    return next(new AppError("You are not logged in.", 401, { error: null }));
                }
                const decodedData = jwt.verify(token, secret);
                const currentUser = yield User.findByPk(decodedData.id);
                if (!currentUser) {
                    return next(new AppError("User no longer exists", 401, { error: null }));
                }
                return currentUser;
            }
            catch (error) { }
        });
    }
}
