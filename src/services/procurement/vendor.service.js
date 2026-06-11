import axios from '@/Axiosconfig';

/**
 * Vendor CRUD service mapping to /api/get_vendors etc.
 * Backend response shape:
 *   index   -> { success, data: { data, meta, links } }   (Laravel paginator)
 *   show    -> { success, data: <vendor> }
 *   store   -> { success, data: <vendor> }
 *   update  -> { success, data: <vendor> }
 *   destroy -> { success, message }
 *   toggle  -> { success, data: <vendor> }
 */
class VendorService {
  list(params = {}) {
    return axios.get('get_vendors', { params });
  }

  show(id) {
    return axios.get(`get_vendor/${id}`);
  }

  /**
   * Search ERP reference vendors by name. Results are scoped server-side to
   * the authenticated user's location (county/sub-county users only see ERP
   * vendors within their own county; national users see all).
   */
  searchErp(name) {
    return axios.get('search_erp_vendors', { params: { name } });
  }

  /**
   * Create a vendor. Always sent as multipart/form-data because the
   * payload may include the tax compliance certificate file and initial
   * LSO files.
   */
  create(payload) {
    const fd = payload instanceof FormData ? payload : VendorService.toFormData(payload);
    // NOTE: do NOT set Content-Type manually — axios needs to generate the
    // `multipart/form-data; boundary=…` header itself, otherwise Laravel
    // cannot parse the body and file uploads (PDFs etc.) are dropped.
    return axios.post('create_vendor', fd);
  }

  /**
   * Update a vendor's profile fields. Plain JSON — file replacement of
   * the tax certificate is handled via a dedicated multipart variant
   * because Laravel's PUT does not parse multipart bodies cleanly.
   */
  update(id, payload) {
    return axios.put(`update_vendor/${id}`, payload);
  }

  /**
   * Update a vendor including a new tax compliance certificate file.
   * Uses POST + _method=PUT spoofing so multipart parsing works.
   */
  updateWithFile(id, payload) {
    const fd = payload instanceof FormData ? payload : VendorService.toFormData(payload);
    fd.append('_method', 'PUT');
    // See note in create() — let axios set the multipart boundary header.
    return axios.post(`update_vendor/${id}`, fd);
  }

  destroy(id) {
    return axios.delete(`delete_vendor/${id}`);
  }

  toggleStatus(id) {
    return axios.patch(`toggle_vendor_status/${id}`);
  }

  /**
   * Build a FormData object from a plain payload.
   * Handles nested arrays (bank_accounts[*], lsos[*]) and File instances.
   */
  static toFormData(payload, form = new FormData(), namespace = '') {
    Object.entries(payload || {}).forEach(([key, value]) => {
      const formKey = namespace ? `${namespace}[${key}]` : key;
      if (value === undefined || value === null) return;
      if (value instanceof File || value instanceof Blob) {
        form.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          if (item instanceof File || item instanceof Blob) {
            form.append(`${formKey}[${idx}]`, item);
          } else if (typeof item === 'object' && item !== null) {
            VendorService.toFormData(item, form, `${formKey}[${idx}]`);
          } else {
            form.append(`${formKey}[${idx}]`, item);
          }
        });
      } else if (typeof value === 'object') {
        VendorService.toFormData(value, form, formKey);
      } else if (typeof value === 'boolean') {
        form.append(formKey, value ? '1' : '0');
      } else {
        form.append(formKey, value);
      }
    });
    return form;
  }
}

export default new VendorService();
