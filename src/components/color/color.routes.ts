import { ZReqPaginationTyped, ZResErrorCommon, ZResOK, ZResOKPagination } from "@utils/zod.util";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { colorCreate, getColorList } from "./color.controller";
import { ZColor, ZColorRouteCreate, ZColorRouteUpdate } from "./color.validator";


const ZId = z.object({
  id: z.number()
})

export const colorRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Color Get",
        tags: ["Colors"],
        querystring: ZReqPaginationTyped(ZColor),
        response: {
          201: ZResOKPagination(ZColor),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data = await getColorList(req.query)
      return reply.success(data, 201, "Colors Fetched Successfully");
    }
  );
  fastify.post(
    "/",
    {
      schema: {
        summary: "Color Create",
        body: ZColorRouteCreate,
        response: {
          201: ZResOK(ZColor),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
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
          200: ZResOK(ZColor),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
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
        response: {
          200: ZResOK(ZId),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const id = req.params.id;
      return reply.success({ id }, 200, "Color Deleted Successfully");
    }
  );
};