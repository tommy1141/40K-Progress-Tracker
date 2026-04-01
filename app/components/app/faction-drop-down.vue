<script setup lang="ts">
import { getAllFactions } from "~/lib/db/queries/faction";

const factions = await getAllFactions();
const userStore = useUserStore();
</script>

<template>
  <div class="dropdown dropdown-bottom dropdown-center">
    <div tabindex="0" role="button" class="btn m-1">
      Filter By Faction
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
      <li @click="userStore.setFactionFilter('')">
        <a>All Factions</a>
      </li>
      <li v-for="faction in factions" :key="faction.id" @click="userStore.setFactionFilter(faction.name)">
        <a>{{ faction.name }}</a>
      </li>
    </ul>
  </div>
</template>
