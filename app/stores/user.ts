import type { UserUnitWithNameAndFaction } from "~/lib/db/schema";

export const useUserStore = defineStore("useUserStore", () => {
  const factionFilter = ref<string>("");
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

  function filteredUserUnits() {
    if (!factionFilter.value) {
      return userUnits.value;
    }

    const result = userUnits.value.filter(unit => unit.factionName === factionFilter.value);
    result.sort((a, b) => a.factionName.localeCompare(b.factionName));
    return result;
  }

  return {
    userUnits,
    setFactionFilter,
    factionFilter,
    filteredUserUnits,
    fetchUserUnits,
  };
});
