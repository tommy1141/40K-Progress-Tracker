<script lang="ts" setup>
const route = useRoute();

const error = route.query.error || "An unknown error occurred.";
const errorDescription = route.query.error_description || "No additional information is available.";
</script>

<template>
  <div class="card bg-base-300 container text-center mx-auto gap-4 mt-4 min-h-72 flex flex-col items-center justify-center">
    <div role="alert" class="alert alert-error min-w-1/2">
      <Icon name="tabler:alert-triangle" size="24" class="mr-2" />
      <span>{{ error }} : {{ errorDescription }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary">
      Home <Icon name="tabler:arrow-left" size="32" class="ml-2" />
    </NuxtLink>
  </div>
</template>
