import axios from '@/Axiosconfig';

/**
 * Reference data for the M&E pickers.
 *
 * Backed by the dedicated `me/*` lookup routes so the UI never borrows
 * level-scoped or unrelated permissions (`activity_list`, `campaign-org-units`,
 * `get_counties`) and can only offer options the write endpoints accept.
 */
class MeLookupsService {
  /** Every activity template plus the stage it is mapped to in the campaign. */
  async activityLists() {
    const { data } = await axios.get('me/activity-lists');
    const rows = data?.data ?? data ?? [];

    return (Array.isArray(rows) ? rows : []).map((row) => ({
      id: Number(row.id),
      name: row.name,
      level_id: Number(row.level_id || 0),
      is_active: Boolean(row.is_active),
      stage_id: row.stage_id === null || row.stage_id === undefined ? null : Number(row.stage_id),
      stage_name: row.stage_name || null,
    }));
  }

  /** Counties with nested sub-counties for the compliance / submission filters. */
  async campaignOrgUnits() {
    const { data } = await axios.get('me/campaign-org-units');

    return {
      counts: data?.counts || { counties: 0, sub_counties: 0 },
      counties: Array.isArray(data?.counties) ? data.counties : [],
    };
  }

  /** Locations the signed-in user may complete/reopen a stage for. */
  async stageLocations(stageId) {
    const { data } = await axios.get(`me/stages/${stageId}/locations`);

    return Array.isArray(data?.locations) ? data.locations : [];
  }

  /** Locations a checklist may be answered for, given an activity. */
  async checklistLocations(checklistId, activityId) {
    const { data } = await axios.get(`me/checklists/${checklistId}/locations`, {
      params: { activity_id: activityId },
    });

    return Array.isArray(data?.locations) ? data.locations : [];
  }
}

export default new MeLookupsService();
