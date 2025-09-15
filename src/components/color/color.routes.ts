import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { ErrorCommonSchemas, SuccessResponseSchema } from "../../utils/response";
import { colorCreate, colorDelete, colorUpdate } from "./color.controller";
import { ZColor, ZColorRouteCreate, ZColorRouteUpdate } from "./color.validator";



const ZId = z.object({
  id: z.string()
})

export const colorRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        summary: "Color Create",
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
  fastify.patch(
    "/:id",
    {
      schema: {
        params: ZId,
        summary: "Color Update",
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
      const id = req.params.id
      const updatedColor = await colorUpdate(req.body, id)
      // // logger.info("user crated", newUser);
      return reply.success(updatedColor, 200, "Color Updated Successfully");
    }
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        params: ZId,
        summary: "Color Delete",
        // body: ZColorRouteUpdate,
        response: {
          200: SuccessResponseSchema(ZId),
          400: ErrorCommonSchemas["400"],
          500: ErrorCommonSchemas["500"],
        },
      },
    },
    async (req, reply) => {
      const id = req.params.id;
      const deleted = colorDelete(id);
      return reply.success(deleted, 200, "Color Update Successfully");
    }
  );
};