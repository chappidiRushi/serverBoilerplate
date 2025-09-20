import { ZResErrorCommon, ZResOK } from "@utils/zod.util";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { getPlantCategoryList, plantCategoryBulkDelete, plantCategoryBulkPatch, plantCategoryBulkPost, plantCategoryDelete, plantCategoryPatch, plantCategoryPost } from "./plant-category.controller";
import { ZPlantCategoryBulkDeleteIds, ZPlantCategoryGetParams, ZPlantCategoryGetResOK, ZPlantCategoryRouteBulkPatch, ZPlantCategoryRouteBulkPatchResOK, ZPlantCategoryRouteBulkPost, ZPlantCategoryRoutePatch, ZPlantCategoryRoutePatchResOK, ZPlantCategoryRoutePost, ZPlantCategoryRoutePostResOK } from "./plant-category.validator";


const ZId = z.object({
  id: z.string()
})

export const plantCategoryRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Plant Category Get",
        querystring: ZPlantCategoryGetParams,
        response: {
          200: ZPlantCategoryGetResOK,
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
          201: ZPlantCategoryRoutePostResOK,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const newPlantCategory = await plantCategoryPost(req.body);
      return reply.success(newPlantCategory, 201, "Plant Category Created Successfully");
    }
  );

  fastify.post(
    "/bulk",
    {
      schema: {
        summary: "Plant Category Bulk Create",
        body: ZPlantCategoryRouteBulkPost,
        response: {
          201: ZPlantCategoryRoutePostResOK,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const newPlantCategories = await plantCategoryBulkPost(req.body);
      return reply.success(newPlantCategories, 201, "Plant Categories Created Successfully");
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
          203: ZPlantCategoryRoutePatchResOK,
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
  fastify.patch(
    "/bulk",
    {
      schema: {
        summary: "Plant Category Bulk Update",
        body: ZPlantCategoryRouteBulkPatch,
        response: {
          203: ZPlantCategoryRouteBulkPatchResOK,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const updatedPlantCategories = await plantCategoryBulkPatch(req.body);
      return reply.success(updatedPlantCategories, 200, "Plant Categories Updated Successfully");
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
  fastify.delete(
    "/bulk",
    {
      schema: {
        summary: "Plant Category Bulk Delete",
        body: ZPlantCategoryBulkDeleteIds,
        response: {
          409: ZResOK(ZPlantCategoryBulkDeleteIds),
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await plantCategoryBulkDelete(req.body);
      return reply.success(result, 409, "Plant Categories Deleted Successfully");
    }
  );
};