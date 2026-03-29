import type { Unit } from "~/lib/db/schema";

export async function getUnitById(id: number): Promise<Unit | null> {
  return $fetch<Unit>(`/api/unit/${id}`);
}
