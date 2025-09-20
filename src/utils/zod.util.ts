import { z, ZodRawShape } from 'zod';

//#region --- Meta Schemas ---

/** Standard response meta schema */
const ZResMeta = z.object({
  timestamp: z.string(),
  requestId: z.string(),
});

//#endregion

//#region --- Response Boilerplate ---

/** Standard response boilerplate */
export const ZResBoilerplate = (status: boolean) =>
  z.object({
    status: z.literal(status),
    message: z.string(),
    meta: ZResMeta,
  });

/** Success response schema with a data field of generic type */
export const ZResOK = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ZResBoilerplate(true).extend({
    data: dataSchema,
    message: z.string().optional(),
  });

/** Error response schema with code and optional details */
export const ZResError = ZResBoilerplate(false).extend({
  error: z.object({
    code: z.union([z.string(), z.number()]),
    details: z.any().optional(),
  }),
});

export type TResError = z.infer<typeof ZResError>

//#endregion

//#region --- Success Response Schemas ---

/** Success response schema for an array of items */
export const ZResOkArr = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ZResOK(z.array(dataSchema));

/** Bulk operation response schema with success and failed arrays */
export const ZResBulk = <T extends z.ZodObject>(data: T) =>
  z.object({
    success: z.array(data),
    failed: z.array(data.extend({reason: z.string().optional()})),
  });

/** Success response schema for bulk operations */
export const ZResBulkOK = <T extends z.ZodObject>(data: T) =>
  ZResOK(ZResBulk(data));

//#endregion

//#region --- Error Response Schemas ---

/** Common error response schemas mapped by HTTP status codes */
export const ZResErrorCommon = {
  400: ZResError,
  401: ZResError,
  403: ZResError,
  404: ZResError,
  // 409: ZResError,
  500: ZResError,
} as const;

//#endregion

//#region --- Pagination Schemas ---

/** Pagination metadata schema */
export const ZPaginationMeta = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});
export type TPaginationMeta = z.infer<typeof ZPaginationMeta>;

/** Success response schema for paginated data */
export const ZResOKPagination = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ZResOK(
    z.object({
      items: z.array(itemSchema),
      pagination: ZPaginationMeta,
    })
  );

//#endregion

//#region --- Pagination Request Schemas ---

/** Generic pagination request schema */
export const ZReqPagination = z.object({
  page: z.preprocess((val) => Number(val), z.number().int().positive().default(1)),
  limit: z.preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
  filters: z.record(z.string(), z.string()).optional(),
});
export type TReqPagination = z.infer<typeof ZReqPagination>;

/**
 * Generate pagination request schema from a Zod object schema
 * - Only allows sorting/filtering by keys present in the provided schema
 */
export const ZReqPaginationTyped = <T extends ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  const keyEnum = schema.keyof();
  return z.object({
    page: z.preprocess((val) => Number(val), z.number().int().positive().default(1)),
    limit: z.preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
    sortBy: keyEnum.optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
    search: z.string().optional(),
    filters: z.record(keyEnum, z.string()).optional(),
  });
};

export const ZGetReq = <T extends ZodRawShape>(data: z.ZodObject<T>) =>
  ZReqPaginationTyped(data);

//#endregion

//#region --- Bulk Request Schemas ---

export const ZPostBulkReq = <T extends z.ZodType>(data: T) =>
  z.object({
    items: z
      .array(data)
      .min(1, "At least one item is required")
      .max(1000, "Maximum 100 items allowed at once"),
  });

export const ZPatchBulkReqItem = <T extends z.ZodType>(data: T) =>
  z.object({
    id: z.string().or(z.number()),
    data: data,
  });

export const ZPatchBulkReq = <T extends z.ZodType>(data: T) =>
  z.object({
    items: z
      .array(data)
      .min(1, "At least one item is required")
      .max(100, "Maximum 100 items allowed at once"),
  });

//#endregion

//#region --- ID/Bulk Delete Schemas ---
export const ZID = z.number().or(z.string().regex(/^\d+$/, "ID must be numeric"))
export const ZIDs = z
  .array(ZID);
export const ZDeleteBulkReq = z.object({
  ids: ZIDs
    .min(1, "At least one ID is required")
    .max(100, "Maximum 100 IDs allowed at once"),
});

//#endregion