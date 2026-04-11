<script lang="ts" setup>
import type { UserUnitWithNameAndFaction } from "../../lib/db/schema";

const props = defineProps<{
  userUnit: UserUnitWithNameAndFaction;
}>();

const userStore = useUserStore();
const showConfirm = ref(false);
const deleting = ref(false);

type CountKey = "boxedCount" | "builtCount" | "primedCount" | "paintedCount" | "battleReadyCount";
const progressionMap: Record<CountKey, CountKey | null> = {
  boxedCount: "builtCount",
  builtCount: "primedCount",
  primedCount: "paintedCount",
  paintedCount: "battleReadyCount",
  battleReadyCount: null,
};

const regressionMap: Record<CountKey, CountKey | null> = {
  boxedCount: null,
  builtCount: "boxedCount",
  primedCount: "builtCount",
  paintedCount: "primedCount",
  battleReadyCount: "paintedCount",
};

async function progress(from: CountKey) {
  const to = progressionMap[from];
  if (!to)
    return;
  await userStore.progressUnit(props.userUnit.id, from, to);
}

async function revert(from: CountKey) {
  const to = regressionMap[from];
  if (!to)
    return;
  await userStore.progressUnit(props.userUnit.id, from, to);
}

async function adjustBoxed(delta: number) {
  await userStore.adjustCount(props.userUnit.id, "boxedCount", delta);
}

async function confirmDelete() {
  deleting.value = true;
  try {
    await userStore.deleteUserUnit(props.userUnit.id);
  }
  finally {
    deleting.value = false;
    showConfirm.value = false;
  }
}
</script>

<template>
  <tbody class="hover:bg-base-300">
    <tr class="divide-x">
      <td>{{ userUnit.factionName }}</td>
      <td>{{ userUnit.unitName }}</td>
      <td class="text-center">
        <span class="inline-flex items-center gap-2">
          <span class="inline-flex flex-col">
            <button class="btn btn-ghost btn-xs p-0 opacity-50 h-4 min-h-0" @click="adjustBoxed(1)">
              <Icon name="tabler:plus" size="14" />
            </button>
            <button class="btn btn-ghost btn-xs p-0 opacity-50 h-4 min-h-0" @click="adjustBoxed(-1)">
              <Icon name="tabler:minus" size="14" />
            </button>
          </span>
          {{ userUnit.boxedCount }}
          <button v-if="userUnit.boxedCount > 0" class="btn btn-ghost btn-xs p-0" @click="progress('boxedCount')">
            <Icon name="tabler:square-rounded-arrow-right" size="16" />
          </button>
        </span>
      </td>
      <td class="text-center">
        <span class="inline-flex items-center gap-1">
          <button v-if="userUnit.builtCount > 0" class="btn btn-ghost btn-xs p-0 opacity-50" @click="revert('builtCount')">
            <Icon name="tabler:square-rounded-arrow-left" size="16" />
          </button>
          {{ userUnit.builtCount }}
          <button v-if="userUnit.builtCount > 0" class="btn btn-ghost btn-xs p-0" @click="progress('builtCount')">
            <Icon name="tabler:square-rounded-arrow-right" size="16" />
          </button>
        </span>
      </td>
      <td class="text-center">
        <span class="inline-flex items-center gap-1">
          <button v-if="userUnit.primedCount > 0" class="btn btn-ghost btn-xs p-0 opacity-50" @click="revert('primedCount')">
            <Icon name="tabler:square-rounded-arrow-left" size="16" />
          </button>
          {{ userUnit.primedCount }}
          <button v-if="userUnit.primedCount > 0" class="btn btn-ghost btn-xs p-0" @click="progress('primedCount')">
            <Icon name="tabler:square-rounded-arrow-right" size="16" />
          </button>
        </span>
      </td>
      <td class="text-center">
        <span class="inline-flex items-center gap-1">
          <button v-if="userUnit.paintedCount > 0" class="btn btn-ghost btn-xs p-0 opacity-50" @click="revert('paintedCount')">
            <Icon name="tabler:square-rounded-arrow-left" size="16" />
          </button>
          {{ userUnit.paintedCount }}
          <button v-if="userUnit.paintedCount > 0" class="btn btn-ghost btn-xs p-0" @click="progress('paintedCount')">
            <Icon name="tabler:square-rounded-arrow-right" size="16" />
          </button>
        </span>
      </td>
      <td class="text-center">
        <span class="inline-flex items-center gap-1">
          <button v-if="userUnit.battleReadyCount > 0" class="btn btn-ghost btn-xs p-0 opacity-50" @click="revert('battleReadyCount')">
            <Icon name="tabler:square-rounded-arrow-left" size="16" />
          </button>
          {{ userUnit.battleReadyCount }}
        </span>
      </td>
      <td class="text-center">
        <button class="btn btn-ghost btn-sm text-error" @click="showConfirm = true">
          <Icon name="tabler:trash" size="18" />
        </button>
      </td>
    </tr>
  </tbody>

  <!-- Confirm delete modal -->
  <dialog v-if="showConfirm" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        Remove Unit
      </h3>
      <p class="py-4">
        Are you sure you want to remove <strong>{{ userUnit.unitName }}</strong> from your collection? This cannot be undone.
      </p>
      <div class="modal-action gap-2">
        <button class="btn btn-ghost" :disabled="deleting" @click="showConfirm = false">
          Cancel
        </button>
        <button class="btn btn-error" :disabled="deleting" @click="confirmDelete">
          {{ deleting ? 'Removing...' : 'Remove' }}
        </button>
      </div>
    </div>
    <div class="modal-backdrop" @click="showConfirm = false" />
  </dialog>
</template>
