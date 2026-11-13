import { pgEnum } from "drizzle-orm/pg-core";

export const caseTypeEnum = pgEnum("case_type", [
  "civil",
  "criminal",
  "commercial",
  "family",
  "labor",
  "other",
]);

export const caseStatusEnum = pgEnum("case_status", [
  "ongoing",
  "postponed",
  "closed",
]);