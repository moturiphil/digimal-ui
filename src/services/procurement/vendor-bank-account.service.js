import axios from '@/Axiosconfig';

class VendorBankAccountService {
  list(vendorId) {
    return axios.get(`get_vendor_bank_accounts/${vendorId}`);
  }

  show(vendorId, bankAccountId) {
    return axios.get(`get_vendor_bank_account/${vendorId}/${bankAccountId}`);
  }

  create(vendorId, payload) {
    return axios.post(`create_vendor_bank_account/${vendorId}`, payload);
  }

  update(vendorId, bankAccountId, payload) {
    return axios.put(`update_vendor_bank_account/${vendorId}/${bankAccountId}`, payload);
  }

  destroy(vendorId, bankAccountId) {
    return axios.delete(`delete_vendor_bank_account/${vendorId}/${bankAccountId}`);
  }

  setPrimary(vendorId, bankAccountId) {
    return axios.patch(`set_primary_vendor_bank_account/${vendorId}/${bankAccountId}`);
  }
}

export default new VendorBankAccountService();
