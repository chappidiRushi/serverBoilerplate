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

export function ZBulkBody<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return z.object({
    success: z.array(schema),
    failed: z.array(
      schema.extend({
        id: (schema.shape.id && 'optional' in schema.shape.id
          ? (schema.shape.id as z.ZodTypeAny).optional()
          : z.any().optional()),
        reason: z.string(),
      })
    ),
  });
}
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
export const ZPaginationBody = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: ZPaginationMeta,
  })

/**
 * Generate pagination request schema from a Zod object schema
 * - Only allows sorting/filtering by keys present in the provided schema
 */
export const ZPaginationReq = <T extends ZodRawShape>(
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
  ZPaginationReq(data);

//#endregion

//#region --- Bulk Request Schemas ---

export const ZBulkReq = <T extends z.ZodType>(data: T) =>z.object({
    items: z.array(data).min(1, "At least one item is required").max(1000, "Maximum 100 items allowed at once")
  });

export const ZIDNum = z.number()
export const ZIDNums = z.array(ZIDNum);

export const ZIDStr = z.string()
export const ZIDStrs = z.array(ZIDStr)

export const ZIdObjStr = z.object({
  id: z.string()
});

export const ZIdObjNum = z.object({
  id: ZIDNum
});
