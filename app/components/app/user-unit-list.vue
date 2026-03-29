<script setup lang="ts">
import type { UserUnitWithName } from "~/lib/db/schema";

defineProps<{
  userUnits: UserUnitWithName[];
}>();
</script>

<template>
  <div>
    <div class="flex-col gap-4">
      <AppUserUnitCard v-for="userUnit in userUnits" :key="userUnit.id" :user-unit="userUnit" />
    </div>
  </div>
</template>
