<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
  navigateTo("/");
});
</script>

<template>
  <div class="card bg-base-300 container text-center mx-auto gap-4 mt-4 min-h-72 flex flex-col items-center justify-center">
    <span class="loading loading-spinner loading-xl" />
  </div>
</template>
