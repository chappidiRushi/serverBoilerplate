import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { plantCategoryTable } from "../../db/schemas/plant_category.shema";
import {
  ZDeleteBulkReq,
  ZGetReq,
  ZPatchBulkReq,
  ZPostBulkReq,
  ZResBulkOK,
  ZResOK,
  ZResOKPagination
} from "../../utils/zod.util";

// -------------------------------------
// Field Rules
// -------------------------------------
const nameRule = (s: z.ZodString) => s.min(1, "Name is required").max(100, "Name must be at most 100 characters");
const descriptionRule = (s: z.ZodString) => s.max(5000, "Description must be at most 5000 characters").optional();
const mediaUrlRule = (s: z.ZodString) => s.url("Media URL must be a valid URL").optional();

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
export const ZPlantCategoryGetReq = ZGetReq(ZPlantCategoryAPi);
export const ZPlantCategoryGetRes = ZResOKPagination(ZPlantCategoryAPi);

// POST (single)
export const ZPlantCategoryPostReq = ZPlantCategoryAPi.omit({ id: true });
export const ZPlantCategoryPostRes = ZResOK(ZPlantCategoryAPi);

// PATCH (single)
export const ZPlantCategoryPatchReq = ZPlantCategoryAPi.partial().required({ id: true });
export const ZPlantCategoryPatchRes = ZResOK(ZPlantCategoryAPi);

// -------------------------------------
// Bulk Actions
// -------------------------------------

// POST (bulk)
export const ZPlantCategoryPostBulkReq = ZPostBulkReq(ZPlantCategoryPostReq);
export const ZPlantCategoryPostBulkRes = ZResBulkOK(ZPlantCategoryAPi);

// PATCH (bulk)
export const ZPlantCategoryRouteBulkPatch = ZPatchBulkReq(ZPlantCategoryPatchReq);
export const ZPlantCategoryRouteBulkPatchResOK = ZResBulkOK(ZPlantCategoryAPi);

// DELETE (bulk)
export const ZPlantCategoryBulkDelete = ZDeleteBulkReq;
export const ZPlantCategoryBulkDeleteResOk = ZResBulkOK(z.object({ id: z.number() }));

// -------------------------------------
// Types (auto from schemas)
// -------------------------------------
export type TPlantCategory = z.infer<typeof ZPlantCategoryOriginal>;
export type TPlantCategoryGetParams = z.infer<typeof ZPlantCategoryGetReq>;

export type TPlantCategoryRoutePost = z.infer<typeof ZPlantCategoryPostReq>;
export type TPlantCategoryRoutePatch = z.infer<typeof ZPlantCategoryPatchReq>;

export type TPlantCategoryRouteBulkPost = z.infer<typeof ZPlantCategoryPostBulkReq>;
export type TPlantCategoryRouteBulkPatch = z.infer<typeof ZPlantCategoryRouteBulkPatch>;
export type TPlantCategoryBulkDelete = z.infer<typeof ZPlantCategoryBulkDelete>;
