import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { plantCategoryTable } from "../../db/schemas/plant_category.shema";
import {
  ZDeleteBulkReq,
  ZGetReq,
  ZIDs,
  ZPatchBulkReq,
  ZPostBulkReq,
  ZResBulkOK,
  ZResOK,
  ZResOKPagination
} from "../../utils/zod.util";

// -------------------------------------
// Field Rules
// -------------------------------------
const nameRule = (s: z.ZodString) =>
  s.min(1, "Name is required").max(100, "Name must be at most 100 characters");

const descriptionRule = (s: z.ZodString) =>
  s.max(5000, "Description must be at most 255 characters").optional();

const mediaUrlRule = (s: z.ZodString) =>
  s.url("Media URL must be a valid URL").optional();

// -------------------------------------
// Table Schemas
// -------------------------------------
export const ZPlantCategoryOriginal = createSelectSchema(plantCategoryTable, {
  name: nameRule,
  description: descriptionRule,
  mediaUrl: mediaUrlRule,
  deletedAt: (s) => s.nullable().optional(),
});

export const ZPlantCategoryInsert = createInsertSchema(plantCategoryTable, {
  name: nameRule,
  description: descriptionRule,
  mediaUrl: mediaUrlRule,
});

export const ZPlantCategoryAPi = ZPlantCategoryOriginal.omit({
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
});

// -------------------------------------
// API Schemas
// -------------------------------------

// GET
export const ZPlantCategoryGet = ZGetReq(ZPlantCategoryAPi);
export const ZPlantCategoryGetResOK = ZResOKPagination(ZPlantCategoryAPi);

// POST (single)
export const ZPlantCategoryRoutePost = ZPlantCategoryAPi.omit({ id: true });
export const ZPlantCategoryRoutePostResOK = ZResOK(ZPlantCategoryAPi);

// POST (bulk)
export const ZPlantCategoryRoutePostBulk = ZPostBulkReq(ZPlantCategoryRoutePost);
export const ZPlantCategoryRoutePostBulkResOK = ZResBulkOK(ZPlantCategoryAPi);

// PATCH (single)
export const ZPlantCategoryRoutePatch = ZPlantCategoryAPi.partial().required({ id: true });
export const ZPlantCategoryRoutePatchResOK = ZResOK(ZPlantCategoryAPi);

// PATCH (bulk)
export const ZPlantCategoryRouteBulkPatch = ZPatchBulkReq(ZPlantCategoryRoutePatch);
export const ZPlantCategoryRouteBulkPatchResOK = ZResBulkOK(ZPlantCategoryAPi);

// DELETE (bulk)
export const ZPlantCategoryBulkDelete = ZDeleteBulkReq;
export const ZPlantCategoryBulkDeleteResOk = ZResBulkOK(ZIDs);

// -------------------------------------
// Types (auto from schemas)
// -------------------------------------
export type TPlantCategory = z.infer<typeof ZPlantCategoryOriginal>;
export type TPlantCategoryGetParams = z.infer<typeof ZPlantCategoryGet>;

export type TPlantCategoryRoutePost = z.infer<typeof ZPlantCategoryRoutePost>;
export type TPlantCategoryRouteBulkPost = z.infer<typeof ZPlantCategoryRoutePostBulk>;

export type TPlantCategoryRoutePatch = z.infer<typeof ZPlantCategoryRoutePatch>;
export type TPlantCategoryRouteBulkPatch = z.infer<typeof ZPlantCategoryRouteBulkPatch>;

export type TPlantCategoryBulkDelete = z.infer<typeof ZPlantCategoryBulkDelete>;
