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



// <script>
// import { UserTableStyleWrapper } from "../style";
// import { TableWrapper } from "../../../styled";
// import { computed, defineComponent, onMounted, ref, reactive } from "vue";
// import { useStore } from "vuex";
// import authHeader from "../../../../../src/services/auth-header";
// import axios from "axios";

// const columns = [
//   {
//     title: "Event Name",
//     dataIndex: "name",
//     key: "id",
//   },
//   {
//     title: "Event Code",
//     dataIndex: "event_code",
//     key: "id",
//   },
//   {
//     title: "Event Status",
//     dataIndex: "status",
//     key: "id",
//   },
//   {
//     title: "Event Venue",
//     dataIndex: "venue",
//     key: "id",
//   },
//   {
//     title: "Actions",
//     dataIndex: "",
//     key: "events",
//     slots: { customRender: "events" },
//     width: "90px",
//   },
// ];

// const EventCampaignTable = defineComponent({
//   name: "EventCampaignTable",
//   components: { UserTableStyleWrapper, TableWrapper },
//   setup() {
//     const { state } = useStore();
//     const eventData = computed(() => state.crud.data);

//     const dataSource = ref([]);
//     const selectedRowKeys = ref([]);
//     const campaignId = ref(null);

//     onMounted(() => {
//       if (campaignId.value) {
//         const API_URL = `http://localhost:8000/api/campaign/${campaignId.value}/events`;

//         axios
//           .get(API_URL, {
//             headers: authHeader(),
//           })
//           .then((response) => {
//             console.log(response.data.data);
//             dataSource.value = response.data.data;
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       }
//     });

//     const onSelectChange = (selectedRowKey) => {
//       selectedRowKeys.value = selectedRowKey;
//     };

//     const rowSelection = {
//       selectedRowKeys,
//       onChange: onSelectChange,
//     };

//     return {
//       columns,
//       eventData,
//       rowSelection,
//       dataSource,
//       selectedRowKeys,
//       onSelectChange,
//       campaignId,
//     };
//   },
// });

// export default EventCampaignTable;
// </script>