<script setup lang="ts">
import type { Faction } from "~/lib/db/schema/faction";

defineProps<{
  factions: Faction[];
}>();

const userStore = useUserStore();
</script>

<template>
  <div class="dropdown dropdown-bottom dropdown-center">
    <div tabindex="0" role="button" class="btn m-1">
      Filter By Faction
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
      <li class="bg-primary" @click="userStore.setFactionFilter('')">
        <a>All Factions</a>
      </li>
      <li v-for="faction in factions" :key="faction.id" class="bg-primary" @click="userStore.setFactionFilter(faction.name)">
        <a>{{ faction.name }}</a>
      </li>
    </ul>
  </div>
</template>
