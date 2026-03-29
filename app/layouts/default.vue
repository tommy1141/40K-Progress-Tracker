<script lang="ts" setup>
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex flex-col min-h-screen mx-auto">
    <AppNavBar />
    <main>
      <slot />
    </main>
  </div>
</template>
