import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { colorCreate, colorUpdate } from "../controllers/color.controller";
import { ErrorCommonSchemas, SuccessResponseSchema } from "../utils/response";
import { ZColor, ZColorRouteCreate, ZColorRouteUpdate } from "../validators/color.validator";


export const colorRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/crate",
    {
      schema: {
        summary: "Create Add",
        body: ZColorRouteCreate,
        response: {
          201: SuccessResponseSchema(ZColor),
          400: ErrorCommonSchemas["400"],
          500: ErrorCommonSchemas["500"],
        },
      },
    },
    async (req, reply) => {
      // const newUser = await UserCreate(req.body);
      const newColor = await colorCreate(req.body);
      return reply.success(newColor, 201, "Color Created Successfully");
    }
  );
  fastify.post(
    "/update",
    {
      schema: {
        summary: "User Login",
        body: ZColorRouteUpdate,
        response: {
          200: SuccessResponseSchema(ZColor),
          400: ErrorCommonSchemas["400"],
          500: ErrorCommonSchemas["500"],
        },
      },
    },
    async (req, reply) => {
      // const replyData = await UserLogin(req.body, reply);
      const updatedColor = await colorUpdate(req.body)
      // // logger.info("user crated", newUser);
      return reply.success(updatedColor, 200, "Color Update Successfully");
    }
  );
};