import { plantCategoryTable } from "@db/schemas/plant_category.shema";
import { now } from "@utils/helpers.util";
import { applyFilters, applySearch, applySorting, buildPaginationMeta, getOffset } from "@utils/query.util";
import { TPaginationMeta } from "@utils/zod.util";
import { eq, sql } from "drizzle-orm";
import {
  TPlantCategory,
  TPlantCategoryBulkDelete,
  TPlantCategoryGetParams,
  TPlantCategoryRouteBulkPatch,
  TPlantCategoryRouteBulkPost,
  TPlantCategoryRoutePatch,
  TPlantCategoryRoutePost
} from "./plant-category.validator";

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

  // Check if name already exists
  const [plantCategoryExists] = await db
    .select()
    .from(plantCategoryTable)
    .where(eq(plantCategoryTable.name, name))
    .limit(1);

  if (plantCategoryExists)
    throw CE.BAD_REQUEST_400(`Plant Category with name "${name}" already exists`);

  // Generate a public ID if not provided
  if (!data.publicId) {
    data.publicId = crypto.randomUUID();
  }

  // Create new plant category
  const [newPlantCategory] = await db
    .insert(plantCategoryTable)
    .values({
      ...data,
      createdAt: now(),
      updatedAt: now(),
    })
    .returning();

  if (!newPlantCategory)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to create Plant Category");

  return newPlantCategory;
}

export const plantCategoryPatch = async function (input: Omit<TPlantCategoryRoutePatch, 'id'>, id: string) {
  // Check if plant category exists
  const [existingPlantCategory] = await db
    .select()
    .from(plantCategoryTable)
    .where(eq(plantCategoryTable.id, Number(id)))
    .limit(1);

  if (!existingPlantCategory)
    throw CE.NOT_FOUND_404(`Plant Category with ID ${id} not found`);

  // If name is being updated, check uniqueness
  if (input.name && input.name !== existingPlantCategory.name) {
    const [nameExists] = await db
      .select()
      .from(plantCategoryTable)
      .where(eq(plantCategoryTable.name, input.name))
      .limit(1);

    if (nameExists)
      throw CE.BAD_REQUEST_400(`Plant Category with name "${input.name}" already exists`);
  }

  // Update plant category
  const [updatedPlantCategory] = await db
    .update(plantCategoryTable)
    .set({
      ...input,
      updatedAt: now(),
    })
    .where(eq(plantCategoryTable.id, Number(id)))
    .returning();

  if (!updatedPlantCategory)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to update Plant Category");

  return updatedPlantCategory;
};

export const plantCategoryDelete = async function (id: string) {
  // Check if plant category exists
  const [existingPlantCategory] = await db
    .select()
    .from(plantCategoryTable)
    .where(eq(plantCategoryTable.id, Number(id)))
    .limit(1);

  if (!existingPlantCategory) {
    throw CE.NOT_FOUND_404(`Plant Category with ID ${id} not found`);
  }

  // Delete the plant category
  const deleted = await db
    .delete(plantCategoryTable)
    .where(eq(plantCategoryTable.id, Number(id)));

  if (deleted.count === 0) {
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to delete Plant Category");
  }

  return { id };
};

export const plantCategoryBulkPost = async function (data: TPlantCategoryRouteBulkPost) {
  const { items } = data;

  // Extract names to check for duplicates
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

  // Separate items for insert vs. which ones failed
  const toInsert = items.filter(item => !existingNamesSet.has(item.name));
  const failed = items.filter(item => existingNamesSet.has(item.name))
    .map(item => ({
      ...item,
      reason: `Plant Category with name "${item.name}" already exists`
    }));

  // Add required fields and timestamps
  const timestamp = now();
  const dataToInsert = toInsert.map(item => ({
    ...item,
    publicId: item.publicId || crypto.randomUUID(), // Generate public ID if not provided
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  // Insert items
  let created: any[] = [];
  if (dataToInsert.length > 0) {
    created = await db
      .insert(plantCategoryTable)
      .values(dataToInsert)
      .returning();
  }

  return {
    failed: failed,
    success: created,
  };
};

export const plantCategoryBulkPatch = async function (data: TPlantCategoryRouteBulkPatch) {
  const { items } = data;

  // Extract IDs and collect updates by ID
  const ids = items.map(item => item.id);
  const updates = new Map(items.map(item => [item.id,{ ...item, id: undefined }]));

  // Check which categories exist
  const existingCategories = await db
    .select({ id: plantCategoryTable.id })
    .from(plantCategoryTable)
    .where(sql`${plantCategoryTable.id} IN ${ids}`);

  const existingIdsSet = new Set(existingCategories.map(c => c.id));

  // Find missing IDs
  const missingIds = ids.filter(id => !existingIdsSet.has(id));

  if (missingIds.length > 0) {
    throw CE.NOT_FOUND_404(`Some Plant Categories not found: IDs ${missingIds.join(', ')}`);
  }

  // Check for name uniqueness if any names are being updated
  const namesToUpdate = items
    .filter(item => item.name !== undefined)
    .map(item => ({ id: item.id, name: item.name as string }));

  if (namesToUpdate.length > 0) {
    // Check for duplicates within the batch
    const nameMap = new Map<string, number | string>();
    const duplicateNames = [];

    for (const { id, name } of namesToUpdate) {
      if (nameMap.has(name)) {
        duplicateNames.push(name);
      } else {
        nameMap.set(name, id);
      }
    }

    if (duplicateNames.length > 0) {
      throw CE.BAD_REQUEST_400(`Duplicate names in request: ${duplicateNames.join(', ')}`);
    }

    // Check if names exist in database (excluding the current items)
    const existingNames = await db
      .select({ id: plantCategoryTable.id, name: plantCategoryTable.name })
      .from(plantCategoryTable)
      .where(
        sql`${plantCategoryTable.name} IN ${namesToUpdate.map(n => n.name)} AND 
            ${plantCategoryTable.id} NOT IN ${ids}`
      );

    if (existingNames.length > 0) {
      const conflictingNames = existingNames.map(c => c.name).join(', ');
      throw CE.BAD_REQUEST_400(`Some names already exist in other categories: ${conflictingNames}`);
    }
  }

  // Perform updates
  const timestamp = now();
  const updated = [];
  const failed = [];

  for (const id of ids) {
    const updateData = updates.get(id);
    if (!updateData) continue;

    try {
      const [updatedItem] = await db
        .update(plantCategoryTable)
        .set({
          ...updateData,
          updatedAt: timestamp
        })
        .where(eq(plantCategoryTable.id, id))
        .returning();

      if (updatedItem) {
        updated.push(updatedItem);
      } else {
        failed.push({ id, reason: "Update operation failed" });
      }
    } catch (error) {
      failed.push({ id, reason: `Update error: ${(error as any).message || "Unknown error"}` });
    }
  }

  return {
    data: updated,
    failed: failed.length > 0 ? failed : undefined,
    success: updated.length,
    total: ids.length
  };
};

export const plantCategoryBulkDelete = async function (data: TPlantCategoryBulkDelete) {
  const { ids } = data;

  // Convert string IDs to numbers
  const numericIds = ids.map(id => typeof id === 'string' ? Number(id) : id);

  // Check which categories exist
  const existingCategories = await db
    .select({ id: plantCategoryTable.id })
    .from(plantCategoryTable)
    .where(sql`${plantCategoryTable.id} IN ${numericIds}`);

  const existingIdsSet = new Set(existingCategories.map(c => c.id));
  const successIds = numericIds.filter(id => existingIdsSet.has(id));
  const failedIds = numericIds.filter(id => !existingIdsSet.has(id))
    .map(id => ({ id, reason: `Plant Category with ID ${id} not found` }));

  // Delete only the existing categories
  let deletedCount = 0;
  if (successIds.length > 0) {
    const result = await db
      .delete(plantCategoryTable)
      .where(sql`${plantCategoryTable.id} IN ${successIds}`);
    deletedCount = result.count;
  }

  // Ensure all were deleted or report error
  const undeleted = deletedCount !== successIds.length ?
    successIds.slice(deletedCount).map(id => ({ id, reason: "Delete operation failed" })) : [];

  // Combine all failures
  const allFailed = [...failedIds, ...undeleted];

  return {
    failed: allFailed,
    success: successIds.map(id => {return {id}}),
  };
};
