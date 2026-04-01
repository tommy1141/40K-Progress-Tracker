<script setup lang="ts">
import type { UserUnitWithNameAndFaction } from "~/lib/db/schema";

defineProps<{
  userUnits: UserUnitWithNameAndFaction[];
}>();
</script>

<template>
  <div>
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr class="text-center divide-x text-white">
            <th>Faction</th>
            <th>Name</th>
            <th>boxed</th>
            <th>built</th>
            <th>primed</th>
            <th>painted</th>
            <th>battle ready</th>
          </tr>
        </thead>
        <AppUserUnitCard v-for="userUnit in userUnits" :key="userUnit.id" :user-unit="userUnit" class="odd:bg-base-400 even:bg-base-100" />
      </table>
    </div>
  </div>
</template>
