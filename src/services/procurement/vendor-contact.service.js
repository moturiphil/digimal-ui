import axios from '@/Axiosconfig';

class VendorContactService {
  list(vendorId) {
    return axios.get(`get_vendor_contacts/${vendorId}`);
  }

  show(vendorId, contactId) {
    return axios.get(`get_vendor_contact/${vendorId}/${contactId}`);
  }

  create(vendorId, payload) {
    return axios.post(`create_vendor_contact/${vendorId}`, payload);
  }

  update(vendorId, contactId, payload) {
    return axios.put(`update_vendor_contact/${vendorId}/${contactId}`, payload);
  }

  destroy(vendorId, contactId) {
    return axios.delete(`delete_vendor_contact/${vendorId}/${contactId}`);
  }

  setPrimary(vendorId, contactId) {
    return axios.patch(`set_primary_vendor_contact/${vendorId}/${contactId}`);
  }
}

export default new VendorContactService();
