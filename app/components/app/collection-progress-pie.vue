<script setup lang="ts">
import type { UserUnitWithNameAndFaction } from "~/lib/db/schema";

const props = defineProps<{
  userUnits: UserUnitWithNameAndFaction[];
}>();

type Slice = {
  label: string;
  value: number;
  color: string;
  percent: number;
};

const stageTotals = computed(() => {
  return props.userUnits.reduce(
    (acc, unit) => {
      acc.boxed += unit.boxedCount;
      acc.built += unit.builtCount;
      acc.primed += unit.primedCount;
      acc.painted += unit.paintedCount;
      acc.battleReady += unit.battleReadyCount;
      return acc;
    },
    {
      boxed: 0,
      built: 0,
      primed: 0,
      painted: 0,
      battleReady: 0,
    },
  );
});

const slices = computed<Slice[]>(() => {
  const values = [
    { label: "Boxed", value: stageTotals.value.boxed, color: "#3b82f6" },
    { label: "Built", value: stageTotals.value.built, color: "#f59e0b" },
    { label: "Primed", value: stageTotals.value.primed, color: "#8b5cf6" },
    { label: "Painted", value: stageTotals.value.painted, color: "#10b981" },
    { label: "Battle Ready", value: stageTotals.value.battleReady, color: "#ef4444" },
  ];

  const total = values.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return values.map(item => ({ ...item, percent: 0 }));
  }

  return values.map(item => ({
    ...item,
    percent: (item.value / total) * 100,
  }));
});

const totalUnitsTracked = computed(() => {
  return slices.value.reduce((sum, item) => sum + item.value, 0);
});

const chartBackground = computed(() => {
  if (totalUnitsTracked.value === 0) {
    return "conic-gradient(#d1d5db 0% 100%)";
  }

  let start = 0;
  const stops: string[] = [];

  for (const slice of slices.value) {
    if (slice.percent <= 0) {
      continue;
    }

    const end = start + slice.percent;
    stops.push(`${slice.color} ${start}% ${end}%`);
    start = end;
  }

  return `conic-gradient(${stops.join(", ")})`;
});
</script>

<template>
  <section class="card bg-base-100 shadow-md border border-base-300">
    <div class="card-body gap-6">
      <div>
        <h2 class="card-title text-2xl">
          Collection Progress
        </h2>
        <p class="text-sm opacity-70">
          Stage distribution across all tracked units.
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[220px_1fr] items-center">
        <div class="relative mx-auto size-52">
          <div
            class="size-full rounded-full"
            :style="{ background: chartBackground }"
          />
          <div class="absolute inset-8 rounded-full bg-base-100 grid place-content-center text-center border border-base-300">
            <p class="text-xs uppercase tracking-wide opacity-70">
              Total
            </p>
            <p class="text-2xl font-bold">
              {{ totalUnitsTracked }}
            </p>
          </div>
        </div>

        <ul class="grid gap-2">
          <li
            v-for="slice in slices"
            :key="slice.label"
            class="flex items-center justify-between rounded-md bg-base-200 px-3 py-2"
          >
            <span class="flex items-center gap-2 font-medium">
              <span class="size-3 rounded-sm" :style="{ backgroundColor: slice.color }" />
              {{ slice.label }}
            </span>
            <span class="text-sm">
              {{ slice.value }} ({{ slice.percent.toFixed(1) }}%)
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
