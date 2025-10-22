// import { plantTable } from "@db/schemas/plant.schema";
import { plantTable } from "@db/schemas/plant.schema";
import { now } from "@utils/helpers.util";
import { applyFilters, applySearch, applySorting, buildPaginationMeta, getOffset } from "@utils/query.util";
import { eq, sql } from "drizzle-orm";
import z from "zod";
import {
  ZPlantBulkDeleteReq,
  ZPlantBulkDeleteRes,
  ZPlantDeleteReq,
  ZPlantDeleteRes,
  ZPlantGetReq,
  ZPlantGetRes,
  ZPlantPatchBulkReq,
  ZPlantPatchBulkRes,
  ZPlantPatchReq,
  ZPlantPostBulkReq,
  ZPlantPostBulkRes,
  ZPlantPostReq,
  ZPlantPostRes
} from "./plant.validator";

export async function PlantGet(params: z.infer<typeof ZPlantGetReq>): Promise<DT<typeof ZPlantGetRes>> {
  const { page, limit, sortBy, sortOrder, search, filters } = params;
  const offset = getOffset(page, limit);

  const table = plantTable;
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

export const PlantPost = async function (data: z.infer<typeof ZPlantPostReq>): Promise<DT<typeof ZPlantPostRes>> {
  const { name } = data;

  // Check if name already exists
  const [plantExists] = await db
    .select()
    .from(plantTable)
    .where(eq(plantTable.name, name))
    .limit(1);

  if (plantExists)
    throw CE.BAD_REQUEST_400(`Plant  with name "${name}" already exists`);

  // Create new plant 
  const [newPlant] = await db
    .insert(plantTable)
    .values({
      ...data,
      createdAt: now(),
      updatedAt: now(),
    })
    .returning();

  if (!newPlant)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to create Plant ");

  return newPlant;
}

export const PlantPatch = async function (input: z.infer<typeof ZPlantPatchReq>): Promise<DT<typeof ZPlantPostRes>> {
  // Check if plant  exists
  const [existingPlant] = await db
    .select()
    .from(plantTable)
    .where(eq(plantTable.id, Number(input.id)))
    .limit(1);

  if (!existingPlant)
    throw CE.NOT_FOUND_404(`Plant  with ID ${input.id} not found`);

  // If name is being updated, check uniqueness
  if (input.name && input.name !== existingPlant.name) {
    const [nameExists] = await db
      .select()
      .from(plantTable)
      .where(eq(plantTable.name, input.name))
      .limit(1);

    if (nameExists)
      throw CE.BAD_REQUEST_400(`Plant  with name "${input.name}" already exists`);
  }
  const { id, ...input1 } = input;
  // Update plant 
  const [updatedPlant] = await db
    .update(plantTable)
    .set({
      ...input1,
      updatedAt: now(),
    })
    .where(eq(plantTable.id, Number(id)))
    .returning();

  if (!updatedPlant)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to update Plant ");

  return updatedPlant;
};

export const PlantDelete = async function (params: z.infer<typeof ZPlantDeleteReq>): Promise<DT<typeof ZPlantDeleteRes>> {
  const { id } = params;

  // Check if plant  exists
  const [existingPlant] = await db
    .select()
    .from(plantTable)
    .where(eq(plantTable.id, Number(id)))
    .limit(1);

  if (!existingPlant) {
    throw CE.NOT_FOUND_404(`Plant  with ID ${id} not found`);
  }

  // Delete the plant 
  const deleted = await db
    .delete(plantTable)
    .where(eq(plantTable.id, Number(id)));

  if (deleted.count === 0) {
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to delete Plant ");
  }

  return { id };
};

export const PlantPostBulk = async function (data: z.infer<typeof ZPlantPostBulkReq>): Promise<DT <typeof ZPlantPostBulkRes>> {
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
    .select({ name: plantTable.name })
    .from(plantTable)
    .where(sql`${plantTable.name} IN ${names}`);

  const existingNamesSet = new Set(existingCategories.map(c => c.name));

  // Separate items for insert vs. which ones failed
  const toInsert = items.filter(item => !existingNamesSet.has(item.name));
  const failed = items.filter(item => existingNamesSet.has(item.name))
    .map(item => ({
      ...item,
      reason: `Plant  with name "${item.name}" already exists`
    }));

  // Add required fields and timestamps
  const timestamp = now();
  const dataToInsert = toInsert.map(item => ({
    ...item,
    // publicId: item.publicId || crypto.randomUUID(), // Generate public ID if not provided
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  // Insert items
  let created: any[] = [];
  if (dataToInsert.length > 0) {
    created = await db
      .insert(plantTable)
      .values(dataToInsert)
      .returning();
  }

  return {
    failed: failed,
    success: created,
  };
};

export const plantBulkPatch = async function (data: z.infer<typeof ZPlantPatchBulkReq>): Promise<DT<typeof ZPlantPatchBulkRes>> {
  const { items } = data;

  // Extract IDs and collect updates by ID
  const ids = items.map(item => item.id);
  const updates = new Map(items.map(item => [item.id,{ ...item, id: undefined }]));

  // Check which categories exist
  const existingCategories = await db
    .select({ id: plantTable.id })
    .from(plantTable)
    .where(sql`${plantTable.id} IN ${ids}`);

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
      .select({ id: plantTable.id, name: plantTable.name })
      .from(plantTable)
      .where(
        sql`${plantTable.name} IN ${namesToUpdate.map(n => n.name)} AND 
            ${plantTable.id} NOT IN ${ids}`
      );

    if (existingNames.length > 0) {
      const conflictingNames = existingNames.map(c => c.name).join(', ');
      throw CE.BAD_REQUEST_400(`Some names already exist in other categories: ${conflictingNames}`);
    }
  }

  // Perform updates
  const timestamp = now();
  const updated = [];
  const failed :{id: number, reason: string}[] = [];

  for (const id of ids) {
    const updateData = updates.get(id);
    if (!updateData) continue;

    try {
      const [updatedItem] = await db
        .update(plantTable)
        .set({
          ...updateData,
          updatedAt: timestamp
        })
        .where(eq(plantTable.id, id))
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
    failed: failed,
    success: updated,
  };
};

export const PlantBulkDelete = async function (data: z.infer<typeof ZPlantBulkDeleteReq>): Promise<DT<typeof ZPlantBulkDeleteRes>> {
  const { items  } = data;

  // Convert string IDs to numbers
  const numericIds = items.map(id => typeof id === 'string' ? Number(id) : id);

  // Check which categories exist
  const existingCategories = await db
    .select({ id: plantTable.id })
    .from(plantTable)
    .where(sql`${plantTable.id} IN ${numericIds}`);

  const existingIdsSet = new Set(existingCategories.map(c => c.id));
  const successIds = numericIds.filter(id => existingIdsSet.has(id));
  const failedIds = numericIds.filter(id => !existingIdsSet.has(id))
    .map(id => ({ id, reason: `Plant  with ID ${id} not found` }));

  // Delete only the existing categories
  let deletedCount = 0;
  if (successIds.length > 0) {
    const result = await db
      .delete(plantTable)
      .where(sql`${plantTable.id} IN ${successIds}`);
    deletedCount = result.count;
  }

  // Ensure all were deleted or report error
  const undeleted = deletedCount !== successIds.length ?
    successIds.slice(deletedCount).map(id => ({ id, reason: "Delete operation failed" })) : [];

  // Combine all failures
  const allFailed = [...failedIds, ...undeleted];

  return {
    failed: allFailed.map(fail => ({ reason: fail.reason })),
    success: successIds.map(id => {return {id: id.toString()}}),
  };
};
