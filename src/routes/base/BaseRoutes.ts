import { Router } from "express";
import IRouter from "./Interface";

export default abstract class BaseRoutes implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  abstract routes(): void;
}
