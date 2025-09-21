import { ZPaginationBody, ZPaginationReq, ZResErrorCommon, ZResOK } from "@utils/zod.util";
import { Elysia, t } from "elysia";
import { jwt } from '@elysiajs/jwt';
import { config } from '../../config/env.config';
import z from "zod";
import { colorCreate, colorUpdate, getColorList } from "./color.controller";
import { ZColor, ZColorRouteCreate, ZColorRouteUpdate } from "./color.validator";
import { successResponse } from "../../utils/response.util";

const ZId = z.object({
  id: z.coerce.number()
});

export const colorRoute = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  )
  .get(
    "/",
    async ({ query }) => {
      const data = await getColorList(query);
      return successResponse(data, 201, "Colors Fetched Successfully");
    },
    {
      query: ZPaginationReq(ZColor),
      detail: {
        summary: "Color Get",
        tags: ["Colors"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .post(
    "/",
    async ({ body }) => {
      const newColor = await colorCreate(body);
      return successResponse(newColor, 201, "Color Created Successfully");
    },
    {
      body: ZColorRouteCreate,
      detail: {
        summary: "Color Create",
        tags: ["Colors"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      const id = params.id;
      const updatedColor = await colorUpdate(body, id);
      return successResponse(updatedColor, 200, "Color Updated Successfully");
    },
    {
      params: ZId,
      body: ZColorRouteUpdate,
      detail: {
        summary: "Color Update",
        tags: ["Colors"],
        security: [{ bearerAuth: [] }]
      }
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const id = params.id;
      return successResponse({ id }, 200, "Color Deleted Successfully");
    },
    {
      params: ZId,
      detail: {
        summary: "Color Delete",
        tags: ["Colors"],
        security: [{ bearerAuth: [] }]
      }
    }
  );