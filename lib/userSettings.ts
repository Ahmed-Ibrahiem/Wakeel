import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserSettings = async (userId: string) => {
  const [row] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  if (row) return row;

  const [created] = await db
    .insert(userSettings)
    .values({ userId })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [again] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  if (again) return again;

  throw new Error("Failed to load user settings");
};
