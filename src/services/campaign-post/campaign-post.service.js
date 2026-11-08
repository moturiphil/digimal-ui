import axios from '@/Axiosconfig';

/**
 * Campaign post selection service.
 *
 * Backs the "which distribution posts take part in the active campaign" flow
 * added by DigiMalBackend PR #194 (`ft-campaign-post-selection`):
 *
 *   GET  active_campaign             -> { success, message, data: { id, name, start_date, end_date, is_active } | null }
 *   GET  posts_data?status=…         -> { success, campaign_id, data, field_guide, pagination }
 *   POST campaign_posts/confirm      -> { success, message, campaign_id, confirmed: [ids], failed: [{ post_id, reason }] }
 *   POST campaign_posts/deactivate   -> { success, message, campaign_id, deactivated: [ids], failed: [{ post_id, reason }] }
 *   POST campaign_posts/activate     -> { success, message, campaign_id, activated: [ids], failed: [{ post_id, reason }] }
 *
 * Writes always target the ACTIVE campaign (CampaignContext::requireCurrentId()),
 * while reads accept ?campaign_id= to review a past campaign.
 *
 * `status` values (DistributionController::getAllPosts):
 *   confirmed   (default) posts taking part in the campaign, stopped ones included
 *   unconfirmed           published + active in the previous campaign + not yet
 *                         confirmed for this one (i.e. what can be carried over)
 *   deactivated           posts confirmed but stopped in this campaign
 *   all                   every published post the caller may see
 */
class CampaignPostService {
  /**
   * The campaign currently being run, or null when none is open.
   * The caller must tolerate a 403 (the `active_campaign` permission is
   * granted separately from the post-selection ones).
   */
  activeCampaign() {
    return axios.get('active_campaign');
  }

  /**
   * Posts as seen from one campaign.
   *
   * @param {object} params
   * @param {'confirmed'|'unconfirmed'|'deactivated'|'all'} [params.status]
   * @param {number|null} [params.campaignId] read a specific (usually past) campaign
   * @param {number} [params.perPage]
   * @param {number} [params.page]
   * @param {string} [params.query] matches name / post_code / supervisor
   */
  listPosts({ status = 'confirmed', campaignId = null, perPage = 100, page = 1, query = '' } = {}) {
    const params = { status, per_page: perPage, page };
    if (campaignId) params.campaign_id = campaignId;
    if (query) params.query = query;

    return axios.get('posts_data', { params });
  }

  /** Carry posts into the active campaign. Each starts with no supervisor and zero stock. */
  confirmPosts(postIds) {
    return axios.post('campaign_posts/confirm', { post_ids: postIds });
  }

  /**
   * Stop posts in the active campaign, keeping their history. Refused (per post,
   * under `failed`) while the post still holds stock or has unserved households.
   */
  stopPosts(postIds, reason) {
    return axios.post('campaign_posts/deactivate', { post_ids: postIds, reason });
  }

  /** Put stopped posts back in use in the active campaign. */
  restartPosts(postIds) {
    return axios.post('campaign_posts/activate', { post_ids: postIds });
  }
}

/**
 * Human-readable message for a failed request: the first Laravel 422 validation
 * message, else the API `message`, else the supplied fallback.
 */
export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  const firstValidationError = Object.values(data?.errors || {})[0]?.[0];
  return firstValidationError || data?.message || error?.message || fallback;
}

export default new CampaignPostService();
