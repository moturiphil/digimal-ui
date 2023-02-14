import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://41.89.92.206/massnet/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  createCampaign(data) {
    return axios.post(API_URL + 'createCampaign', data, { headers: authHeader() });
  }
}

export default new UserService();