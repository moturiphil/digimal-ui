import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  createCampaign(data) {
    return axios.post(API_URL + 'createCampaign', data, { headers: authHeader() });
  }
}

export default new UserService();