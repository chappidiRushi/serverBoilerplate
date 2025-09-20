import { z, ZodRawShape } from 'zod';

// Utility to generate a standard response schema with a given status (true/false)
export const ZResBoilerplate = (status: boolean) => {
  return z.object({
    status: z.literal(status), // Response status (true/false)
    message: z.string(), // Message string
    meta: z.object({
      timestamp: z.string(), // Timestamp of the response
      requestId: z.string(), // Unique request identifier
    }),
  })
}

// Success response schema with a data field of generic type
export const ZResOK = <T extends z.ZodTypeAny>(data: T) => ZResBoilerplate(true).extend({
  data: data // Data payload
})

// Error response schema with code and optional details
export const ZResError = <T extends z.ZodTypeAny>(data: T) => ZResBoilerplate(false).extend({
  code: z.union([z.string(), z.number()]), // Error code (string or number)
  details: z.any().optional(), // Optional error details
})

// Success response schema for an array of items
export const ZResOkArr = <T extends z.ZodTypeAny>(dataSchema: T) => ZResOK(z.array(dataSchema))

// Bulk operation response schema with success and failed arrays
export const ZResBulk = <T extends z.ZodTypeAny>(data: T) => {
  return z.object({
    success: z.array(data), // Successfully processed items
    failed: z.array(data)   // Failed items
  })
}

// Success response schema for bulk operations
export const ZResBulkOK = <T extends z.ZodTypeAny>(data: T) => ZResOK(ZResBulk(data))

// Pagination metadata schema
export const ZPaginationMeta = z.object({
  total: z.number().int().nonnegative(),      // Total items
  page: z.number().int().positive(),          // Current page number
  limit: z.number().int().positive(),         // Items per page
  totalPages: z.number().int().nonnegative(), // Total number of pages
  hasNextPage: z.boolean(),                   // Is there a next page?
  hasPrevPage: z.boolean(),                   // Is there a previous page?
})

export type TPaginationMeta = z.infer<typeof ZPaginationMeta>

// Success response schema for paginated data
export const ZResOKPagination = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ZResOK(
    z.object({
      items: z.array(itemSchema),    // Array of items
      pagination: ZPaginationMeta,   // Pagination metadata
    })
  );

// Common error response schemas mapped by HTTP status codes
export const ZResErrorCommon = {
  400: ZResError,
  401: ZResError,
  403: ZResError,
  404: ZResError,
  409: ZResError,
  500: ZResError
} as const

// Generic pagination request schema
export const ZReqPagination = z.object({
  page: z
    .preprocess((val) => Number(val), z.number().int().positive().default(1)), // Page number
  limit: z
    .preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)), // Items per page
  sortBy: z.string().optional(), // Field to sort by
  sortOrder: z.enum(["asc", "desc"]).default("asc"), // Sort order
  search: z.string().optional(), // Search/filter keyword
  filters: z.record(z.string(), z.string()).optional(), // Key-value filters
});

export type TReqPagination = z.infer<typeof ZReqPagination>

/**
 * Generate pagination request schema from a Zod object schema
 * - Only allows sorting/filtering by keys present in the provided schema
 */
export const ZReqPaginationTyped = <T extends ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  const keyEnum = schema.keyof(); // Enum of schema keys
  return z.object({
    page: z
      .preprocess((val) => Number(val), z.number().int().positive().default(1)),
    limit: z
      .preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
    sortBy: keyEnum.optional(), // Only schema keys allowed
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    search: z.string().optional(),
    filters: z.record(keyEnum, z.string()).optional(), // Filters must use schema keys
  });
};
