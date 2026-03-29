import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { unit } from "./unit";

export const userUnit = sqliteTable("user_unit", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull().references(() => user.id),
  unitId: int().notNull().references(() => unit.id),
  boxedCount: int().notNull().default(0),
  builtCount: int().notNull().default(0),
  primedCount: int().notNull().default(0),
  paintedCount: int().notNull().default(0),
  battleReadyCount: int().notNull().default(0),
});
