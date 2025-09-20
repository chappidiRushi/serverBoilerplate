import { ZResErrorCommon } from "@utils/zod.util";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { FertilizerBulkDelete, FertilizerBulkPatch, FertilizerDelete, FertilizerGet, FertilizerPatch, FertilizerPost, FertilizerPostBulk } from "./fertilizer.controller";
import {
  ZFertilizerBulkDeleteReq,
  ZFertilizerBulkDeleteRes,
  ZFertilizerDeleteReq,
  ZFertilizerDeleteRes,
  ZFertilizerGetReq,
  ZFertilizerGetRes,
  ZFertilizerPatchBulkReq,
  ZFertilizerPatchBulkRes,
  ZFertilizerPatchReq,
  ZFertilizerPatchRes,
  ZFertilizerPostBulkReq,
  ZFertilizerPostBulkRes,
  ZFertilizerPostReq,
  ZFertilizerPostRes
} from "./fertilizer.validator";


export const FertilizerRoute: FastifyPluginAsyncZod = async (fastify) => {
  // GET all fertilizer categories
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Fertilizer Categories",
        description: "Retrieve a paginated list of fertilizer categories",
        tags: ["Fertilizer Categories"],
        querystring: ZFertilizerGetReq,
        response: {
          200: ZFertilizerGetRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZFertilizerGetRes> = await FertilizerGet(req.query);
      return reply.success(data, 200, "Fertilizer Categories Fetched Successfully");
    }
  );

  // POST single fertilizer category
  fastify.post(
    "/",
    {
      schema: {
        summary: "Create Fertilizer Category",
        description: "Create a new fertilizer category",
        tags: ["Fertilizer Categories"],
        body: ZFertilizerPostReq,
        response: {
          201: ZFertilizerPostRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZFertilizerPostRes> = await FertilizerPost(req.body);
      return reply.success(data, 201, "Fertilizer Category Created Successfully");
    }
  );

  // PATCH single fertilizer category
  fastify.patch(
    "/",
    {
      schema: {
        summary: "Update Fertilizer Category",
        description: "Update an existing fertilizer category by ID",
        tags: ["Fertilizer Categories"],
        // params: ZId,
        body: ZFertilizerPatchReq,
        response: {
          200: ZFertilizerPatchRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      // const id = req.params.id;
      const updatedFertilizer: DT<typeof ZFertilizerPatchRes> = await FertilizerPatch(req.body);
      return reply.success(updatedFertilizer, 200, "Fertilizer Category Updated Successfully");
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete Fertilizer Category",
        description: "Delete a fertilizer category by ID",
        tags: ["Fertilizer Categories"],
        params: ZFertilizerDeleteReq,
        response: {
          200: ZFertilizerDeleteRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await FertilizerDelete(req.params);
      return reply.success(result, 200, "Fertilizer Category Deleted Successfully");
    }
  );

  // POST bulk fertilizer categories
  fastify.post(
    "/bulk",
    {
      schema: {
        summary: "Create Multiple Fertilizer Categories",
        description: "Create multiple fertilizer categories in a single request",
        tags: ["Fertilizer Categories"],
        body: ZFertilizerPostBulkReq,
        response: {
          201: ZFertilizerPostBulkRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result: DT<typeof ZFertilizerPostBulkRes> = await FertilizerPostBulk(req.body);
      return reply.success(result, 201, "Fertilizer Categories Created Successfully");
    }
  );


  // PATCH bulk fertilizer categories
  fastify.patch(
    "/bulk",
    {
      schema: {
        summary: "Update Multiple Fertilizer Categories",
        description: "Update multiple fertilizer categories in a single request",
        tags: ["Fertilizer Categories"],
        body: ZFertilizerPatchBulkReq,
        response: {
          200: ZFertilizerPatchBulkRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await FertilizerBulkPatch(req.body);
      return reply.success(result, 200, "Fertilizer Categories Updated Successfully");
    }
  );

  // DELETE single fertilizer category

  // DELETE bulk fertilizer categories
  fastify.delete(
    "/bulk",
    {
      schema: {
        summary: "Delete Multiple Fertilizer Categories",
        description: "Delete multiple fertilizer categories by their IDs",
        tags: ["Fertilizer Categories"],
        body: ZFertilizerBulkDeleteReq,
        response: {
          209: ZFertilizerBulkDeleteRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result: DT<typeof ZFertilizerBulkDeleteRes> = await FertilizerBulkDelete(req.body);
      return reply.success(result, 209, "Fertilizer Categories Deleted Successfully");
    }
  );
};