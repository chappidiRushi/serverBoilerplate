import { plantTable } from "@db/schemas/plant.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
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
export const ZPlantOriginal = createSelectSchema(plantTable, {
  
});

export const ZPlantInsert = createInsertSchema(plantTable, {
  // name: nameRule,
  // description: descriptionRule,
  // mediaUrl: mediaUrlRule,
});

export const ZPlantAPi = ZPlantOriginal.omit({
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
});

// -------------------------------------
// API Schemas
// -------------------------------------

// GET
export const ZPlantGetReq = ZGetReq(ZPlantAPi);
export const ZPlantGetRes = ZResOK(ZPaginationBody(ZPlantAPi));

// POST (single)
export const ZPlantPostReq = ZPlantAPi.omit({ id: true });
export const ZPlantPostRes = ZResOK(ZPlantAPi);

// PATCH (single)
export const ZPlantPatchReq = ZPlantAPi.partial().required({ id: true });
export const ZPlantPatchRes = ZResOK(ZPlantAPi);

// DELETE (single)
export const ZPlantDeleteReq = ZIdObjStr;
export const ZPlantDeleteRes = ZResOK(ZIdObjStr);


// -------------------------------------
// Bulk Actions
// -------------------------------------

// POST (bulk)
export const ZPlantPostBulkReq = ZBulkReq(ZPlantPostReq);
export const ZPlantPostBulkRes = ZResOK(ZBulkBody(ZPlantAPi));

// PATCH (bulk)
export const ZPlantPatchBulkReq = ZBulkReq(ZPlantPatchReq);
export const ZPlantPatchBulkRes = ZResOK(ZBulkBody(ZPlantAPi.partial()));

// DELETE (bulk)
export const ZPlantBulkDeleteReq = ZBulkReq(ZIDNum);
export const ZPlantBulkDeleteRes = ZResOK(ZBulkBody(ZIdObjStr));
