export const CASE_TYPE_LABELS: Record<string, string> = {
  civil: "قضية مدنية",
  criminal: "قضية جنائية",
  commercial: "قضية تجارية",
  family: "قضية أسرية",
  labor: "قضية عمالية",
  other: "قضية أخرى",
};

export const CASE_STATUS_LABELS: Record<string, string> = {
  ongoing: "جارية",
  postponed: "مؤجلة",
  closed: "منتهية",
};

export const CASE_STATUS_STYLES: Record<string, string> = {
  ongoing: "bg-emerald-100 text-emerald-800",
  postponed: "bg-amber-100 text-amber-800",
  closed: "bg-stone-200 text-stone-700",
};