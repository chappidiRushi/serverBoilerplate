import { now } from "@utils/helpers.util";
import { applyFilters, applySearch, applySorting, buildPaginationMeta, getOffset } from "@utils/query.util";
import { TPaginationMeta } from "@utils/zod.util";
import { eq, sql } from "drizzle-orm";
import { plantCategoryTable } from "@db/schemas/plant_category.shema";
import { TPlantCategory, TPlantCategoryBulkDelete, TPlantCategoryGetParams, TPlantCategoryRouteBulkPost, TPlantCategoryRouteBulkUpdate, TPlantCategoryRoutePost, TPlantCategoryRouteUpdate } from "./plant-category.validator";


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

export const plantCategoryPost = async function (data: TPlantCategoryRoutePost) {
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

export const plantCategoryBulkPost = async function (data: TPlantCategoryRouteBulkPost) {
  const { items } = data;

  // Extract all names to check for duplicates
  const names = items.map(item => item.name);

  // Check for duplicates within the batch
  const uniqueNames = new Set(names);
  if (uniqueNames.size !== names.length) {
    throw CE.BAD_REQUEST_400("Duplicate names found in bulk create request");
  }

  // Check which names already exist in the database
  const existingCategories = await db
    .select({ name: plantCategoryTable.name })
    .from(plantCategoryTable)
    .where(sql`${plantCategoryTable.name} IN ${names}`);

  const existingNamesSet = new Set(existingCategories.map(c => c.name));

  // Separate items into successful and failed based on existing names
  const toInsert = items.filter(item => !existingNamesSet.has(item.name));
  const failed = items.filter(item => existingNamesSet.has(item.name)).map(item => ({
    ...item,
    reason: "Name already exists"
  }));

  // Add timestamps to all items to insert
  const timestamp = now();
  const dataToInsert = toInsert.map(item => ({
    ...item,
    updatedAt: timestamp,
    createdAt: timestamp
  }));

  let created: TPlantCategory[] = [];
  if (dataToInsert.length > 0) {
    created = await db
      .insert(plantCategoryTable)
      .values(dataToInsert)
      .returning();
  }

  return {
    created,
    failed
  };
};

export const plantCategoryBulkPatch = async function (data: TPlantCategoryRouteBulkUpdate) {
  const { items } = data;

  // Extract IDs and collect updates by ID
  const ids = items.map(item => typeof item.id === 'string' ? Number(item.id) : item.id);
  const updates = new Map(items.map(item => [typeof item.id === 'string' ? Number(item.id) : item.id, item.data]));

  // Check if all categories exist
  const existingCategories = await db
    .select()
    .from(plantCategoryTable)
    .where(sql`${plantCategoryTable.id} IN ${ids}`);

  if (existingCategories.length !== ids.length) {
    const foundIds = new Set(existingCategories.map(c => c.id));
    const missingIds = ids.filter(id => !foundIds.has(id)).join(", ");
    throw CE.NOT_FOUND_404(`Some plant categories not found: IDs ${missingIds}`);
  }

  // Check for name uniqueness if any names are being updated
  const namesToUpdate = items
    .filter(item => item.data.name !== undefined)
    .map(item => item.data.name as string);

  if (namesToUpdate.length > 0) {
    // Check for duplicates within the batch
    const uniqueNames = new Set(namesToUpdate);
    if (uniqueNames.size !== namesToUpdate.length) {
      throw CE.BAD_REQUEST_400("Duplicate names found in bulk update request");
    }

    // Check if any names already exist in the database (excluding the current items being updated)
    const existingWithNames = await db
      .select({ id: plantCategoryTable.id, name: plantCategoryTable.name })
      .from(plantCategoryTable)
      .where(sql`${plantCategoryTable.name} IN ${namesToUpdate} AND ${plantCategoryTable.id} NOT IN ${ids}`);

    if (existingWithNames.length > 0) {
      const conflictingNames = existingWithNames.map(c => c.name).join(", ");
      throw CE.BAD_REQUEST_400(`Some names already exist in other categories: ${conflictingNames}`);
    }
  }

  // Perform updates and collect results
  const timestamp = now();
  const updatedCategories = [];

  for (const id of ids) {
    const updateData = updates.get(id);
    if (!updateData) continue;

    const [updated] = await db
      .update(plantCategoryTable)
      .set({
        ...updateData,
        updatedAt: timestamp
      })
      .where(eq(plantCategoryTable.id, id))
      .returning();

    if (updated) {
      updatedCategories.push(updated);
    }
  }

  if (updatedCategories.length !== ids.length) {
    throw CE.INTERNAL_SERVER_ERROR_500("Some plant categories could not be updated");
  }

  return updatedCategories;
};

export const plantCategoryBulkDelete = async function (data: TPlantCategoryBulkDelete) {
  const { ids } = data;

  // Convert string IDs to numbers
  const numericIds = ids.map(id => typeof id === 'string' ? Number(id) : id);

  // Check if all categories exist
  const existingCategories = await db
    .select({ id: plantCategoryTable.id })
    .from(plantCategoryTable)
    .where(sql`${plantCategoryTable.id} IN ${numericIds}`);

  if (existingCategories.length !== numericIds.length) {
    const foundIds = new Set(existingCategories.map(c => c.id));
    const missingIds = numericIds.filter(id => !foundIds.has(id)).join(", ");
    throw CE.NOT_FOUND_404(`Some plant categories not found: IDs ${missingIds}`);
  }

  // Delete all specified categories
  const result = await db
    .delete(plantCategoryTable)
    .where(sql`${plantCategoryTable.id} IN ${numericIds}`);

  if (result.count !== numericIds.length) {
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to delete some plant categories");
  }

  return { ids: numericIds };
};
