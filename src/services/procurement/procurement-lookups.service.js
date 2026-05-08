import axios from '@/Axiosconfig';

class ProcurementLookupsService {
  banks(params = {}) {
    return axios.get('get_banks', { params });
  }

  bank(id) {
    return axios.get(`get_bank/${id}`);
  }

  counties() {
    return axios.get('get_counties');
  }

  subcounties(countyId) {
    const params = countyId ? { county_id: countyId } : {};
    return axios.get('get_subcounties', { params });
  }

  serviceTypes() {
    return axios.get('get_service_types');
  }
}

export default new ProcurementLookupsService();
