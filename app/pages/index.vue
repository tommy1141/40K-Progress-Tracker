<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="hero bg-base-200 container mx-auto mt-4">
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          Travel Log
        </h1>
        <p class="py-6">
          Keep track of your travels and adventures with simple travel log app. Add locations, dates, and notes to create a personalized travel journal. Start documenting your journeys today!
        </p>
        <AppAuthButton v-if="!authStore.loading && !authStore.user" />
        <NuxtLink v-else to="/dashboard" class="btn btn-primary">
          Start Logging! <Icon name="tabler:map" size="32" class="ml-2" />
        </nuxtlink>
      </div>
    </div>
  </div>
</template>
