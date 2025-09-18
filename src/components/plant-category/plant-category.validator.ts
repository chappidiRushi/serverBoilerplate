
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { plantCategoryTable } from "../../db/schemas/plant_category.shema";
import { ZReqPaginationTyped, ZResOKPagination } from "../../utils/zod.util";

const nameRule = (s: z.ZodString) => s.min(1, "Name is required").max(100, "Name must be at most 100 characters");
const descriptionRule = (s: z.ZodString) => s.max(5000, "Description must be at most 255 characters").optional();
const mediaUrlRule = (s: z.ZodString) => s.url("Media URL must be a valid URL").optional();
const datetimeRule = (label: string) => (s: z.ZodString) => s.datetime({ message: `${label} must be a valid ISO datetime` });

// -------------------------------------
// Schemas
// -------------------------------------

// Insert schema (for create / POST)
export const ZPlantCategoryInsert = createInsertSchema(plantCategoryTable, {
  name: nameRule,
  description: descriptionRule,
  mediaUrl: mediaUrlRule,
});

// Full table schema (for DB select / response)
export const ZPlantCategory = createSelectSchema(plantCategoryTable, {
  createdAt: datetimeRule("CreatedAt"),
  updatedAt: datetimeRule("UpdatedAt"),
  deletedAt: (s) => datetimeRule("DeletedAt")(s).nullable().optional(),
});

// Route schemas
export const ZPlantCategoryRoutePost = ZPlantCategoryInsert.pick({
  name: true,
  description: true,
  publicId: true,
  mediaUrl: true,
});

export const ZPlantCategoryRoutePatch = ZPlantCategoryRoutePost.partial();

// -------------------------------------
// Types (auto from schemas)
// -------------------------------------
export type TPlantCategory = z.infer<typeof ZPlantCategory>;
export type TPlantCategoryRouteCreate = z.infer<typeof ZPlantCategoryRoutePost>;
export type TPlantCategoryRouteUpdate = z.infer<typeof ZPlantCategoryRoutePatch>;



export const ZPlantCategoryGetParams = ZReqPaginationTyped(ZPlantCategory);
export const ZPlantCategoryGetResOK = ZResOKPagination(ZPlantCategory);

export type TPlantCategoryGetParams = z.infer<typeof ZPlantCategoryGetParams>
export type TPlantCategoryGetResOK = z.infer<typeof ZPlantCategoryGetResOK>