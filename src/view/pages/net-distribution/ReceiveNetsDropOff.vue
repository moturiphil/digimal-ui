<template>
  <div>
    <sdPageHeader ghost :title="`Nets Returned at ${drop_off_name}`" />
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
              <sdButton
                class="btn-import"
                type="warning"
                @click="syncToKemsa()"
                size="extra-small"
              >
                Sync To KEMSA &nbsp; &nbsp;
                <sdFeatherIcons type="refresh-cw" size="extra-small" />
              </sdButton>
            </div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>

                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'nets_returned'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="returnedNets"
                            :columns="columns"
                          >
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="openReceiveModal(record.id)"
                                    type="success"
                                    :disabled="record.status == 1"
                                    size="extra-small"
                                    >Receive</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        &nbsp;&nbsp;

                        <!-- receive nets modal -->
                        <a-modal
                          title="Receive Nets"
                          :visible="isOpen"
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
                              @finish="receiveNets"
                            >
                              <a-form-item
                                name="date_received"
                                label="Date Received"
                              >
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="formState.date_received"
                                  :format="dateFormat"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton
                                  size="default"
                                  htmlType="Save"
                                  type="success"
                                >
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main, BasicFormWrapper } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
// import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import axios from "axios";

const dateFormat = "YYYY-MM-DD";

const columns = [
  {
    title: "From Post",
    dataIndex: "from_post_id_name",
    key: "id",
  },
  {
    title: "To Drop Off Point",
    dataIndex: "to_drop_off_point_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date Returned",
    dataIndex: "date_returned",
    key: "id",
  },
  {
    title: "Returned By",
    dataIndex: "returned_by",
    key: "id",
  },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   key: "id",
  // },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];
export default defineComponent({
  name: "Payroll",
  components: {
    Main,
    SearchResultWrapper,
    BasicFormWrapper,
  },
  setup() {
    // const { state } = useStore();
    // const crud = computed(() => state.crud.data);
    // const isLoading = computed(() => state.crud.loading);
    // const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("nets_returned");
    const postdata = ref([]);
    const returnedNets = ref([]);
    const { query } = useRoute();
    const isOpen = ref(false);
    const drop_off_name = query.name;

    const handleOk = async () => (isModalOpen.value = false);
    const handleCancelReceive = () => (isOpen.value = false);
    const handleChange = (tab) => (activeClass.value = tab);
    const isModalOpen = ref(false);
    const openmodal = () => (isModalOpen.value = true);
    const formState = reactive({
      date_received: "",
      returned_id: "",
    });
    const openReceiveModal = (id) => {
      formState.returned_id = id;
      isOpen.value = true;
    };

    const fetchPosts = async () => {
      try {
        await fetch(`${process.env.VUE_APP_BASE_URL}/posts_data`, {
          method: "GET",
          headers: authHeader(),
        })
          .then((response) => response.json())
          .then((data) => {
            postdata.value = data.data;
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    const fetchReturnedNets = async () => {
      try {
        await fetch(
          `${process.env.VUE_APP_BASE_URL}/returned_nets_list/${query.id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        )
          .then((response) => response.json())
          .then(({ success, data }) => {
            if (success) {
              returnedNets.value = data;
            } else {
              notification.error({
                message: "Error",
                description: `${data}`,
              });
            }
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: `${error}`,
            });
            isModalOpen.value = false;
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    const receiveNets = async () => {
      const data = {
        date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
      };

      try {
        fetch(
          `${process.env.VUE_APP_BASE_URL}/receive_nets_from_post/${formState.returned_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(data),
          }
        )
          .then((response) => response.json())
          .then(({ success, message }) => {
            if (success) {
              notification.success({
                message: "Success",
                description: `Received successfully`,
              });
            } else {
              notification.error({
                message: "Error",
                description: `${message}`,
              });
            }
            isOpen.value = false;
            window.location.reload();
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: `${error}`,
            });
            isOpen.value = false;
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    const syncToKemsa = async () => {
      console.log(
        `${process.env.VUE_APP_BASE_URL}/reverse_logistics_sync_approval?drop_off_point_id=${query.id}`
      );
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/reverse_logistics_sync_approval?drop_off_point_id=${query.id}`,
          {}, // Since you're not passing any data in the body, use an empty object
          {
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        );


        const { success, message } = JSON.stringify(response.data);

        if (success) {
          notification.success({
            message: "Success",
            description: `Successfully Synched Nets to Kemsa`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }

        // window.location.reload(); // Uncomment if you still need to reload the window
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: `${
            error.response ? error.response.data.message : error.message
          }`,
        });
      }
    };

    onMounted(() => {
      fetchPosts();
      fetchReturnedNets();
    });
    return {
      drop_off_name,
      receiveNets,
      handleCancelReceive,
      dateFormat,
      openReceiveModal,
      isOpen,
      returnedNets,
      postdata,
      dataSource,
      columns,
      formState,
      handleChange,
      activeClass,
      isModalOpen,
      openmodal,
      handleOk,
      syncToKemsa,
    };
  },
});
</script>
<style scoped>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.title-success {
  color: green;
}
</style>
<style scoped>
.icon-color-white {
  color: white;
}
</style>
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
    height: calc(70vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
