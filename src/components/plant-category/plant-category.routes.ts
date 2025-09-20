import { ZResErrorCommon } from "@utils/zod.util";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PlantCategoryBulkDelete, plantCategoryBulkPatch, PlantCategoryDelete, PlantCategoryGet, PlantCategoryPatch, PlantCategoryPost, PlantCategoryPostBulk } from "./plant-category.controller";
import {
  ZPlantCategoryBulkDeleteReq,
  ZPlantCategoryBulkDeleteRes,
  ZPlantCategoryDeleteReq,
  ZPlantCategoryDeleteRes,
  ZPlantCategoryGetReq,
  ZPlantCategoryGetRes,
  ZPlantCategoryPatchBulkReq,
  ZPlantCategoryPatchBulkRes,
  ZPlantCategoryPatchReq,
  ZPlantCategoryPatchRes,
  ZPlantCategoryPostBulkReq,
  ZPlantCategoryPostBulkRes,
  ZPlantCategoryPostReq,
  ZPlantCategoryPostRes
} from "./plant-category.validator";


export const plantCategoryRoute: FastifyPluginAsyncZod = async (fastify) => {
  // GET all plant categories
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Plant Categories",
        description: "Retrieve a paginated list of plant categories",
        tags: ["Plant Categories"],
        querystring: ZPlantCategoryGetReq,
        response: {
          200: ZPlantCategoryGetRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZPlantCategoryGetRes> = await PlantCategoryGet(req.query);
      return reply.success(data, 200, "Plant Categories Fetched Successfully");
    }
  );

  // POST single plant category
  fastify.post(
    "/",
    {
      schema: {
        summary: "Create Plant Category",
        description: "Create a new plant category",
        tags: ["Plant Categories"],
        body: ZPlantCategoryPostReq,
        response: {
          201: ZPlantCategoryPostRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZPlantCategoryPostRes> = await PlantCategoryPost(req.body);
      return reply.success(data, 201, "Plant Category Created Successfully");
    }
  );

  // PATCH single plant category
  fastify.patch(
    "/",
    {
      schema: {
        summary: "Update Plant Category",
        description: "Update an existing plant category by ID",
        tags: ["Plant Categories"],
        // params: ZId,
        body: ZPlantCategoryPatchReq,
        response: {
          200: ZPlantCategoryPatchRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      // const id = req.params.id;
      const updatedPlantCategory: DT<typeof ZPlantCategoryPatchRes> = await PlantCategoryPatch(req.body);
      return reply.success(updatedPlantCategory, 200, "Plant Category Updated Successfully");
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete Plant Category",
        description: "Delete a plant category by ID",
        tags: ["Plant Categories"],
        params: ZPlantCategoryDeleteReq,
        response: {
          200: ZPlantCategoryDeleteRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await PlantCategoryDelete(req.params);
      return reply.success(result, 200, "Plant Category Deleted Successfully");
    }
  );

  // POST bulk plant categories
  fastify.post(
    "/bulk",
    {
      schema: {
        summary: "Create Multiple Plant Categories",
        description: "Create multiple plant categories in a single request",
        tags: ["Plant Categories"],
        body: ZPlantCategoryPostBulkReq,
        response: {
          201: ZPlantCategoryPostBulkRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result: DT<typeof ZPlantCategoryPostBulkRes> = await PlantCategoryPostBulk(req.body);
      return reply.success(result, 201, "Plant Categories Created Successfully");
    }
  );


  // PATCH bulk plant categories
  fastify.patch(
    "/bulk",
    {
      schema: {
        summary: "Update Multiple Plant Categories",
        description: "Update multiple plant categories in a single request",
        tags: ["Plant Categories"],
        body: ZPlantCategoryPatchBulkReq,
        response: {
          200: ZPlantCategoryPatchBulkRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await plantCategoryBulkPatch(req.body);
      return reply.success(result, 200, "Plant Categories Updated Successfully");
    }
  );

  // DELETE single plant category

  // DELETE bulk plant categories
  fastify.delete(
    "/bulk",
    {
      schema: {
        summary: "Delete Multiple Plant Categories",
        description: "Delete multiple plant categories by their IDs",
        tags: ["Plant Categories"],
        body: ZPlantCategoryBulkDeleteReq,
        response: {
          209: ZPlantCategoryBulkDeleteRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result: DT<typeof ZPlantCategoryBulkDeleteRes> = await PlantCategoryBulkDelete(req.body);
      return reply.success(result, 209, "Plant Categories Deleted Successfully");
    }
  );
};