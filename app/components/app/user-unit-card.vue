<script lang="ts" setup>
import type { UserUnitWithNameAndFaction } from "../../lib/db/schema";

defineProps<{
  userUnit: UserUnitWithNameAndFaction;
}>();
</script>

<template>
  <tbody class="hover:bg-base-300 ">
    <tr class="divide-x">
      <td>{{ userUnit.factionName }}</td>
      <td>{{ userUnit.unitName }}</td>
      <td class="text-center">
        {{ userUnit.boxedCount }}
      </td>
      <td class="text-center">
        {{ userUnit.builtCount }}
      </td>
      <td class="text-center">
        {{ userUnit.primedCount }}
      </td>
      <td class="text-center ">
        {{ userUnit.paintedCount }}
      </td>
      <td class="text-center">
        {{ userUnit.battleReadyCount }}
      </td>
    </tr>
  </tbody>
</template>
