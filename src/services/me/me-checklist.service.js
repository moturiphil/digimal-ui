import axios from '@/Axiosconfig';

/**
 * M&E supervision endpoints.
 *
 * Mirrors DigiMalBackend/routes/api.php (the `me/*` group). Every method
 * returns the axios promise; pages read `res.data`.
 */
class MeChecklistService {
  // ── Stages ────────────────────────────────────────────────────────────────
  listStages(params = {}) {
    return axios.get('me/stages', { params });
  }

  createStage(payload) {
    return axios.post('me/stages', payload);
  }

  updateStage(stageId, payload) {
    return axios.put(`me/stages/${stageId}`, payload);
  }

  syncStageActivityLists(stageId, activityListIds) {
    return axios.put(`me/stages/${stageId}/activity-lists`, {
      activity_list_ids: activityListIds,
    });
  }

  completeStage(stageId, orgUnitId) {
    return axios.post(`me/stages/${stageId}/complete`, { org_unit_id: orgUnitId });
  }

  reopenStage(stageId, orgUnitId) {
    return axios.post(`me/stages/${stageId}/reopen`, { org_unit_id: orgUnitId });
  }

  // ── Checklists ────────────────────────────────────────────────────────────
  listChecklists(params = {}) {
    return axios.get('me/checklists', { params });
  }

  listMyChecklists(params = {}) {
    return axios.get('me/my-checklists', { params });
  }

  createChecklist(payload) {
    return axios.post('me/checklists', payload);
  }

  getChecklist(checklistId, params = {}) {
    return axios.get(`me/checklists/${checklistId}`, { params });
  }

  getChecklistStructure(checklistId, params = {}) {
    return axios.get(`me/checklists/${checklistId}/structure`, { params });
  }

  updateChecklist(checklistId, payload) {
    return axios.put(`me/checklists/${checklistId}`, payload);
  }

  toggleChecklist(checklistId) {
    return axios.patch(`me/checklists/${checklistId}/toggle`);
  }

  // ── Sections / questions ──────────────────────────────────────────────────
  createSection(checklistId, payload) {
    return axios.post(`me/checklists/${checklistId}/sections`, payload);
  }

  updateSection(sectionId, payload) {
    return axios.put(`me/sections/${sectionId}`, payload);
  }

  deleteSection(sectionId) {
    return axios.delete(`me/sections/${sectionId}`);
  }

  createQuestion(sectionId, payload) {
    return axios.post(`me/sections/${sectionId}/questions`, payload);
  }

  updateQuestion(questionId, payload) {
    return axios.put(`me/questions/${questionId}`, payload);
  }

  toggleQuestion(questionId) {
    return axios.patch(`me/questions/${questionId}/toggle`);
  }

  // ── Submissions ───────────────────────────────────────────────────────────
  submitChecklist(payload) {
    return axios.post('me/submissions', payload);
  }

  listMySubmissions(params = {}) {
    return axios.get('me/submissions/mine', { params });
  }

  updateSubmission(ref, payload) {
    return axios.put(`me/submissions/${ref}`, payload);
  }

  listSubmissions(params = {}) {
    return axios.get('me/submissions', { params });
  }

  getSubmission(ref) {
    return axios.get(`me/submissions/${ref}`);
  }

  getCompliance(params = {}) {
    return axios.get('me/compliance', { params });
  }
}

export default new MeChecklistService();

/**
 * Turn an API failure into a human-readable message.
 *
 * Laravel 422 responses carry `{ message, errors: { field: [msg] } }`; the
 * first validation message is the most useful one for a toast.
 */
export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  const errors = data?.errors;

  if (errors && typeof errors === 'object') {
    const first = Object.values(errors)[0];
    if (Array.isArray(first) && first.length) return first[0];
    if (typeof first === 'string' && first) return first;
  }

  return data?.message || fallback;
}
