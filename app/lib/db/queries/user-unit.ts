import type { UserUnitWithName } from "~/lib/db/schema";

export async function getUserUnits(headers?: HeadersInit): Promise<UserUnitWithName[]> {
  return $fetch<UserUnitWithName[]>("/api/user-unit", { headers });
}
