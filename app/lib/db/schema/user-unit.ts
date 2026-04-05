import { int, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { faction } from "./faction";
import { unit } from "./unit";

export const userUnit = sqliteTable("user_unit", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull().references(() => user.id),
  unitId: int().notNull().references(() => unit.id),
  factionId: int().notNull().references(() => faction.id),
  boxedCount: int().notNull().default(0),
  builtCount: int().notNull().default(0),
  primedCount: int().notNull().default(0),
  paintedCount: int().notNull().default(0),
  battleReadyCount: int().notNull().default(0),
}, t => [unique("user_unit_unique").on(t.userId, t.unitId),
]);

export type UserUnit = typeof userUnit.$inferSelect;
export type UserUnitWithName = UserUnit & { unitName: string };
export type UserUnitWithNameAndFaction = Omit<UserUnit, "userId"> & { unitName: string; factionName: string };
