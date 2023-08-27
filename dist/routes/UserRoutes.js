import { Router } from "express";
import BaseRoutes from "./base/BaseRoutes.js";
import { UserController } from "../controller/UserController.js";
import { authenticate, isLoggedIn } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/me", authenticate, isLoggedIn, UserController.getMe);
router.get("/files", authenticate, isLoggedIn, UserController.getMyFiles);
class UserRoutes extends BaseRoutes {
    routes() {
        this.router.get("/me", authenticate, isLoggedIn, UserController.getMe);
        this.router.get("/files", authenticate, isLoggedIn, UserController.getMyFiles);
    }
}
export default new UserRoutes().router;
