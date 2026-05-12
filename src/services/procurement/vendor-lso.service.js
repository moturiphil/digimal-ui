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

  show(vendorId, lsoId) {
    return axios.get(`get_vendor_lso/${vendorId}/${lsoId}`);
  }

  create(vendorId, payload) {
    const fd = payload instanceof FormData ? payload : buildFormData(payload);
    return axios.post(`create_vendor_lso/${vendorId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Update LSO. Backend exposes update under POST (see api.php#L2476)
   * so we send multipart directly without method spoofing.
   */
  update(vendorId, lsoId, payload) {
    const fd = payload instanceof FormData ? payload : buildFormData(payload);
    return axios.post(`update_vendor_lso/${vendorId}/${lsoId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  destroy(vendorId, lsoId) {
    return axios.delete(`delete_vendor_lso/${vendorId}/${lsoId}`);
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
