import { colorTable } from "@db/schemas/color.schema";
import { now } from "@utils/helpers.util";
import { applyFilters, applySearch, applySorting, buildPaginationMeta, getOffset } from "@utils/query.util";
import { TPaginationMeta } from "@utils/zod.util";
import { eq, sql } from "drizzle-orm";
import { TColor, TColorGetParams, TColorRouteCreate, TColorRouteUpdate } from "./color.validator";


export async function getColorList(params: TColorGetParams): Promise<{ items: TColor[], pagination: TPaginationMeta }> {
  const { page, limit, sortBy, sortOrder, search, filters } = params;
  const offset = getOffset(page, limit);

  const table = colorTable;
  let q = db.select().from(table);
  q = applySearch(q, table, search);
  q = applyFilters(q, table, filters);
  q = applySorting(q, table, sortBy, sortOrder);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(q.as("sub"));

  const rows = await q.limit(limit).offset(offset);

  return {
    items: rows,
    pagination: buildPaginationMeta(Number(count), page, limit),
  };
}

export const colorCreate = async function (data: TColorRouteCreate) {
  const { hexCode, name } = data
  const [colorExists] = await db.select().from(colorTable).where(eq(colorTable.name, name)).limit(1)
  if (colorExists) throw CE.BAD_REQUEST_400(`Color With Name: ${name} Already Exists`);
  const [newColor] = await db.insert(colorTable).values({
    name: name,
    hexCode: hexCode,
    createdAt: now(),
    updatedAt: now(),
  }).returning();
  if (!newColor) throw CE.INTERNAL_SERVER_ERROR_500("Failed To Create Color");
  return newColor;
}


export const colorUpdate = async (input: TColorRouteUpdate, id: string) => {
  const { name, hexCode } = input;

  // Check if color exists
  const [existingColor] = await db
    .select()
    .from(colorTable)
    .where(eq(colorTable.id, id))
    .limit(1);

  if (!existingColor)
    throw CE.NOT_FOUND_404(`Color with ID ${id} not found`);

  // If name is being updated, check uniqueness
  if (name && name !== existingColor.name) {
    const [nameExists] = await db
      .select()
      .from(colorTable)
      .where(eq(colorTable.name, name))
      .limit(1);

    if (nameExists)
      throw CE.BAD_REQUEST_400(`Color With Name: ${name} Already Exists`);
  }

  const [updatedColor] = await db
    .update(colorTable)
    .set({
      ...(name && { name }),
      ...(hexCode && { hexCode }),
      updatedAt: now(),
    })
    .where(eq(colorTable.id, id))
    .returning();

  if (!updatedColor)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed To Update Color");

  return updatedColor;
};

export const colorDelete = async function (id: string) {
  // Check if color exists
  const [existingColor] = await db
    .select()
    .from(colorTable)
    .where(eq(colorTable.id, id))
    .limit(1);

  if (!existingColor) {
    throw CE.NOT_FOUND_404(`Color with ID ${id} not found`);
  }

  // Delete the color
  const deleted = await db
    .delete(colorTable)
    .where(eq(colorTable.id, id));

  if (deleted.count === 0) {
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to delete color");
  }

  return { id };
};
