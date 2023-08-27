import { Router } from "express";
export default class BaseRoutes {
    constructor() {
        this.router = Router();
        this.routes();
    }
}
