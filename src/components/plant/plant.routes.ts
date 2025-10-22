import { ZParseRes200, ZParseRes201, ZParseRes209, ZResErrorCommon } from "@utils/zod.util";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PlantBulkDelete, plantBulkPatch, PlantDelete, PlantGet, PlantPatch, PlantPost, PlantPostBulk } from "./plant.controller";
import {
  ZPlantBulkDeleteReq,
  ZPlantBulkDeleteRes,
  ZPlantDeleteReq,
  ZPlantDeleteRes,
  ZPlantGetReq,
  ZPlantGetRes,
  ZPlantPatchBulkReq,
  ZPlantPatchBulkRes,
  ZPlantPatchReq,
  ZPlantPatchRes,
  ZPlantPostBulkReq,
  ZPlantPostBulkRes,
  ZPlantPostReq,
  ZPlantPostRes
} from "./plant.validator";


export const plantRoute: FastifyPluginAsyncZod = async (fastify) => {
  // GET all plants
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Plants",
        description: "Retrieve a paginated list of plants",
        tags: ["Plants"],
        querystring: ZPlantGetReq,
        response: {
          200: ZPlantGetRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZPlantGetRes> = await PlantGet(req.query);
      return reply.status(200).send(ZParseRes200(data, req))
    }
  );

  // POST single plant 
  fastify.post(
    "/",
    {
      schema: {
        summary: "Create Plant ",
        description: "Create a new plant ",
        tags: ["Plants"],
        body: ZPlantPostReq,
        response: {
          201: ZPlantPostRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZPlantPostRes> = await PlantPost(req.body);
      // return reply.success(data, 201, "Plant  Created Successfully");
      return reply.status(201).send(ZParseRes201(data, req))
    }
  );
  // PATCH single plant 
  fastify.patch(
    "/",
    {
      schema: {
        summary: "Update Plant ",
        description: "Update an existing plant  by ID",
        tags: ["Plants"],
        // params: ZId,
        body: ZPlantPatchReq,
        response: {
          200: ZPlantPatchRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      // const id = req.params.id;
      const data: DT<typeof ZPlantPatchRes> = await PlantPatch(req.body);
      return reply.status(200).send(ZParseRes200(data, req))

    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete Plant ",
        description: "Delete a plant  by ID",
        tags: ["Plants"],
        params: ZPlantDeleteReq,
        response: {
          200: ZPlantDeleteRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data = await PlantDelete(req.params);
      return reply.status(200).send(ZParseRes200(data, req))
    }
  );
  // POST bulk plants
  fastify.post(
    "/bulk",
    {
      schema: {
        summary: "Create Multiple Plants",
        description: "Create multiple plants in a single request",
        tags: ["Plants"],
        body: ZPlantPostBulkReq,
        response: {
          201: ZPlantPostBulkRes,
          400: ZResErrorCommon["400"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZPlantPostBulkRes> = await PlantPostBulk(req.body);
      return reply.status(201).send(ZParseRes201(data, req));
    }
  );

  // PATCH bulk plants
  fastify.patch(
    "/bulk",
    {
      schema: {
        summary: "Update Multiple Plants",
        description: "Update multiple plants in a single request",
        tags: ["Plants"],
        body: ZPlantPatchBulkReq,
        response: {
          200: ZPlantPatchBulkRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data = await plantBulkPatch(req.body);
      return reply.status(200).send(ZParseRes200(data, req));
    }
  );

  // DELETE bulk plants
  fastify.delete(
    "/bulk",
    {
      schema: {
        summary: "Delete Multiple Plants",
        description: "Delete multiple plants by their IDs",
        tags: ["Plants"],
        body: ZPlantBulkDeleteReq,
        response: {
          209: ZPlantBulkDeleteRes,
          400: ZResErrorCommon["400"],
          404: ZResErrorCommon["404"],
          500: ZResErrorCommon["500"],
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (req, reply) => {
      const data: DT<typeof ZPlantBulkDeleteRes> = await PlantBulkDelete(req.body);
      return reply.status(209).send(ZParseRes209(data, req))
    }
  );
};