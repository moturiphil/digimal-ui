<template>
    <RecordViewWrapper>
      <sdPageHeader title="MassNet Activities">
        <template #subTitle>
          <sdButton class="btn-add_new" size="default" type="success">
            <router-link to="/activities/activity-create"> <sdFeatherIcons type="plus" size="14" /> Start New Activity</router-link>
          </sdButton>
        </template>
        <template #buttons>
          <div class="search-box">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              @change="onHandleSearch"
              v-model:value.trim="formState.searchItem"
              type="text"
              name="dataSource"
              placeholder="Search Here"
            /></div
        ></template>
      </sdPageHeader>
      <Main>
        <a-row :gutter="15">
          <a-col class="w-100" :md="24">
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>
  
              <div v-else>
                <TableWrapper class="table-data-view table-responsive">
                  <a-table
                    :rowSelection="rowSelection"
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :dataSource="dataSource"
                    :columns="columns"
                  >
                  <template #activities="{  }" >
                  <td :style="{'margin-left': '3px'}">
                        <div class="table-actions">
                    <sdButton
                              @click="showSuccessModal"
                              size="small"
                              type="success"
                            >
                              <sdFeatherIcons type="user-plus" size="17" />
                              &nbsp;&nbsp; Register
                            </sdButton>
                          </div>
                        </td>
                    </template>
                  </a-table>
                </TableWrapper>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </Main>
    </RecordViewWrapper>
  </template>
  <script>
  import axios from "axios";
  import authHeader from "../../../services/auth-header"
  import { RecordViewWrapper } from './style';
  import { Main, TableWrapper } from '../../styled';
  import { useStore } from 'vuex';
  import { Modal } from "ant-design-vue";

  import { computed, onMounted, ref, reactive, defineComponent } from 'vue';
  
//   "id": 1,
//             "name": "Event Alanna",
//             "event_code": "NLKyzDJUNp",
//             "start_date": "2006-06-09",
//             "end_date": "1990-06-18",
//             "user_id": 1,
//             "campaign_id": 1,
//             "venue": "Venue Vickie",
//             "location_id": 1,
  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'id',
    },
    {
      title: 'Event Start Date',
      dataIndex: 'start_date',
      key: 'id',
    },
    {
      title: 'Event End Date',
      dataIndex: 'end_date',
      key: 'id',
    },
    {
      title: 'Number of Officers',
      dataIndex: 'number_of_officers',
      key: 'id',
    },
    {
      title: 'Campaign Id',
      dataIndex: 'campaign_id',
      key: 'id',
    },
    {
      title: 'County',
      dataIndex: 'county_id',
      key: 'id',
    },
    {
      title: '',
      dataIndex: '',
      key: 'activities',
      slots: { customRender: "activities" },
    }
    
  ];
  
  const ViewPage = defineComponent({
    name: 'ViewPage',
    components: { RecordViewWrapper, Main, TableWrapper },
    methods:{
      showModal() {
      this.visible = true;
    },
    showSuccessModal() {
    Modal.info({
      title: "Activity Registration",
      content: (
        <div>
          <p>Register With Activity Code</p>
          <Input placeholder="Enter Activity code" />
        </div>
      ),
      okText: "Register",
      style:{
        float:'center',
        display:'grid',
        placeContent:'center'
      },
     
      onOk() {
        console.log("Register");
      },
    });
  },
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.colorVisible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
      this.colorVisible = false;
    },
    changeType(type) {
      this.modalType = type;
    },
    
    },

    setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity`;
  

   
    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then(({data}) => {
          console.log({data: data.data});
          dataSource.value = data.data.map((obj) => {
            switch(obj.county_id){
              case 1:
                obj['county_id'] = 'Bungoma';
                return obj;
              case 2:
                obj['county_id'] = 'Busia';
                return obj;
              case 3:
                obj['county_id'] = 'Elgeyo Marakwet';
                return obj;
              case 4:
                obj['county_id'] = 'Kericho';
                return obj;
                
              default:
                return obj
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      columns,
      formState,
    };
  },
  });
  
  export default ViewPage;
  </script>
  