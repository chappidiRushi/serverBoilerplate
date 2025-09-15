import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { colorTable } from "../../db/schemas/color.schema";




export const ZColorInsertSchema = createInsertSchema(colorTable);
export const ZColorSelectSchema = createSelectSchema(colorTable);

export const ZColor = ZColorSelectSchema;
export const ZColorRouteCreate = ZColorInsertSchema.pick({ hexCode: true, name: true });
export const ZColorRouteUpdate = ZColorRouteCreate.partial()

export type TColor = z.infer<typeof ZColor>
export type TColorRouteCreate = z.infer<typeof ZColorRouteCreate>
export type TColorRouteUpdate = z.infer<typeof ZColorRouteUpdate>
