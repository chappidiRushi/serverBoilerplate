import { ZResErrorCommon } from "@utils/zod.util";
import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt';
import { config } from '../../config/env.config';
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
import { successResponse } from "../../utils/response.util";

export const plantCategoryRoute = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  )
  // GET all plant categories
  .get(
    "/",
    async ({ query }) => {
      const data: DT<typeof ZPlantCategoryGetRes> = await PlantCategoryGet(query);
      return successResponse(data, 200, "Plant Categories Fetched Successfully");
    },
    {
      query: ZPlantCategoryGetReq,
      detail: {
        summary: "Get Plant Categories",
        description: "Retrieve a paginated list of plant categories",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // POST single plant category
  .post(
    "/",
    async ({ body }) => {
      const data: DT<typeof ZPlantCategoryPostRes> = await PlantCategoryPost(body);
      return successResponse(data, 201, "Plant Category Created Successfully");
    },
    {
      body: ZPlantCategoryPostReq,
      detail: {
        summary: "Create Plant Category",
        description: "Create a new plant category",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // PATCH single plant category
  .patch(
    "/",
    async ({ body }) => {
      const updatedPlantCategory: DT<typeof ZPlantCategoryPatchRes> = await PlantCategoryPatch(body);
      return successResponse(updatedPlantCategory, 200, "Plant Category Updated Successfully");
    },
    {
      body: ZPlantCategoryPatchReq,
      detail: {
        summary: "Update Plant Category",
        description: "Update an existing plant category by ID",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // DELETE single plant category
  .delete(
    "/:id",
    async ({ params }) => {
      const result = await PlantCategoryDelete(params);
      return successResponse(result, 200, "Plant Category Deleted Successfully");
    },
    {
      params: ZPlantCategoryDeleteReq,
      detail: {
        summary: "Delete Plant Category",
        description: "Delete a plant category by ID",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // POST bulk plant categories
  .post(
    "/bulk",
    async ({ body }) => {
      const result: DT<typeof ZPlantCategoryPostBulkRes> = await PlantCategoryPostBulk(body);
      return successResponse(result, 201, "Plant Categories Created Successfully");
    },
    {
      body: ZPlantCategoryPostBulkReq,
      detail: {
        summary: "Create Multiple Plant Categories",
        description: "Create multiple plant categories in a single request",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // PATCH bulk plant categories
  .patch(
    "/bulk",
    async ({ body }) => {
      const result = await plantCategoryBulkPatch(body);
      return successResponse(result, 200, "Plant Categories Updated Successfully");
    },
    {
      body: ZPlantCategoryPatchBulkReq,
      detail: {
        summary: "Update Multiple Plant Categories",
        description: "Update multiple plant categories in a single request",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  // DELETE bulk plant categories
  .delete(
    "/bulk",
    async ({ body }) => {
      const result: DT<typeof ZPlantCategoryBulkDeleteRes> = await PlantCategoryBulkDelete(body);
      return successResponse(result, 209, "Plant Categories Deleted Successfully");
    },
    {
      body: ZPlantCategoryBulkDeleteReq,
      detail: {
        summary: "Delete Multiple Plant Categories",
        description: "Delete multiple plant categories by their IDs",
        tags: ["Plant Categories"],
        security: [{ bearerAuth: [] }]
      }
    }
  );