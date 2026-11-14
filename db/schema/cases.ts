import {
  date,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { clients } from "./clients";
import { caseStatusEnum, caseTypeEnum } from "./enums";
import { timestamps } from "./columns";

export const cases = pgTable(
  "cases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // no .references() here: the composite FK below replaces it
    clientId: uuid("client_id").notNull(),
    caseNumber: text("case_number").notNull(),
    caseType: caseTypeEnum("case_type").notNull(),
    courtName: text("court_name").notNull(),
    opposingParty: text("opposing_party"),
    status: caseStatusEnum("status").notNull().default("ongoing"),
    judgmentDate: date("judgment_date", { mode: "string" }),
    notes: text("notes"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    // The case must be linked to a client who belongs to the same lawyer (at the database level)
    foreignKey({
      name: "cases_client_owner_fk",
      columns: [t.clientId, t.userId],
      foreignColumns: [clients.id, clients.userId],
    }),
    unique("cases_id_user_unique").on(t.id, t.userId),
    index("cases_user_client_idx").on(t.userId, t.clientId),
    index("cases_user_status_idx").on(t.userId, t.status),
    index("cases_user_case_number_idx").on(t.userId, t.caseNumber),
    index("cases_user_updated_idx").on(t.userId, t.updatedAt),
  ],
);
