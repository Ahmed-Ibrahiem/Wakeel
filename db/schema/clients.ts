import {
  uuid,
  text,
  timestamp,
  date,
  index,
  unique,
  pgTable,
} from "drizzle-orm/pg-core";
import { timestamps } from "./columns";
import { user } from "./auth-schema";
import { sql } from "drizzle-orm";

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    email: text("email"),
    address: text("address"),
    firstContactDate: date("first_contact_date", { mode: "string" })
      .notNull()
      .default(sql`CURRENT_DATE`),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    unique("clients_id_user_unique").on(t.userId, t.id),
    index("client_user_name_idx").on(t.userId, t.fullName),
    index("client_archive_at_idx").on(t.userId, t.archivedAt),
  ],
);

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
