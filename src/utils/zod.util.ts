import { z } from 'zod';

export const ZSuccessResponse = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  status: z.literal('success'),
  message: z.string().optional(),
  data: dataSchema,
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }),
});

export const ZErrorResponse = z.object({
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


export const ErrorCommonSchemas = {
  400: ZErrorResponse,
  401: ZErrorResponse,
  403: ZErrorResponse,
  404: ZErrorResponse,
  409: ZErrorResponse,
  500: ZErrorResponse
} as const