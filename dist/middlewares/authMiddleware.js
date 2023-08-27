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
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const secret = process.env.JWT_SECRET;
export const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(new AppError("You are not logged in! Please log in", 401, {
                error: null,
            }));
        }
        const decodedData = jwt.verify(token, secret);
        const currentUser = yield User.findByPk(decodedData.id);
        if (!currentUser)
            return next(new AppError("User no longer exists", 401, { error: null }));
        // if (currentUser.changedPasswordAfter(decodedData.iat))
        //   next(
        //     new AppError("Password was recently changed. Please Login In Again", 401)
        //   );
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    }
    catch (error) {
        return next(error);
    }
});
export const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.jwt) {
        try {
            const token = req.cookies.jwt;
            if (!token)
                return next();
            const decodedData = jwt.verify(token, secret);
            const currentUser = yield User.findByPk(decodedData.id);
            if (!currentUser)
                return next();
            res.locals.user = currentUser;
            return next();
        }
        catch (error) {
            return next(error);
        }
    }
    next();
});
export const authorize = (...roles) => (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
        return next(new AppError("User does not have permission to access this reource", 403, { error: null }));
    next();
};
