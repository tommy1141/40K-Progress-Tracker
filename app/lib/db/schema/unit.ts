import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { faction } from "./faction";

export const unit = sqliteTable("unit", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  factionId: int().notNull().references(() => faction.id),
});
