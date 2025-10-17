import { ZParseRes200, ZParseRes201, ZParseRes209, ZResErrorCommon } from "@utils/zod.util";
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
      return reply.status(200).send(ZParseRes200(data, req))
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
      // return reply.success(data, 201, "Plant Category Created Successfully");
      return reply.status(201).send(ZParseRes201(data, req))
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
      const data: DT<typeof ZPlantCategoryPatchRes> = await PlantCategoryPatch(req.body);
      return reply.status(200).send(ZParseRes200(data, req))

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
      const data = await PlantCategoryDelete(req.params);
      return reply.status(200).send(ZParseRes200(data, req))
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
      const data: DT<typeof ZPlantCategoryPostBulkRes> = await PlantCategoryPostBulk(req.body);
      return reply.status(201).send(ZParseRes201(data, req));
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
      const data = await plantCategoryBulkPatch(req.body);
      return reply.status(200).send(ZParseRes200(data, req));
    }
  );

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
      const data: DT<typeof ZPlantCategoryBulkDeleteRes> = await PlantCategoryBulkDelete(req.body);
      return reply.status(209).send(ZParseRes209(data, req))
    }
  );
};