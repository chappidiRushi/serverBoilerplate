import { FertilizerTable } from "@db/schemas/fertilizers.schema";
import { now } from "@utils/helpers.util";
import { applyFilters, applySearch, applySorting, buildPaginationMeta, getOffset } from "@utils/query.util";
import { eq, sql } from "drizzle-orm";
import z from "zod";
import {
  ZFertilizerBulkDeleteReq,
  ZFertilizerBulkDeleteRes,
  ZFertilizerDeleteReq,
  ZFertilizerDeleteRes,
  ZFertilizerGetByIDReq,
  ZFertilizerGetByIDRes,
  ZFertilizerGetReq,
  ZFertilizerGetRes,
  ZFertilizerPatchBulkReq,
  ZFertilizerPatchBulkRes,
  ZFertilizerPatchReq,
  ZFertilizerPostBulkReq,
  ZFertilizerPostBulkRes,
  ZFertilizerPostReq,
  ZFertilizerPostRes
} from "./fertilizer.validator";

export async function FertilizerGet(params: z.infer<typeof ZFertilizerGetReq>): Promise<DT<typeof ZFertilizerGetRes>> {
  const { page, limit, sortBy, sortOrder, search, filters } = params;
  const offset = getOffset(page, limit);

  const table = FertilizerTable;
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

export async function FertilizerGetByID(params: z.infer<typeof ZFertilizerGetByIDReq>): Promise<DT<typeof ZFertilizerGetByIDRes>> {
  const { id } = params;

  // Fetch the fertilizer by ID
  const [fertilizer] = await db
    .select()
    .from(FertilizerTable)
    .where(eq(FertilizerTable.id, Number(id)))
    .limit(1);

  if (!fertilizer) {
    throw CE.NOT_FOUND_404(`Fertilizer with ID ${id} not found`);
  }

  return fertilizer;
};

export const FertilizerPost = async function (data: z.infer<typeof ZFertilizerPostReq>): Promise<DT<typeof ZFertilizerPostRes>> {
  const { name } = data;

  // Check if name already exists
  const [FertilizerExists] = await db
    .select()
    .from(FertilizerTable)
    .where(eq(FertilizerTable.name, name))
    .limit(1);

  if (FertilizerExists)
    throw CE.BAD_REQUEST_400(`Plant Category with name "${name}" already exists`);

  // Generate a public ID if not provided
  // if (!data.publicId) {
  //   data.publicId = crypto.randomUUID();
  // }

  // Create new plant category
  const [newFertilizer] = await db
    .insert(FertilizerTable)
    .values({
      ...data,
      updatedAt: now(),
      createdAt: now(),
    })
    .returning();

  if (!newFertilizer)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to create Fertilizer");

  return newFertilizer;
}

export const FertilizerPatch = async function (input: z.infer<typeof ZFertilizerPatchReq>): Promise<DT<typeof ZFertilizerPostRes>> {
  // Check if plant category exists
  const [existingFertilizer] = await db
    .select()
    .from(FertilizerTable)
    .where(eq(FertilizerTable.id, Number(input.id)))
    .limit(1);

  if (!existingFertilizer)
    throw CE.NOT_FOUND_404(`Plant Category with ID ${input.id} not found`);

  // If name is being updated, check uniqueness
  if (input.name && input.name !== existingFertilizer.name) {
    const [nameExists] = await db
      .select()
      .from(FertilizerTable)
      .where(eq(FertilizerTable.name, input.name))
      .limit(1);

    if (nameExists)
      throw CE.BAD_REQUEST_400(`Plant Category with name "${input.name}" already exists`);
  }
  const { id, ...input1 } = input;
  // Update plant category
  const [updatedFertilizer] = await db
    .update(FertilizerTable)
    .set({
      ...input1,
      updatedAt: now(),
    })
    .where(eq(FertilizerTable.id, Number(id)))
    .returning();

  if (!updatedFertilizer)
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to update Plant Category");

  return updatedFertilizer;
};

export const FertilizerDelete = async function (params: z.infer<typeof ZFertilizerDeleteReq>): Promise<DT<typeof ZFertilizerDeleteRes>> {
  const { id } = params;

  // Check if plant category exists
  const [existingFertilizer] = await db
    .select()
    .from(FertilizerTable)
    .where(eq(FertilizerTable.id, Number(id)))
    .limit(1);

  if (!existingFertilizer) {
    throw CE.NOT_FOUND_404(`Plant Category with ID ${id} not found`);
  }

  // Delete the plant category
  const deleted = await db
    .delete(FertilizerTable)
    .where(eq(FertilizerTable.id, Number(id)));

  if (deleted.count === 0) {
    throw CE.INTERNAL_SERVER_ERROR_500("Failed to delete Plant Category");
  }

  return { id };
};

export const FertilizerPostBulk = async function (data: z.infer<typeof ZFertilizerPostBulkReq>): Promise<DT <typeof ZFertilizerPostBulkRes>> {
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
    .select({ name: FertilizerTable.name })
    .from(FertilizerTable)
    .where(sql`${FertilizerTable.name} IN ${names}`);

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
    // publicId: item. || crypto.randomUUID(), // Generate public ID if not provided
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  // Insert items
  let created: any[] = [];
  if (dataToInsert.length > 0) {
    created = await db
      .insert(FertilizerTable)
      .values(dataToInsert)
      .returning();
  }

  return {
    failed: failed,
    success: created,
  };
};

export const FertilizerBulkPatch = async function (data: z.infer<typeof ZFertilizerPatchBulkReq>): Promise<DT<typeof ZFertilizerPatchBulkRes>> {
  const { items } = data;

  // Extract IDs and collect updates by ID
  const ids = items.map(item => item.id);
  const updates = new Map(items.map(item => [item.id,{ ...item, id: undefined }]));

  // Check which categories exist
  const existingCategories = await db
    .select({ id: FertilizerTable.id })
    .from(FertilizerTable)
    .where(sql`${FertilizerTable.id} IN ${ids}`);

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
      .select({ id: FertilizerTable.id, name: FertilizerTable.name })
      .from(FertilizerTable)
      .where(
        sql`${FertilizerTable.name} IN ${namesToUpdate.map(n => n.name)} AND 
            ${FertilizerTable.id} NOT IN ${ids}`
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
        .update(FertilizerTable)
        .set({
          ...updateData,
          updatedAt: timestamp
        })
        .where(eq(FertilizerTable.id, id))
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

export const FertilizerBulkDelete = async function (data: z.infer<typeof ZFertilizerBulkDeleteReq>): Promise<DT<typeof ZFertilizerBulkDeleteRes>> {
  const { items  } = data;

  // Convert string IDs to numbers
  const numericIds = items.map(id => typeof id === 'string' ? Number(id) : id);

  // Check which categories exist
  const existingCategories = await db
    .select({ id: FertilizerTable.id })
    .from(FertilizerTable)
    .where(sql`${FertilizerTable.id} IN ${numericIds}`);

  const existingIdsSet = new Set(existingCategories.map(c => c.id));
  const successIds = numericIds.filter(id => existingIdsSet.has(id));
  const failedIds = numericIds.filter(id => !existingIdsSet.has(id))
    .map(id => ({ id, reason: `Plant Category with ID ${id} not found` }));

  // Delete only the existing categories
  let deletedCount = 0;
  if (successIds.length > 0) {
    const result = await db
      .delete(FertilizerTable)
      .where(sql`${FertilizerTable.id} IN ${successIds}`);
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
