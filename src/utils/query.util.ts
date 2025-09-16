import { asc, desc, eq, like } from "drizzle-orm";
import { TPaginationMeta } from "./zod.util";


export function getOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
export function applySearch<T extends Record<string, any>>(
  q: any,
  table: T,
  search?: string) {
  if (search) {
    q = q.where(like((table as any).name, `%${search}%`));
  }
  return q;
}
export function applyFilters<T extends Record<string, any>>(
  q: any,
  table: T,
  filters?: Record<string, string>) {
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (key in table) {
        q = q.where(eq((table as any)[key], value));
      }
    }
  }
  return q;
}
export function applySorting<T extends Record<string, any>>(
  q: any,
  table: T,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc") {
  if (sortBy && sortBy in table) {
    q = q.orderBy(
      sortOrder === "desc"
        ? desc((table as any)[sortBy])
        : asc((table as any)[sortBy])
    );
  }
  return q;
}
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number): TPaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}
