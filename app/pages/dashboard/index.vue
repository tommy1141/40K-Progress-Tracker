<script setup lang="ts">
import type { UserUnitWithNameAndFaction } from "~/lib/db/schema";

const userStore = useUserStore();
await userStore.fetchUserUnits();

const selectedIntent = ref<"build" | "paint" | null>(null);
const selectedUnit = ref<UserUnitWithNameAndFaction | null>(null);

function pickRandomUnit(units: UserUnitWithNameAndFaction[]) {
  if (units.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * units.length);
  return units[index] || null;
}

function chooseBuildUnit() {
  selectedIntent.value = "build";
  const boxedUnits = userStore.userUnits.filter(unit => unit.boxedCount > 0);
  selectedUnit.value = pickRandomUnit(boxedUnits);
}

function choosePaintUnit() {
  selectedIntent.value = "paint";
  const paintableUnits = userStore.userUnits.filter(unit => unit.builtCount > 0 || unit.primedCount > 0);
  selectedUnit.value = pickRandomUnit(paintableUnits);
}

const emptyStateMessage = computed(() => {
  if (selectedIntent.value === "build") {
    return "No boxed units are available to build right now.";
  }

  if (selectedIntent.value === "paint") {
    return "No built or primed units are available to paint right now.";
  }

  return "";
});

const selectedCount = computed(() => {
  if (!selectedUnit.value || !selectedIntent.value) {
    return 0;
  }

  if (selectedIntent.value === "build") {
    return selectedUnit.value.boxedCount;
  }

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
      <NuxtLink class="btn btn-primary" to="/dashboard/collection/">
        View Collection
      </NuxtLink>
    </section>

    <AppCollectionProgressPie :user-units="userStore.userUnits" />

    <section class="card bg-base-100 shadow-md border border-base-300">
      <div class="card-body gap-4">
        <h2 class="card-title text-2xl">
          Suprise Me!
        </h2>
        <p class="text-sm opacity-70">
          Choose what you want to do, then get a random unit from your collection.
        </p>

        <div class="flex flex-wrap gap-3">
          <button class="btn btn-primary" type="button" @click="chooseBuildUnit">
            I want to build
          </button>
          <button class="btn btn-secondary" type="button" @click="choosePaintUnit">
            I want to Paint
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
            {{ selectedUnit.factionName }} • {{ selectedCount }} available for this activity.
          </p>
        </div>

        <div v-else-if="selectedIntent" class="rounded-lg border border-warning/40 bg-warning/10 p-4">
          <p class="text-sm">
            {{ emptyStateMessage }}
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
