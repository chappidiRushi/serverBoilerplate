import { logger } from "@config/logger.config";
import { UserRouteCreateSchema, UserRouteLoginReq } from "components/user/user.validator";
import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt';
import { config } from '../../config/env.config';
import { UserCreate, UserLogin } from "./user.controller";
import { successResponse } from "../../utils/response.util";

export const userRoutes = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  )
  .post(
    "/register",
    async ({ body }) => {
      const newUser = await UserCreate(body);
      logger.info("user created", newUser);
      return successResponse(newUser, 201, "User Registration Completed Successfully");
    },
    {
      body: UserRouteCreateSchema,
      detail: {
        summary: "User Registration",
        description: "Register a new user with email, password, and other details.",
        tags: ["User", "Auth"]
      }
    }
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      const replyData = await UserLogin(body, jwt);
      return successResponse(replyData, 200, "Login Successfully");
    },
    {
      body: UserRouteLoginReq,
      detail: {
        summary: "User Login",
        description: "Authenticate a user and return a JWT token on success.",
        tags: ["User", "Auth"]
      }
    }
  );