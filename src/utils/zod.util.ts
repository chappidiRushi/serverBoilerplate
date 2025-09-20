import { z, ZodRawShape } from 'zod';





export const ZResBoilerplate = (status: boolean) => {
  return z.object({
    status: z.literal(status),
    message: z.string(),
    meta: z.object({
      timestamp: z.string(),
      requestId: z.string(),
    }),
  })
}

export const ZResOK = <T extends z.ZodTypeAny>(data: T) => ZResBoilerplate(true).extend({
  data: data
})

export const ZResError = <T extends z.ZodTypeAny>(data: T) => ZResBoilerplate(false).extend({
  code: z.union([z.string(), z.number()]),
  details: z.any().optional(),
})

export const ZResOkArr = <T extends z.ZodTypeAny>(dataSchema: T) => ZResOK(z.array(dataSchema))

export const ZResBulk = <T extends z.ZodTypeAny>(data: T) => {
  return z.object({
    success: z.array(data),
    failed: z.array(data)
  })
}
export const ZResBulkOK = <T extends z.ZodTypeAny>(data: T) => ZResOK(ZResBulk(data))



export const ZPaginationMeta = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
})

export type TPaginationMeta = z.infer<typeof ZPaginationMeta>

export const ZResOKPagination = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ZResOK(
    z.object({
      items: z.array(itemSchema),
      pagination: ZPaginationMeta,
    })
  );



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

export type TReqPagination = z.infer<typeof ZReqPagination>



/**
 * Generate pagination request schema from a Zod object schema
 */
export const ZReqPaginationTyped = <T extends ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  const keyEnum = schema.keyof(); // ZodEnum<["id", "name", "hex", ...]>
  return z.object({
    page: z
      .preprocess((val) => Number(val), z.number().int().positive().default(1)),
    limit: z
      .preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
    sortBy: keyEnum.optional(), // only schema keys allowed
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    search: z.string().optional(),
    filters: z.record(keyEnum, z.string()).optional(), // filters must use schema keys
  });
};
