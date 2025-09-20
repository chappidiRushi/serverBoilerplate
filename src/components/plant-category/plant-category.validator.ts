import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { plantCategoryTable } from "../../db/schemas/plant_category.shema";
import { ZReqPaginationTyped, ZResOK, ZResOkArr, ZResOKPagination } from "../../utils/zod.util";

const nameRule = (s: z.ZodString) => s.min(1, "Name is required").max(100, "Name must be at most 100 characters");

const descriptionRule = (s: z.ZodString) => s.max(5000, "Description must be at most 255 characters").optional();

const mediaUrlRule = (s: z.ZodString) => s.url("Media URL must be a valid URL").optional();

// -------------------------------------
// Schemas
// -------------------------------------


// Full table schema (for DB select / response)
export const ZPlantCategory = createSelectSchema(plantCategoryTable, {
  name: nameRule,
  description: descriptionRule,
  mediaUrl: mediaUrlRule,
  // createdAt: (s) => s,
  // updatedAt: (s) => s,
  deletedAt: (s) => s.nullable().optional(), // z.date().nullable().optional()
});
export const ZPlantCategoryInsert = createInsertSchema(plantCategoryTable, {
  name: nameRule,
  description: descriptionRule,
  mediaUrl: mediaUrlRule,
});


export const ZPlantCategoryGetParams = ZReqPaginationTyped(ZPlantCategory);
export const ZPlantCategoryGetResOK = ZResOKPagination(ZPlantCategory);


export const ZPlantCategoryRoutePost = ZPlantCategoryInsert.pick({ name: true, description: true, publicId: true, mediaUrl: true, });
export const ZPlantCategoryRoutePostResOK = ZResOK(ZPlantCategory)

export const ZPlantCategoryRouteBulkPost = z.object({
  items: z.array(ZPlantCategoryRoutePost).min(1, "At least one item is required").max(1000, "Maximum 100 items allowed at once")
});

export const ZPlantCategoryRoutePostBulkResOK = ZResOkArr(ZPlantCategory)


export const ZPlantCategoryRoutePatch = ZPlantCategoryRoutePost.partial();
export const ZPlantCategoryRoutePatchResOK = ZResOK(ZPlantCategory);
export const ZPlantCategoryBulkPatchItem = z.object({
  id: z.string().or(z.number()),
  data: ZPlantCategoryRoutePatch
});
export const ZPlantCategoryRouteBulkPatch = z.object({
  items: z.array(ZPlantCategoryBulkPatchItem).min(1, "At least one item is required").max(100, "Maximum 100 items allowed at once")
});
export const ZPlantCategoryRouteBulkPatchResOK = ZResOkArr(ZPlantCategory)

// Bulk delete schema
export const ZPlantCategoryBulkDeleteIds = z.object({
  ids: z.array(z.number().or(z.string().regex(/^\d+$/, "ID must be numeric")))
    .min(1, "At least one ID is required")
    .max(100, "Maximum 100 IDs allowed at once")
});

// -------------------------------------
// Types (auto from schemas)
// -------------------------------------
export type TPlantCategory = z.infer<typeof ZPlantCategory>;

export type TPlantCategoryGetParams = z.infer<typeof ZPlantCategoryGetParams>;


export type TPlantCategoryRoutePost = z.infer<typeof ZPlantCategoryRoutePost>;
export type TPlantCategoryRouteBulkPost = z.infer<typeof ZPlantCategoryRouteBulkPost>;

export type TPlantCategoryRouteUpdate = z.infer<typeof ZPlantCategoryRoutePatch>;
export type TPlantCategoryRouteBulkUpdate = z.infer<typeof ZPlantCategoryRouteBulkPatch>;

export type TPlantCategoryBulkDelete = z.infer<typeof ZPlantCategoryBulkDeleteIds>;



