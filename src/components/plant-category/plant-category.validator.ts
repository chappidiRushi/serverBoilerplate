import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { plantCategoryTable } from "../../db/schemas/plant_category.shema";
import {
  ZBulkBody,
  ZBulkReq,
  ZGetReq,
  ZIDNum,
  ZIdObjStr,
  ZPaginationBody,
  ZResOK
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
export const ZPlantCategoryGetRes = ZResOK(ZPaginationBody(ZPlantCategoryAPi));

// POST (single)
export const ZPlantCategoryPostReq = ZPlantCategoryAPi.omit({ id: true });
export const ZPlantCategoryPostRes = ZResOK(ZPlantCategoryAPi);

// PATCH (single)
export const ZPlantCategoryPatchReq = ZPlantCategoryAPi.partial().required({ id: true });
export const ZPlantCategoryPatchRes = ZResOK(ZPlantCategoryAPi);

// DELETE (single)
export const ZPlantCategoryDeleteReq = ZIdObjStr;
export const ZPlantCategoryDeleteRes = ZResOK(ZIdObjStr);


// -------------------------------------
// Bulk Actions
// -------------------------------------

// POST (bulk)
export const ZPlantCategoryPostBulkReq = ZBulkReq(ZPlantCategoryPostReq);
export const ZPlantCategoryPostBulkRes = ZResOK(ZBulkBody(ZPlantCategoryAPi));

// PATCH (bulk)
export const ZPlantCategoryPatchBulkReq = ZBulkReq(ZPlantCategoryPatchReq);
export const ZPlantCategoryPatchBulkRes = ZResOK(ZBulkBody(ZPlantCategoryAPi.partial()));

// DELETE (bulk)
export const ZPlantCategoryBulkDeleteReq = ZBulkReq(ZIDNum);
export const ZPlantCategoryBulkDeleteRes = ZResOK(ZBulkBody(ZIdObjStr));
