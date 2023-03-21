import staticData from '@/demoData/projectData.json';
import mutations from './mutations';
import axios from 'axios';
import authHeader from "../../../services/auth-header";


const state = () => ({
  data: staticData,
  singData: staticData,
  loading: false,
  error: null,
});


const actions = {
  async eventCampaignData({ commit }, paramsId) {
    try {
      commit('eventCampaignBegin');
      const response = await axios.get(`http://localhost:8000/api/campaign/${paramsId}/events`, {
        headers: authHeader(),
      });
      console.log(response);
      const data = response.data;
      commit('eventCampaignSuccess', data);
    } catch (err) {
      commit('eventCampaignErr', err);
    }
  },
  // other actions...
};


export default {
  namespaced: false,
  state,
  actions,
  mutations,
};
