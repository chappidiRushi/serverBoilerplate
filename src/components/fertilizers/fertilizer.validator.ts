import { FertilizerTable } from "@db/schemas/fertilizers.schema";
import { ZBulkBody, ZBulkReq, ZGetReq, ZIDNum, ZIdObjStr, ZPaginationBody, ZResOK } from "@utils/zod.util";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

// -------------------------------------
// Field Rules
// -------------------------------------
const nameRule = (s: z.ZodString) => s.min(1, "Name is required").max(100, "Name must be at most 100 characters");
const typeRule = (s: z.ZodString) => s.min(1, "Type is required").max(50, "Type must be at most 50 characters");
const compositionRule = (s: z.ZodString) => s.min(1, "Composition is required").max(500, "Composition must be at most 500 characters");
const descriptionRule = (s: z.ZodString) => s.max(5000, "Description must be at most 5000 characters").nullable().optional();
const cautionRule = (s: z.ZodString) => s.max(2000, "Caution must be at most 2000 characters").nullable().optional();

// -------------------------------------
// Fertilizer Schema
// -------------------------------------
export const ZFertilizerOriginal = createSelectSchema(FertilizerTable, {
  name: nameRule,
  type: typeRule,
  composition: compositionRule,
  description: descriptionRule,
  caution: cautionRule,
});


// export const ZFertilizerInsert = createInsertSchema(FertilizerTable, {
//   // name: nameRule,
//   // description: descriptionRule,
//   // mediaUrl: mediaUrlRule,
// });

export const ZFertilizerAPi = ZFertilizerOriginal.omit({
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
});

// -------------------------------------
// API Schemas
// -------------------------------------

// GET
export const ZFertilizerGetReq = ZGetReq(ZFertilizerAPi);
export const ZFertilizerGetRes = ZResOK(ZPaginationBody(ZFertilizerAPi));

// POST (single)
export const ZFertilizerPostReq = ZFertilizerAPi.omit({ id: true });
export const ZFertilizerPostRes = ZResOK(ZFertilizerAPi);

// PATCH (single)
export const ZFertilizerPatchReq = ZFertilizerAPi.partial().required({ id: true });
export const ZFertilizerPatchRes = ZResOK(ZFertilizerAPi);

// DELETE (single)
export const ZFertilizerDeleteReq = ZIdObjStr;
export const ZFertilizerDeleteRes = ZResOK(ZIdObjStr);


// -------------------------------------
// Bulk Actions
// -------------------------------------

// POST (bulk)
export const ZFertilizerPostBulkReq = ZBulkReq(ZFertilizerPostReq);
export const ZFertilizerPostBulkRes = ZResOK(ZBulkBody(ZFertilizerAPi));

// PATCH (bulk)
export const ZFertilizerPatchBulkReq = ZBulkReq(ZFertilizerPatchReq);
export const ZFertilizerPatchBulkRes = ZResOK(ZBulkBody(ZFertilizerAPi.partial()));

// DELETE (bulk)
export const ZFertilizerBulkDeleteReq = ZBulkReq(ZIDNum);
export const ZFertilizerBulkDeleteRes = ZResOK(ZBulkBody(ZIdObjStr));
