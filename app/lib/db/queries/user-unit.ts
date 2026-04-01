import type { UserUnitWithNameAndFaction } from "~/lib/db/schema";

export async function getUserUnits(headers?: HeadersInit): Promise<UserUnitWithNameAndFaction[]> {
  return $fetch<UserUnitWithNameAndFaction[]>("/api/user-unit", { headers });
}
