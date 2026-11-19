import { z } from "zod";

// Single source of truth for every paginated list (clients, cases, ...)
export const PAGE_SIZES = [8, 12, 24, 48] as const;
export const DEFAULT_PAGE_SIZE = 8;

// A value outside the list (typed by hand in the URL) falls back to the default, never errors
export const pageSizeSchema = z.coerce
  .number()
  .refine((v) => (PAGE_SIZES as readonly number[]).includes(v))
  .catch(DEFAULT_PAGE_SIZE);