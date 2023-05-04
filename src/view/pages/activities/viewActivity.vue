<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Activities">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <router-link to="/activities/activity-create">
            <sdFeatherIcons type="plus" size="14" /> Start New
            Activity</router-link
          >
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
                  :pagination="{ pageSize: 50, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #activities="{ record }">
                    <td :style="{ 'margin-left': '3px' }">
                      <div class="table-actions">
                        <sdButton>
                          <router-link
                            :to="{
                              path: `/activity/view/${record.id}`,
                              query: { id: record.event_code },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="16" />
                            &nbsp;&nbsp; Confirmed
                          </router-link>
                        </sdButton>
                        <sdButton>
                          <router-link
                            :to="{
                              path: `/activity/pending-confirmation/${record.id}`,
                              query: { id: record.event_code },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="pause" size="16" />
                            &nbsp;&nbsp; Pending
                          </router-link>
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
import authHeader from "../../../services/auth-header";
import { RecordViewWrapper } from "./style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";

import { computed, onMounted, ref, reactive, defineComponent } from "vue";

const columns = [
  {
    title: "Actvity Name",
    dataIndex: "name",
    key: "id",
  },
  // {
  //   title: 'Activity diffForHumans',
  //   dataIndex: 'diffForHumans',
  //   key: 'id',
  // },
  {
    title: "Activity Start Date",
    dataIndex: "start_date",
    key: "id",
  },
  {
    title: "Activity Code",
    dataIndex: "activity_code",
    key: "id",
  },
  {
    title: "Number of Officers",
    dataIndex: "number_of_officers",
    key: "id",
  },
  {
    title: "Campaign",
    dataIndex: "campaign_id",
    key: "id",
  },
  {
    title: "County",
    dataIndex: "county_id",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "activities",
    slots: { customRender: "activities" },
  },
];

const ViewPage = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main, TableWrapper },
  methods: {
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
        style: {
          float: "center",
          display: "grid",
          placeContent: "center",
        },

        onOk() {
          // console.log("Register");
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
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data;
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
