import type { Faction, UserUnitWithNameAndFaction } from "~/lib/db/schema";

export const useUserStore = defineStore("useUserStore", () => {
  const factionFilter = ref<string>("");
  const searchQuery = ref<string>("");
  const userUnits = ref<UserUnitWithNameAndFaction[]>([]);

  async function fetchUserUnits() {
    const requestFetch = useRequestFetch();
    const data = await requestFetch<UserUnitWithNameAndFaction[]>("/api/user-unit", {
      method: "GET",
    });

    userUnits.value = data || [];
  }

  function setFactionFilter(faction: string) {
    factionFilter.value = faction;
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function filteredUserUnits() {
    let result = userUnits.value;

    if (factionFilter.value) {
      result = result.filter(unit => unit.factionName === factionFilter.value);
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      result = result.filter(
        unit =>
          unit.unitName.toLowerCase().includes(q)
          || unit.factionName.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => a.factionName.localeCompare(b.factionName));
    return result;
  }

  const uniqueFactions = computed<Faction[]>(() => {
    const factions = new Set(userUnits.value.map((unit) => {
      return { id: unit.factionId, name: unit.factionName } as Faction;
    }));
    return Array.from(factions);
  });

  async function deleteUserUnit(id: number) {
    await $fetch(`/api/user-unit/${id}`, { method: "DELETE" });
    userUnits.value = userUnits.value.filter(u => u.id !== id);
  }

  async function progressUnit(id: number, from: keyof UserUnitWithNameAndFaction, to: keyof UserUnitWithNameAndFaction) {
    const unit = userUnits.value.find(u => u.id === id);
    if (!unit || (unit[from] as number) <= 0)
      return;
    const patch = { [from]: (unit[from] as number) - 1, [to]: (unit[to] as number) + 1 };
    await $fetch(`/api/user-unit/${id}`, { method: "PATCH", body: patch });
    (unit[from] as number) -= 1;
    (unit[to] as number) += 1;
  }

  async function adjustCount(id: number, field: keyof UserUnitWithNameAndFaction, delta: number) {
    const unit = userUnits.value.find(u => u.id === id);
    if (!unit)
      return;
    const current = unit[field] as number;
    const next = Math.max(0, current + delta);
    if (next === current)
      return;
    await $fetch(`/api/user-unit/${id}`, { method: "PATCH", body: { [field]: next } });
    (unit[field] as number) = next;
  }

  return {
    userUnits,
    setFactionFilter,
    factionFilter,
    searchQuery,
    setSearchQuery,
    filteredUserUnits,
    fetchUserUnits,
    uniqueFactions,
    deleteUserUnit,
    progressUnit,
    adjustCount,
  };
});
