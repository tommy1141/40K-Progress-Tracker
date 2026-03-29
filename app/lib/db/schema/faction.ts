import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const faction = sqliteTable("faction", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});