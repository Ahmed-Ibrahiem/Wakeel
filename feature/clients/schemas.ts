import * as z from "zod";

export const PAGE_SIZE = [8, 10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE= 8

export const clientsListSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  pageSize: z.coerce
    .number()
    .refine((v) => (PAGE_SIZE as readonly number[]).includes(v))
    .catch(DEFAULT_PAGE_SIZE),
});

export type ClientsListParams = z.infer<typeof clientsListSchema>;
