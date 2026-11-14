export type RawParams = Record<string, string | string[] | undefined>;

// searchParams values can be arrays: take the first one
export const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

// Escapes % and _ so user input is matched literally inside ILIKE
export const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");