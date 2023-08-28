import { describe, it } from "mocha";
import { AuthService } from "../services/auth.service.js";
import { Request, Response } from "express";
import { mock, stub, replace, restore } from "sinon";
import { Model } from "sequelize";
import { User } from "../models/user.js";
import { assert } from "chai";
import AppError from "../utils/AppError.js";

const users = [
  { email: "randomemail@gmail.com", password: "randompassword" },
  { email: "anotherRandomEmail@gmail.com", password: "anotherRandomPassword" },
];

describe("Auth Service", () => {
  beforeEach(() => {
    replace(User, "findOne", async (args: any) => {
      console.log(args);
      const query = args?.where;
      return users.find(({ email }) => email === query?.email);
    });
  });
  afterEach(() => {
    restore();
  });
  it("Should return User object", async () => {
    //@ts-ignore

    const request: Partial<Request> = {
      headers: {
        authorization: "Bearer randomToken",
      },
      body: {
        email: "randomemail@gmail.com",
        password: "randomPassword",
      },
    };
    const response: Partial<Response> = {};
    const next = (arg: any) => {
      return arg;
    };
    //@ts-ignore
    const result = await AuthService.signIn(request, response, next);
    assert.notInstanceOf(result, AppError);
    assert.isObject(result);
  });
  it("Should Fail with user not found", async () => {
    //@ts-ignore

    const request: Partial<Request> = {
      headers: {
        authorization: "Bearer randomToken",
      },
      body: {
        email: "randomEmail@gmail.com",
        password: "randomPassword",
      },
    };
    const response: Partial<Response> = {};
    const next = (arg: any) => {
      return arg;
    };
    //@ts-ignore
    const result = await AuthService.signIn(request, response, next);
    assert.instanceOf(result, AppError);
  });
});
