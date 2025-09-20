import { logger } from "@config/logger.config";
import { ZResErrorCommon, ZResOK } from "@utils/zod.util";
import { UserRouteCreateSchema, UserRouteLoginReply, UserRouteLoginReq, UserSelectSchema } from "components/user/user.validator";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserCreate, UserLogin } from "./user.controller";


export const userRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/register",
    {
      schema: {
        summary: "User Registration",
        description: "Register a new user with email, password, and other details.",
        tags: ["User", "Auth"],
        body: UserRouteCreateSchema.describe("User registration payload"),
        response: {
          201: ZResOK(UserSelectSchema.omit({ password: true })).describe("User registration success response"),
          400: ZResErrorCommon["400"].describe("Bad request - validation or business error"),
          500: ZResErrorCommon["500"].describe("Internal server error"),
        },
      },
    },
    async (req, reply) => {
      const newUser = await UserCreate(req.body);
      logger.info("user crated", newUser);
      return reply.success(newUser, 201, "User Registration Completed Successfully");
    }
  );


  fastify.post(
    "/login",
    {
      schema: {
        summary: "User Login",
        description: "Authenticate a user and return a JWT token on success.",
        tags: ["User", "Auth"],
        body: UserRouteLoginReq.describe("User login credentials"),
        response: {
          200: ZResOK(UserRouteLoginReply).describe("Login success response with JWT"),
          400: ZResErrorCommon["400"].describe("Invalid credentials or validation error"),
          500: ZResErrorCommon["500"].describe("Internal server error"),
        },

      },
    },
    async (req, reply) => {
      const replyData = await UserLogin(req.body, reply);

      // logger.info("user crated", newUser);
      return reply.success(replyData, 200, "Login Successfully");
    }
  );

  // Get All Products
  // fastify.get(
  //   "/",
  //   {
  //     schema: {
  //       summary: "Get All Products",
  //       response: {
  //         200: SuccessResponseSchema(z.array(ProductSchema)),
  //         ...CommonErrorSchema
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     // throw CE.BAD_REQUEST_400("This is a simulated Error")
  //     return reply.success(roducts, 200, "Products retrieved successfully");
  //   }
  // );

  // // Get Product by ID
  // fastify.get(
  //   "/:id",
  //   {
  //     schema: {
  //       summary: "Get Product by ID",
  //       params: z.object({ id: z.string().uuid() }),
  //       response: { 200: SuccessResponseSchema(ProductSchema) },
  //     },
  //   },
  //   async (req, reply) => {
  //     const product = products.find((p) => p.id === req.params.id);
  //     // if (!product) return reply.code(404).send({ message: "Product not found" });
  //     return reply.success(product, 201, "Product retrieved successfully");
  //   }
  // );

  // // Update Product
  // fastify.put(
  //   "/:id",
  //   {
  //     schema: {
  //       summary: "Update Product",
  //       params: z.object({ id: z.string().uuid() }),
  //       body: UpdateProductSchema,
  //       response: { 200: SuccessResponseSchema(ProductSchema) },
  //     },
  //   },
  //   async (req, reply) => {
  //     const index = products.findIndex((p) => p.id === req.params.id);
  //     // if (index === -1) return reply.code(404).send({ message: "Product not found" });

  //     products[index] = { ...products[index], ...req.body } as any;
  //     return reply.success(products[index], 200, "Product updated successfully");
  //   }
  // );

  // // Delete Product
  // fastify.delete(
  //   "/:id",
  //   {
  //     schema: {
  //       summary: "Delete Product",
  //       params: z.object({ id: z.string().uuid() }),
  //       response: { 200: SuccessResponseSchema(z.object({ message: z.string() })) },
  //     },
  //   },
  //   async (req, reply) => {
  //     products = products.filter((p) => p.id !== req.params.id);
  //     return reply.success({ message: "Product deleted successfully" }, 200, "Product deleted");
  //   }
  // );
};