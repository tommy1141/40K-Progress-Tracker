<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="hero bg-base-200 container mx-auto mt-4">
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          40K Progress Tracker
        </h1>
        <p class="py-6">
          Track your Warhammer 40K collection and progress with ease. Log your units, monitor your collection, and stay organized as you build your army.
        </p>
        <AppAuthButton v-if="!authStore.loading && !authStore.user" />
        <NuxtLink v-else to="/dashboard" class="btn btn-primary">
          Start Tracking! <Icon name="tabler:building-warehouse" size="32" class="ml-2" />
        </nuxtlink>
      </div>
    </div>
  </div>
</template>
