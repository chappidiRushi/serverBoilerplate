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
  // GET all fertilizer
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Fertilizer",
        description: "Retrieve a paginated list of fertilizer",
        tags: ["Fertilizer"],
        querystring: ZFertilizerGetReq,
        response: {
          200: ZFertilizerGetRes,
          // 400: ZResErrorCommon["400"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZFertilizerGetRes> = await FertilizerGet(req.query);
      return reply.success(data, 200, "Fertilizer Fetched Successfully");
    }
  );

  // POST single fertilizer
  fastify.post(
    "/",
    {
      schema: {
        summary: "Create Fertilizer",
        description: "Create a new fertilizer",
        tags: ["Fertilizer"],
        body: ZFertilizerPostReq,
        response: {
          201: ZFertilizerPostRes,
          // 400: ZResErrorCommon["400"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZFertilizerPostRes> = await FertilizerPost(req.body);
      return reply.success(data, 201, "Fertilizer Created Successfully");
    }
  );

  // PATCH single fertilizer
  fastify.patch(
    "/",
    {
      schema: {
        summary: "Update Fertilizer",
        description: "Update an existing fertilizer by ID",
        tags: ["Fertilizer"],
        // params: ZId,
        body: ZFertilizerPatchReq,
        response: {
          200: ZFertilizerPatchRes,
          // 400: ZResErrorCommon["400"],
          // 404: ZResErrorCommon["404"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      // const id = req.params.id;
      const updatedFertilizer: DT<typeof ZFertilizerPatchRes> = await FertilizerPatch(req.body);
      return reply.success(updatedFertilizer, 200, "Fertilizer Updated Successfully");
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete Fertilizer",
        description: "Delete a fertilizer by ID",
        tags: ["Fertilizer"],
        params: ZFertilizerDeleteReq,
        response: {
          200: ZFertilizerDeleteRes,
          // 400: ZResErrorCommon["400"],
          // 404: ZResErrorCommon["404"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await FertilizerDelete(req.params);
      return reply.success(result, 200, "Fertilizer Deleted Successfully");
    }
  );

  // POST bulk fertilizer
  fastify.post(
    "/bulk",
    {
      schema: {
        summary: "Create Multiple Fertilizer",
        description: "Create multiple fertilizer in a single request",
        tags: ["Fertilizer"],
        body: ZFertilizerPostBulkReq,
        response: {
          201: ZFertilizerPostBulkRes,
          // 400: ZResErrorCommon["400"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result: DT<typeof ZFertilizerPostBulkRes> = await FertilizerPostBulk(req.body);
      return reply.success(result, 201, "Fertilizer Created Successfully");
    }
  );


  // PATCH bulk fertilizer
  fastify.patch(
    "/bulk",
    {
      schema: {
        summary: "Update Multiple Fertilizer",
        description: "Update multiple fertilizer in a single request",
        tags: ["Fertilizer"],
        body: ZFertilizerPatchBulkReq,
        response: {
          200: ZFertilizerPatchBulkRes,
          // 400: ZResErrorCommon["400"],
          // 404: ZResErrorCommon["404"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result = await FertilizerBulkPatch(req.body);
      return reply.success(result, 200, "Fertilizer Updated Successfully");
    }
  );

  // DELETE single fertilizer

  // DELETE bulk fertilizer
  fastify.delete(
    "/bulk",
    {
      schema: {
        summary: "Delete Multiple Fertilizer",
        description: "Delete multiple fertilizer by their IDs",
        tags: ["Fertilizer"],
        body: ZFertilizerBulkDeleteReq,
        response: {
          209: ZFertilizerBulkDeleteRes,
          // 400: ZResErrorCommon["400"],
          // 404: ZResErrorCommon["404"],
          // 500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const result: DT<typeof ZFertilizerBulkDeleteRes> = await FertilizerBulkDelete(req.body);
      return reply.success(result, 209, "Fertilizer Deleted Successfully");
    }
  );
};