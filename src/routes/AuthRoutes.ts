import { Router } from "express";
import { AuthController } from "../controller/AuthController.js";
import BaseRoutes from "./base/BaseRoutes.js";

const router: Router = Router();

router.post("/register", AuthController.signUp);
router.post("/login", AuthController.signIn);
router.get("/logout", AuthController.logout);

class AuthRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post("/register", AuthController.signUp);
    this.router.post("/login", AuthController.signIn);
    this.router.get("/logout", AuthController.logout);
  }
}

export default new AuthRoutes().router;
