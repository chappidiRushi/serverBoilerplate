import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt';
import { config } from '../../config/env.config';
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
import { successResponse } from "../../utils/response.util";

export const FertilizerRoute = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  )
  // GET all fertilizer
  .get(
    "/",
    async ({ query }) => {
      const data: DT<typeof ZFertilizerGetRes> = await FertilizerGet(query);
      return successResponse(data, 200, "Fertilizer Fetched Successfully");
    },
    {
      query: ZFertilizerGetReq,
      detail: {
        summary: "Get Fertilizer",
        description: "Retrieve a paginated list of fertilizer",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // POST single fertilizer
  .post(
    "/",
    async ({ body }) => {
      const data: DT<typeof ZFertilizerPostRes> = await FertilizerPost(body);
      return successResponse(data, 201, "Fertilizer Created Successfully");
    },
    {
      body: ZFertilizerPostReq,
      detail: {
        summary: "Create Fertilizer",
        description: "Create a new fertilizer",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // PATCH single fertilizer
  .patch(
    "/",
    async ({ body }) => {
      const updatedFertilizer: DT<typeof ZFertilizerPatchRes> = await FertilizerPatch(body);
      return successResponse(updatedFertilizer, 200, "Fertilizer Updated Successfully");
    },
    {
      body: ZFertilizerPatchReq,
      detail: {
        summary: "Update Fertilizer",
        description: "Update an existing fertilizer by ID",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // DELETE single fertilizer
  .delete(
    "/:id",
    async ({ params }) => {
      const result = await FertilizerDelete(params);
      return successResponse(result, 200, "Fertilizer Deleted Successfully");
    },
    {
      params: ZFertilizerDeleteReq,
      detail: {
        summary: "Delete Fertilizer",
        description: "Delete a fertilizer by ID",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // POST bulk fertilizer
  .post(
    "/bulk",
    async ({ body }) => {
      const result: DT<typeof ZFertilizerPostBulkRes> = await FertilizerPostBulk(body);
      return successResponse(result, 201, "Fertilizer Created Successfully");
    },
    {
      body: ZFertilizerPostBulkReq,
      detail: {
        summary: "Create Multiple Fertilizer",
        description: "Create multiple fertilizer in a single request",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // PATCH bulk fertilizer
  .patch(
    "/bulk",
    async ({ body }) => {
      const result = await FertilizerBulkPatch(body);
      return successResponse(result, 200, "Fertilizer Updated Successfully");
    },
    {
      body: ZFertilizerPatchBulkReq,
      detail: {
        summary: "Update Multiple Fertilizer",
        description: "Update multiple fertilizer in a single request",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // DELETE bulk fertilizer
  .delete(
    "/bulk",
    async ({ body }) => {
      const result: DT<typeof ZFertilizerBulkDeleteRes> = await FertilizerBulkDelete(body);
      return successResponse(result, 209, "Fertilizer Deleted Successfully");
    },
    {
      body: ZFertilizerBulkDeleteReq,
      detail: {
        summary: "Delete Multiple Fertilizer",
        description: "Delete multiple fertilizer by their IDs",
        tags: ["Fertilizer"],
        security: [{ bearerAuth: [] }]
      }
    }
  );