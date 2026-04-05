<script setup lang="ts">
import type { Faction } from "~/lib/db/schema/faction";
import type { Unit } from "~/lib/db/schema/unit";

type PendingRow = {
  factionId: number | null;
  unitId: number | null;
  units: Unit[];
  boxedCount: number;
  builtCount: number;
  primedCount: number;
  paintedCount: number;
  battleReadyCount: number;
};

const requestFetch = useRequestFetch();
const factions = await requestFetch<Faction[]>("/api/faction");
const saving = ref(false);
const userStore = useUserStore();

type SaveResult = {
  unitName: string;
  status: "added" | "failed";
  reason?: string;
};

const showModal = ref(false);
const saveResults = ref<SaveResult[]>([]);

function resolveUnitName(row: PendingRow): string {
  return row.units.find(u => u.id === row.unitId)?.name ?? `Unit #${row.unitId}`;
}

function makeRow(): PendingRow {
  return {
    factionId: null,
    unitId: null,
    units: [],
    boxedCount: 0,
    builtCount: 0,
    primedCount: 0,
    paintedCount: 0,
    battleReadyCount: 0,
  };
}

const rows = ref<PendingRow[]>([makeRow()]);

function addRow() {
  rows.value.unshift(makeRow());
}

async function onFactionChange(row: PendingRow) {
  row.unitId = null;
  row.units = [];
  if (row.factionId) {
    row.units = await $fetch<Unit[]>(`/api/faction/${row.factionId}`);
  }
}

async function saveAll() {
  const validRows = rows.value.filter(r => r.factionId && r.unitId);
  if (validRows.length === 0)
    return;
  saving.value = true;
  try {
    const results = await Promise.allSettled(
      validRows.map(row =>
        $fetch("/api/user-unit", {
          method: "POST",
          body: {
            unitId: row.unitId,
            boxedCount: row.boxedCount,
            builtCount: row.builtCount,
            primedCount: row.primedCount,
            paintedCount: row.paintedCount,
            battleReadyCount: row.battleReadyCount,
          },
        }),
      ),
    );
    saveResults.value = results.map((result, i) => ({
      unitName: resolveUnitName(validRows[i]!),
      status: result.status === "fulfilled" ? "added" : "failed",
      reason: result.status === "rejected" ? (result.reason?.data?.message ?? result.reason?.message ?? "Unknown error") : undefined,
    }));

    await userStore.fetchUserUnits();
    showModal.value = true;
  }
  finally {
    saving.value = false;
  }
}

function addMore() {
  showModal.value = false;
  rows.value = [makeRow()];
}

function removeRow(index: number) {
  rows.value.splice(index, 1);
}
</script>

<template>
  <main class="container mx-auto max-w-5xl px-4 py-8 space-y-6">
    <!-- Results modal -->
    <dialog v-if="showModal" :open="showModal" class="modal modal-open">
      <div class="modal-box max-w-lg">
        <h3 class="font-bold text-lg mb-4">
          Save Results
        </h3>

        <div class="space-y-2 max-h-72 overflow-y-auto">
          <div
            v-for="(result, i) in saveResults"
            :key="i"
            class="flex items-center gap-3 p-2 rounded-lg"
            :class="result.status === 'added' ? 'bg-success/20' : 'bg-error/20'"
          >
            <span class="text-lg">{{ result.status === 'added' ? '✓' : '✗' }}</span>
            <div>
              <p class="font-medium">
                {{ result.unitName }}
              </p>
              <p v-if="result.reason" class="text-xs opacity-70">
                {{ result.reason }}
              </p>
            </div>
          </div>
        </div>

        <div class="modal-action gap-2 mt-6">
          <button class="btn btn-primary" @click="addMore">
            Add More
          </button>
          <NuxtLink class="btn btn-success" to="/dashboard/collection">
            Go to Collection
          </NuxtLink>
        </div>
      </div>
    </dialog>
    <section class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">
          Add Unit
        </h1>
        <p class="text-sm text-base-content/70">
          Add a unit to your collection by selecting the faction, unit, and counts.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="btn btn-success"
          :disabled="rows.every(r => !r.factionId || !r.unitId) || saving"
          @click="saveAll"
        >
          {{ saving ? 'Saving...' : 'Save All' }}
        </button>
        <button class="btn btn-primary" @click="addRow">
          Add Unit
        </button>
      </div>
    </section>

    <div v-if="rows.length > 0" class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr class="text-center divide-x text-white">
            <th class="text-left">
              Faction
            </th>
            <th class="text-left">
              Name
            </th>
            <th>boxed</th>
            <th>built</th>
            <th>primed</th>
            <th>painted</th>
            <th>battle ready</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index" class="divide-x odd:bg-base-400 even:bg-base-100">
            <td>
              <select
                v-model="row.factionId"
                class="select select-bordered select-sm w-full min-w-36"
                @change="onFactionChange(row)"
              >
                <option :value="null" disabled>
                  Select faction
                </option>
                <option v-for="faction in factions" :key="faction.id" :value="faction.id">
                  {{ faction.name }}
                </option>
              </select>
            </td>
            <td>
              <select
                v-model="row.unitId"
                class="select select-bordered select-sm w-full min-w-36"
                :disabled="!row.factionId || row.units.length === 0"
              >
                <option :value="null" disabled>
                  Select unit
                </option>
                <option v-for="unit in row.units" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>
            </td>
            <td class="text-center">
              <input v-model.number="row.boxedCount" type="number" min="0" class="input input-bordered input-sm w-16 text-center">
            </td>
            <td class="text-center">
              <input v-model.number="row.builtCount" type="number" min="0" class="input input-bordered input-sm w-16 text-center">
            </td>
            <td class="text-center">
              <input v-model.number="row.primedCount" type="number" min="0" class="input input-bordered input-sm w-16 text-center">
            </td>
            <td class="text-center">
              <input v-model.number="row.paintedCount" type="number" min="0" class="input input-bordered input-sm w-16 text-center">
            </td>
            <td class="text-center">
              <input v-model.number="row.battleReadyCount" type="number" min="0" class="input input-bordered input-sm w-16 text-center">
            </td>
            <td class="text-center">
              <button class="btn btn-ghost btn-sm text-error" @click="removeRow(index)">
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-base-content/50">
      Click "Add Unit" to start adding units to your collection.
    </p>
  </main>
</template>
