<script setup lang="ts">
const userStore = useUserStore();
await userStore.fetchUserUnits();
</script>

<template>
  <main class="container mx-auto max-w-5xl px-4 py-8 space-y-6">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">
        My Collection
      </h1>
      <p class="text-gray-600 mb-6">
        Track your Warhammer 40K collection progress here.
      </p>
      <div class="flex items-center justify-between gap-4 my-4">
        <AppFactionDropDown :factions="userStore.uniqueFactions" />
        <input
          v-model="userStore.searchQuery"
          type="text"
          placeholder="Search by unit or faction..."
          class="input input-bordered w-full max-w-xs ml-auto"
        >
      </div>
      <div class="container">
        <div>
          <AppUserUnitList v-if="userStore.filteredUserUnits().length > 0" :user-units="userStore.filteredUserUnits()" />
          <p v-else>
            No units in your collection yet.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
