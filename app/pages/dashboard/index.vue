<script setup lang="ts">
import type { UserUnitWithNameAndFaction } from "~/lib/db/schema";

const userStore = useUserStore();
await userStore.fetchUserUnits();

const selectedUnit = ref<UserUnitWithNameAndFaction | null>(null);
const hasChosen = ref(false);

function pickRandomUnit(units: UserUnitWithNameAndFaction[]) {
  if (units.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * units.length);
  return units[index] || null;
}

function chooseForMe() {
  hasChosen.value = true;
  const actionableUnits = userStore.filteredUserUnits().filter(
    unit => unit.boxedCount > 0 || unit.builtCount > 0 || unit.primedCount > 0,
  );
  selectedUnit.value = pickRandomUnit(actionableUnits);
}

const suggestion = computed(() => {
  if (!selectedUnit.value)
    return "";
  if (selectedUnit.value.boxedCount > 0)
    return "build";
  return "prime and paint";
});

const suggestionCount = computed(() => {
  if (!selectedUnit.value)
    return 0;
  if (selectedUnit.value.boxedCount > 0)
    return selectedUnit.value.boxedCount;
  return selectedUnit.value.builtCount + selectedUnit.value.primedCount;
});
</script>

<template>
  <main class="container mx-auto max-w-5xl px-4 py-8 space-y-6">
    <section class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">
          Dashboard
        </h1>
        <p class="text-sm opacity-70">
          Snapshot of your current collection.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <AppFactionDropDown :factions="userStore.uniqueFactions" />
        <NuxtLink class="btn btn-primary" to="/dashboard/collection/">
          View Collection
        </NuxtLink>
      </div>
    </section>

    <AppCollectionProgressPie :user-units="userStore.filteredUserUnits()" />

    <section class="card bg-base-100 shadow-md border border-base-300">
      <div class="card-body gap-4">
        <h2 class="card-title text-2xl">
          Suprise Me!
        </h2>
        <p class="text-sm opacity-70">
          Choose what you want to do, then get a random unit from your collection.
        </p>

        <div class="flex flex-wrap gap-3">
          <button class="btn btn-primary" type="button" @click="chooseForMe">
            Choose for me
          </button>
        </div>

        <div v-if="selectedUnit" class="rounded-lg border border-base-300 bg-base-200 p-4">
          <p class="text-sm uppercase tracking-wide opacity-70">
            Your random pick
          </p>
          <p class="text-xl font-semibold mt-1">
            {{ selectedUnit.unitName }}
          </p>
          <p class="text-sm opacity-80 mt-1">
            {{ selectedUnit.factionName }} • You should <strong>{{ suggestion }}</strong> this — {{ suggestionCount }} available.
          </p>
        </div>

        <div v-else-if="hasChosen" class="rounded-lg border border-warning/40 bg-warning/10 p-4">
          <p class="text-sm">
            No units are available for any activity right now.
          </p>
          <a
            class="link link-primary mt-2 inline-block"
            href="https://www.warhammer.com/en-GB/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse Warhammer models
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
