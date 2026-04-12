import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { faction } from "./faction";

export const unit = sqliteTable("unit", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  factionId: int().notNull().references(() => faction.id),
}, t => [unique("name_faction_unique").on(t.name, t.factionId),
]);
export type Unit = typeof unit.$inferSelect;
