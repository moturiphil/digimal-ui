import axios from '@/Axiosconfig';

/**
 * @typedef {Object} TrainingMaterial
 * @property {string} id
 * @property {string} name
 * @property {string} download_name
 * @property {string} mime_type
 * @property {'pdf'|'image'|'document'|'spreadsheet'|'presentation'|'video'|'audio'|'archive'|'other'} kind
 * @property {number|null} size
 * @property {string|null} modified_time
 * @property {'national'|'county'|'sub_county'} tier
 * @property {string} tier_label
 * @property {string} category
 * @property {string} folder_path
 * @property {boolean} previewable
 *
 * @typedef {Object} TrainingTier
 * @property {string} key
 * @property {string} label
 * @property {number} count
 *
 * @typedef {Object} TrainingCatalogue
 * @property {{ level_id: number, level_label: string }} viewer
 * @property {TrainingTier[]} tiers
 * @property {TrainingMaterial[]} materials
 * @property {number} total
 * @property {string} synced_at
 */

/**
 * Read a JSON error message out of a Blob response. Preview/download requests
 * use responseType=blob, so Laravel's JSON error body arrives as a Blob.
 */
const readBlobMessage = async (blob) => {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return typeof parsed?.message === 'string' ? parsed.message : '';
  } catch (error) {
    return '';
  }
};

export const trainingMaterialErrorMessage = async (
  error,
  fallback = 'Something went wrong. Please try again.',
) => {
  const data = error?.response?.data;

  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return (await readBlobMessage(data)) || fallback;
  }

  if (data && typeof data === 'object' && typeof data.message === 'string') {
    return data.message;
  }

  if (typeof error?.message === 'string' && error.message) {
    return error.message;
  }

  return fallback;
};

class TrainingMaterialService {
  /**
   * @param {{ refresh?: number }} params
   * @returns {Promise<{ data: TrainingCatalogue }>}
   */
  list(params = {}) {
    return axios.get('my-training-materials', { params });
  }

  /**
   * @param {string} fileId
   * @returns {Promise<Blob>}
   */
  preview(fileId) {
    return axios.get(
      'my-training-materials/' + encodeURIComponent(fileId) + '/preview',
      { responseType: 'blob' },
    );
  }

  /**
   * @param {string} fileId
   * @returns {Promise<Blob>}
   */
  download(fileId) {
    return axios.get(
      'my-training-materials/' + encodeURIComponent(fileId) + '/download',
      { responseType: 'blob' },
    );
  }
}

export default new TrainingMaterialService();
