
<template>
    <RecordViewWrapper>
      <sdPageHeader title="View Post Workers">
        <template #subTitle>
        </template>
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
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :dataSource="dataSource"
                    :columns="columns"
                  >
                    <template #point="{ record }">
                      <td>
                        <div class="table-actions">
                          &nbsp;&nbsp;
                          <sdButton size="extra-small" type="success">
                            <router-link
                              :to="{
                                path: `/receive-nets/`,
                                query: {
                                  id: record.id,
                                  name: record.name,
                                  campaign_id: record.campaign_id,
                                },
                              }"
                              class="btn-icon"
                              type="info"
                              shape="circle"
                            >
                              
                            </router-link>
                          </sdButton>
                        </div>
                      </td>
                    </template>
                  </a-table>
                </TableWrapper>
              </div>
              <!-- Issue modal -->
              <a-modal
                title="Issue Nets"
                :visible="isModalOpen"
                @cancel="handleCancelReceive"
                width="50%"
                footer=""
              >
                <BasicFormWrapper>
                  <a-form
                    class="add-transfer-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleIssue"
                  >
                    <a-form-item name="post_id" label="To Post">
                      <a-select
                        placeholder="Select  Post "
                        v-model:value="formState.post_id"
                      >
                        <a-select-option
                          v-for="post in postdata"
                          :key="post.id"
                          v-model:value="post.id"
                        >
                          {{ post.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item name="bale_size" label="Bale Size">
                      <a-select
                        v-model:value="formState.bale_size"
                        placeholder="Select Bale Size"
                      >
                        <a-select-option value="40">40</a-select-option>
                        <a-select-option value="50">50</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item name="no_of_bales" label="Number of bales">
                      <a-input
                        v-model:value="formState.number_of_bales"
                        placeholder="Number of bales"
                        type="number"
                      />
                    </a-form-item>
                    <a-form-item name="no_of_pieces" label="Number of Pieces">
                      <a-input
                        v-model:value="formState.no_of_pieces"
                        placeholder="Enter number of pieces"
                        type="number"
                        @change="validateNoOfPieces"
                      />
                    </a-form-item>
                    <!-- <a-form-item name="issue_date" label="Date of Issue">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.issue_date"
                        :format="dateFormat"
                      />
                    </a-form-item> -->
  
                    <a-form-item name="S11 Serial Number" label="S11 Serial Number">
                      <a-input
                        v-model:value="formState.delivery_note_number"
                        placeholder="S11 Serial Number"
                      />
                    </a-form-item>
                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
                </BasicFormWrapper>
              </a-modal>
              <!-- End of Issue modal -->
            </sdCards>
          </a-col>
        </a-row>
        <a-col :xs="24">
          <DragAndDropTable />
        </a-col>
      </Main>
    </RecordViewWrapper>
  </template>
  <script>
  import { RecordViewWrapper } from "../style";
  import { Main } from "../../styled";
  import { useStore } from "vuex";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  // import axios from "axios";  drop_off_manager
  import authHeader from "../../../services/auth-header";
  import { useRoute } from "vue-router";
//   import { notification } from "ant-design-vue";
  // import dayjs from "dayjs";
  const dateFormat = "YYYY-MM-DD";
  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "id",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "id",
    },
    {
      title: "Location",
      dataIndex: "location_id",
      key: "id",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "id",
    },
    // {
    //   title: "Drop off Manager",
    //   dataIndex: "drop_off_manager",
    //   key: "id",
    // },
    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "point",
    //   slots: { customRender: "point" },
    // },
  ];
  
  const DragAndDropTable = defineComponent({
    name: "ViewPage",
    components: { RecordViewWrapper, Main },
  
    setup() {
      const { state, dispatch } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
      const isModalOpen = ref(false);
      const postdata = ref([]);
      const { query } = useRoute();

      const formState = reactive({
        post_id: "",
        drop_off_point_id: "",
        bale_size: "",
        number_of_bales: "",
        no_of_pieces: "",
        issue_date: "",
        delivery_note_number: "",
      });

      console.log(query.id)
  
      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/view_post_workers?post_id=${query.id}`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
          console.log(data.data);
          dataSource.value = data.data;
          console.log(dataSource.value);
        } catch (error) {
          console.error(error);
        }
      });
  
      const openModal = (id) => {
        isModalOpen.value = true;
        formState.drop_off_point_id = id;
      };
  
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
  
      const handleCancelReceive = () => {
        isModalOpen.value = false;
      };
  
      const onSelectChange = (selectedRowKey) => {
        selectedRowKeys.value = selectedRowKey;
      };
  
      const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };
  
      return {
        dateFormat,
        postdata,
        handleCancelReceive,
        openModal,
        isModalOpen,
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
  
  export default DragAndDropTable;
  </script>
  <style>
  .full-modal {
    .ant-modal {
      max-width: 50%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      /* height: calc(70vh); */
    }
    .ant-modal-body {
      flex: 1;
    }
  }
  </style>
  