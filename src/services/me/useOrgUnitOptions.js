import { computed, ref } from 'vue';
import meLookups from '@/services/me/me-lookups.service';
import { levelLabel } from '@/view/pages/me/constants';

/**
 * Location picker for stage completion and checklist responses.
 *
 * The backend already applies the access / activity rules:
 *   • me/stages/{stage}/locations          → own unit or a unit beneath it
 *   • me/checklists/{checklist}/locations  → activity locations for the
 *                                            checklist's enabled levels
 * so the UI only has to disable the rows marked `completed` / `locked`.
 */
export function useOrgUnitOptions() {
  const locations = ref([]);
  const loading = ref(false);

  const options = computed(() =>
    locations.value.map((row) => ({
      value: Number(row.id),
      label: `${row.name} (${levelLabel(row.level_id)})`,
      disabled: Boolean(row.completed || row.locked),
    })),
  );

  async function loadForStage(stageId) {
    loading.value = true;
    try {
      locations.value = await meLookups.stageLocations(stageId);
    } finally {
      loading.value = false;
    }
  }

  async function loadForChecklist(checklistId, activityId) {
    loading.value = true;
    try {
      locations.value = await meLookups.checklistLocations(checklistId, activityId);
    } finally {
      loading.value = false;
    }
  }

  return { locations, options, loading, loadForStage, loadForChecklist };
}
