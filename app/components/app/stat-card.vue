<script lang="ts" setup>
defineProps<{
  title: string;
  value: string | number;
}>();
</script>

<template>
  <div class="card place-items-center bg-base-100 border-1 shadow-md px-4">
    <div class="card-title-md">
      {{ title }}
    </div>
    <div class="card-value-md text-secondary">
      {{ value }}
    </div>
  </div>
</template>
