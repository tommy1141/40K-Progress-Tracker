<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="navbar  bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost  text-xl">
        40K Progress Tracker
      </NuxtLink>
      <NuxtLink v-if="!authStore.loading && authStore.user" to="/dashboard" class="btn btn-ghost  text-xl">
        Dashboard
      </NuxtLink>
      <NuxtLink v-if="!authStore.loading && authStore.user" to="/dashboard/collection" class="btn btn-ghost  text-xl">
        My Collection
      </NuxtLink>
    </div>

    <div class="navbar-end">
      <AppThemeToggle />
      <AppAuthButton />
    </div>
  </div>
</template>
