import { colorTable } from "@db/schemas/color.schema";
import { ZPaginationBody, ZPaginationReq, ZResOK } from "@utils/zod.util";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";




export const ZColorInsertSchema = createInsertSchema(colorTable);
export const ZColorSelectSchema = createSelectSchema(colorTable);

export const ZColor = ZColorSelectSchema;
export type TZColor = z.infer<typeof ZColor>
export const ZColorRouteCreate = ZColorInsertSchema.pick({ hexCode: true, name: true });
export const ZColorRouteUpdate = ZColorRouteCreate.partial()

export type TColor = z.infer<typeof ZColor>
export type TColorRouteCreate = z.infer<typeof ZColorRouteCreate>
export type TColorRouteUpdate = z.infer<typeof ZColorRouteUpdate>

export const ZColorGetParams = ZPaginationReq(ZColor);
export const ZColorGetResOK = ZResOK(ZPaginationBody(ZColor));

export type TColorGetParams = z.infer<typeof ZColorGetParams>
export type TColorGetResOK = z.infer<typeof ZColorGetResOK>