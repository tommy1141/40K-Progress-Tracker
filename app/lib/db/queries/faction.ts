import type { Faction } from "~/lib/db/schema/faction";

export async function getAllFactions() {
  const { data } = await useFetch<Faction[]>("/api/faction");
  return data ?? [];
}
