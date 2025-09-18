import { now } from "@utils/helpers.util";
import { applyFilters, applySearch, applySorting, buildPaginationMeta, getOffset } from "@utils/query.util";
import { TPaginationMeta } from "@utils/zod.util";
import { eq, sql } from "drizzle-orm";
import { plantCategoryTable } from "../../db/schemas/plant_category.shema";
import { TPlantCategory, TPlantCategoryGetParams, TPlantCategoryRouteCreate, TPlantCategoryRouteUpdate } from "./plant-category.validator";


export async function getPlantCategoryList(params: TPlantCategoryGetParams): Promise<{ items: TPlantCategory[], pagination: TPaginationMeta }> {
  const { page, limit, sortBy, sortOrder, search, filters } = params;
  const offset = getOffset(page, limit);

  const table = plantCategoryTable;
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

export const plantCategoryPost = async function (data: TPlantCategoryRouteCreate) {
  const { name } = data;
  const [plantCategoryExists] = await db.select().from(plantCategoryTable).where(eq(plantCategoryTable.name, name)).limit(1);
  if (plantCategoryExists) throw CE.BAD_REQUEST_400(`PlantCategory With Name: ${name} Already Exists`);
  const [newPlantCategory] = await db.insert(plantCategoryTable).values({
    ...data,
    updatedAt: now(),
  }).returning();
  if (!newPlantCategory) throw CE.INTERNAL_SERVER_ERROR_500("Failed To Create PlantCategory");
  return newPlantCategory;
}


export const plantCategoryPatch = async (input: TPlantCategoryRouteUpdate, id: string) => {
  const { name } = input;

  // Check if plantCategory exists
  const [existingPlantCategory] = await db
    .select()
    .from(plantCategoryTable)
    .where(eq(plantCategoryTable.id, Number(id)))
    .limit(1);

  if (!existingPlantCategory)
    throw CE.NOT_FOUND_404(`PlantCategory with ID ${id} not found`);

  // If name is being updated, check uniqueness
  if (name && name !== existingPlantCategory.name) {
    const [nameExists] = await db
      .select()
      .from(plantCategoryTable)
      .where(eq(plantCategoryTable.name, name))
      .limit(1);

    if (nameExists)
      throw CE.BAD_REQUEST_400(`PlantCategory With Name: ${name} Already Exists`);
  }

  const [updatedPlantCategory] = await db
    .update(plantCategoryTable)
    .set({
      ...input,
      updatedAt: now(),
    })
    .where(eq(plantCategoryTable.id, Number(id)))
    .returning();

  if (!updatedPlantCategory)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed To Update PlantCategory");

  return updatedPlantCategory;
};

export const plantCategoryDelete = async function (id: string) {
  // Check if plantCategory exists
  const [existingPlantCategory] = await db
    .select()
    .from(plantCategoryTable)
    .where(eq(plantCategoryTable.id, Number(id)))
    .limit(1);

  if (!existingPlantCategory) {
    throw CE.NOT_FOUND_404(`PlantCategory with ID ${id} not found`);
  }

  // Delete the plantCategory
  const deleted = await db
    .delete(plantCategoryTable)
    .where(eq(plantCategoryTable.id, Number(id)));

  if (deleted.count === 0) {
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to delete plantCategory");
  }
  return { id };
};
