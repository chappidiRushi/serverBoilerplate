import { z } from 'zod';

export const ZResOK = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  status: z.literal('success'),
  message: z.string().optional(),
  data: dataSchema,
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }),
});

export const ZResOKPagination = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ZResOK(
    z.object({
      items: z.array(itemSchema),
      pagination: z.object({
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
        hasNextPage: z.boolean(),
        hasPrevPage: z.boolean(),
      }),
    })
  );

export const ZResError = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.union([z.string(), z.number()]),
    details: z.any().optional(),
  }),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }),
});


export const ZResErrorCommon = {
  400: ZResError,
  401: ZResError,
  403: ZResError,
  404: ZResError,
  409: ZResError,
  500: ZResError
} as const

export const ZReqPagination = z.object({
  page: z
    .preprocess((val) => Number(val), z.number().int().positive().default(1)),
  limit: z
    .preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
  sortBy: z.string().optional(), // field name
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().optional(), // for search/filter keyword
  filters: z.record(z.string(), z.string()).optional(), // key-value filters
});