<script setup lang="ts">
import { getUserUnits } from "~/lib/db/queries/user-unit";

const headers = useRequestHeaders(["cookie"]);

const userUnits = await getUserUnits(headers).catch(async (error) => {
  if (error?.statusCode === 401) {
    await navigateTo("/");
    return [];
  }
  throw error;
});
</script>

<template>
  <div class="container max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">
      My Collection
    </h1>
    <p class="text-gray-600 mb-6">
      Track your Warhammer 40K collection progress here.
    </p>

    <div class="container">
      <div>
        <AppUserUnitList v-if="userUnits.length > 0" :user-units="userUnits" />
        <p v-else>
          No units in your collection yet.
        </p>
      </div>
    </div>
  </div>
</template>
