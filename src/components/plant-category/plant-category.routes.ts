import { ZReqPaginationTyped, ZResErrorCommon, ZResOK, ZResOKPagination } from "@utils/zod.util";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { getPlantCategoryList, plantCategoryDelete, plantCategoryPatch, plantCategoryPost } from "./plant-category.controller";
import { ZPlantCategory, ZPlantCategoryRoutePatch, ZPlantCategoryRoutePost } from "./plant-category.validator";


const ZId = z.object({
  id: z.string()
})

export const plantCategoryRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Plant Category Get",
        querystring: ZReqPaginationTyped(ZPlantCategory),
        response: {
          200: ZResOKPagination(ZPlantCategory),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data = await getPlantCategoryList(req.query)
      return reply.success(data, 200, "PlantCategory Fetched Successfully");
    }
  );
  fastify.post(
    "/",
    {
      schema: {
        summary: "Plant Category Create",
        body: ZPlantCategoryRoutePost,
        response: {
          201: ZResOK(ZPlantCategory),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      // const newUser = await UserCreate(req.body);
      const newPlantCategory = await plantCategoryPost(req.body);
      return reply.success(newPlantCategory, 201, "Plant Category Created Successfully");
    }
  );
  fastify.patch(
    "/:id",
    {
      schema: {
        params: ZId,
        summary: "Plant Category Update",
        body: ZPlantCategoryRoutePatch,
        response: {
          203: ZResOK(ZPlantCategory),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      // const replyData = await UserLogin(req.body, reply);
      const id = req.params.id
      const updatedPlantCategory = await plantCategoryPatch(req.body, id)
      return reply.success(updatedPlantCategory, 200, "Plant Category Updated Successfully");
    }
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        params: ZId,
        summary: "Plant Category Delete",
        response: {
          409: ZResOK(ZId),
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const id = req.params.id;
      const deleted = await plantCategoryDelete(id);
      return reply.success({ id }, 200, "Plant Category Deleted Successfully");
    }
  );
};