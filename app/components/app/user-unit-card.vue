<script lang="ts" setup>
import type { UserUnitWithName } from "~/lib/db/schema";

defineProps<{
  userUnit: UserUnitWithName;
}>();
</script>

<template>
  <div class="flex-row gap-3 card bg-base-200 shadow-md p-4 border-1 justify-between">
    <AppStatCard title="Unit" :value="userUnit.unitName" />
    <AppStatCard title="In Box" :value="userUnit.boxedCount" />
    <AppStatCard title="Built" :value="userUnit.builtCount" />
    <AppStatCard title="Primed" :value="userUnit.primedCount" />
    <AppStatCard title="Painted" :value="userUnit.paintedCount" />
    <AppStatCard title="Battle Ready!" :value="userUnit.battleReadyCount" />
  </div>
</template>
