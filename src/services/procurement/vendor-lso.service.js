import axios from '@/Axiosconfig';

const buildFormData = (payload) => {
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? '1' : '0');
    } else {
      fd.append(key, value);
    }
  });
  return fd;
};

class VendorLsoService {
  list(vendorId, params = {}) {
    return axios.get(`get_vendor_lsos/${vendorId}`, { params });
  }

  /**
   * Cross-vendor paginated LSO list used by the top-level
   * Procurement › LSOs page. Each row includes vendor + service type.
   */
  listAll(params = {}) {
    return axios.get('get_all_vendor_lsos', { params });
  }

  /**
   * Open (active, non-expired, non-delinked) LSOs across vendors. Used for
   * the "replacement LSO" picker when delinking an order that covers closed
   * events.
   */
  open(params = {}) {
    return axios.get('open_vendor_lsos', { params });
  }

  show(vendorId, lsoId) {
    return axios.get(`get_vendor_lso/${vendorId}/${lsoId}`);
  }

  create(vendorId, payload) {
    const fd = payload instanceof FormData ? payload : buildFormData(payload);
    // Let axios attach `multipart/form-data; boundary=…` automatically.
    return axios.post(`create_vendor_lso/${vendorId}`, fd);
  }

  /**
   * Update LSO. Backend exposes update under POST (see api.php#L2476)
   * so we send multipart directly without method spoofing.
   */
  update(vendorId, lsoId, payload) {
    const fd = payload instanceof FormData ? payload : buildFormData(payload);
    return axios.post(`update_vendor_lso/${vendorId}/${lsoId}`, fd);
  }

  destroy(vendorId, lsoId) {
    return axios.delete(`delete_vendor_lso/${vendorId}/${lsoId}`);
  }

  /**
   * What a delink would affect. When `requires_replacement` is true the LSO
   * is attached to closed event(s) and a replacement must be supplied in the
   * same delink request.
   */
  delinkImpact(vendorId, lsoId) {
    return axios.get(`get_vendor_lso_delink_impact/${vendorId}/${lsoId}`);
  }

  /**
   * Detach the LSO/LPO from the vendor without deleting it. The record stays
   * on the vendor profile with a "Delinked" status for audit purposes but can
   * no longer be linked to an event.
   *
   * `replacement_vendor_lso_id` is required when the LSO covers closed
   * events; those events are re-linked to the replacement atomically.
   */
  delink(vendorId, lsoId, payload = {}) {
    return axios.patch(`delink_vendor_lso/${vendorId}/${lsoId}`, payload);
  }

  /**
   * Re-attach a previously delinked LSO/LPO to the vendor.
   */
  relink(vendorId, lsoId) {
    return axios.patch(`relink_vendor_lso/${vendorId}/${lsoId}`);
  }

  /**
   * Download the LSO file as a blob. Caller is responsible for turning
   * the blob into an object URL (preview) or saving it (download).
   */
  download(vendorId, lsoId) {
    return axios.get(`download_vendor_lso/${vendorId}/${lsoId}`, {
      responseType: 'blob',
    });
  }
}

export default new VendorLsoService();
