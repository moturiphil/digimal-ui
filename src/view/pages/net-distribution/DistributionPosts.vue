<template>
  <RecordViewWrapper>
    <sdPageHeader title="Distribution Posts">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
      </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name/code/supervisor"
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
                  :pagination="{ pageSize: 200, showSizeChanger: true }"
                  :dataSource="results"
                  :columns="columns"
                >
                  <template #activities="{ record }">
                    <td>
                      <div class="table-actions">
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              // path: `/nets/receive-post-nets`,
                              path: `/nets/receive-nets-summary`,
                              query: { id: record.id, name: record.name },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            <!-- <sdFeatherIcons type="mail" size="16" /> -->
                            &nbsp;&nbsp; Manage Inventory
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              path: `/view-worker`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            View Post Workers
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          type="success"
                          size="extra-small"
                          @click="openModal(record.id)"
                        >
                          Assign Supervisor
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              path: `/nets/verify-post-nets`,
                              query: { id: record.id, name: record.name },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            Bale Verification
                          </router-link>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <!-- Assign supervisor -->
            <a-modal
              title="Assign Supervisor"
              :visible="isModalOpen"
              @cancel="handleCancel"
              width="50%"
              footer=""
            >
              <BasicFormWrapper>
                <a-form
                  class="add-record-form"
                  :style="{ width: '100%' }"
                  layout="vertical"
                  name="addnew"
                  :model="formState"
                  @finish="handleSubmit"
                >
                  <a-form-item name="Supervisors" label="Select Supervisor">
                    <a-select
                      v-model:value="formState.user_id"
                      show-search
                      option-filter-prop="label"
                      placeholder="Select one"
                    >
                      <a-select-option
                        v-for="user in supervisors"
                        :key="user.id"
                        :value="user.id"
                        :label="`${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`"
                      >
                        {{ user.first_name }} {{ user.last_name }}
                        {{ user.other_name }} - {{ user.id_no }},{{
                          user.role_id
                        }}, {{ user.location_id }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <div class="record-form-actions text-right">
                    <sdButton size="default" htmlType="Save" type="success">
                      {{ isLoading ? "Loading..." : "Submit" }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </a-modal>
            <!-- End of assign supervisor -->
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
import { computed, onMounted, ref, defineComponent, reactive } from "vue";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";

const columns = [
  // {
  //   title: "Distribution Id",
  //   dataIndex: "id",
  //   key: "id",
  // },
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "",
  },
  {
    title: "Sub County",
    dataIndex: "distribution_sub_county",
    key: "",
  },
  {
    title: "Location",
    dataIndex: "distribution_location_id",
    key: "",
  },
  {
    title: "Distribution Post Code", // distribution_sublocation_id
    dataIndex: "post_code",
    key: "post_code",
  },
  {
    title: "Supervisor Name",
    dataIndex: "post_supervisor_user_id",
    key: "post_supervisor_user_id",
  },
  {
    title: "",
    dataIndex: "",
    // fixed: 'right',
    // width: 20,
    key: "activities",
    slots: { customRender: "activities" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  data() {
    return {
      isStarting: false,
      distributionStatus: {},
      posts: [],
    };
  },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const supervisors = ref([]);
    const searchItem = ref("");
    const isModalOpen = ref(false);

    //   const api_url = UserService;
    //   console.log(api_url);

    const supervisorList = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();

        // Modify the structure of each supervisor to include a 'label' property
        supervisors.value = data.data.map((user) => ({
          ...user,
          label: `${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    supervisorList();


    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/posts_data`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        dataSource.value = data.data;
        // console.log(dataSource.value);
        this.distributionStatus = {};
        console.log(this.distributionStatus);
        for (const post of dataSource.value) {
          this.distributionStatus[post.id] = post.status;
          console.log(post.status);
        }
      } catch (error) {
        console.error(error);
      }
    });

    const formState = reactive({
      post_id: "",
      user_id: "",
    });

    const openModal = (id) => {
      isModalOpen.value = true;
      formState.post_id = id;
      console.log(isModalOpen.value);
    };

    const handleCancel = () => {
      isModalOpen.value = false;
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

    const notifyHH = async (id) => {
      console.log(id);
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/notify_households?post_id=${id}`,
          {
            method: "POST",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.success == true) {
          notification.success({
            message: "Success",
            description: data.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Error",
            description: data.message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleSubmit = async () => {
      try {
        const data = {
          post_id: formState.post_id,
          user_id: formState.user_id,
        };
        console.log(data);
        await fetch(`${process.env.VUE_APP_BASE_URL}/assign_post_supervisor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then(({ status, data }) => {
            if (status == true) {
              notification.success({
                message: "Success",
                description: data,
              });
              isModalOpen.value = false;
              setTimeout(function () {
                location.reload();
              }, 3000);
            } else {
              notification.error({
                message: "Error",
                description: `${status}`,
              });
            }
            isModalOpen.value = false;
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: `${error}`,
            });
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((event) => {
          return (
            regex.test(event.name) ||
            regex.test(event.distribution_sub_county) ||
            regex.test(event.distribution_ward) ||
            regex.test(event.distribution_sublocation_id) ||
            regex.test(event.distribution_location_id)
          );
        });
      }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      supervisors,
      isModalOpen,
      handleDelete,
      handleCancel,
      handleSubmit,
      rowSelection,
      onSelectChange,
      openModal,
      formState,
      results,
      searchItem,
      columns,
      notifyHH,
    };
  },

  methods: {
    async startDistribution(id) {
      try {
        this.isStarting = true;
        console.log(id);
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/start_distribution/${id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.status === true) {
          // this.eventStatus[id] = true;
          // localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.success({
            message: "Distribution Started",
            description: data.message,
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
          });
          location.reload();
        } else {
          // this.eventStatus[id] = false;
          // localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.error({
            message: "Distribution Not Started",
            description: data.message,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isStarting = false;
      }
    },
    async closeDistribution(id) {
      try {
        this.isStarting = true;
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/close_distribution/${id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log("******************************************");
        console.log("******************************************");
        console.log(data);
        if (data.status === true) {
          // this.eventStatus[id] = true;
          // localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          // notify the user
          notification.success({
            message: "Distribution Closed",
            description: "Event has been closed successfully",
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
          });
          location.reload();
        } else {
          this.eventStatus[id] = false;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.error({
            message: "Event Not Closed",
            description: "Only event host or facilitator can close event",
          });
          // await new Promise((resolve) => {
          // setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
          // });
        }
        // location.reload();
      } catch (error) {
        console.error(error);
      } finally {
        this.isStarting = true;
      }
    },
  },
});

export default DragAndDropTable;
</script>
