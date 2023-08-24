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
                        <sdButton
                          size="extra-small"
                          type="success"
                          :disabled="isStarting"
                          @click="startDistribution(record.id)"
                          v-if="!record.status"
                        >
                          <span>
                            <sdFeatherIcons type="clock" size="extra-small" />
                            &nbsp;&nbsp; Start Distribution
                          </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          size="small"
                          type="danger"
                          :disabled="isStarting"
                          v-else
                          @click="closeDistribution(record.id)"
                        >
                          <span> &nbsp;&nbsp; Close Distribution </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              path: `/nets/receive-post-nets`,
                              query: { id: record.id, name: record.name},
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            &nbsp;&nbsp; Receive Nets
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              path: `/assign-worker`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            &nbsp;&nbsp; Assign Post Workers
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          &nbsp;&nbsp; Message HH's
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="warning" size="extra-small">
                          <router-link
                            :to="{
                              path: `/nets/net-transfers-post`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            &nbsp;&nbsp; Net Transfers
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
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Distribution Post Code",
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
    key: "activities",
    slots: { customRender: "activities" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  data() {
    return{
      isStarting: false,
      distributionStatus: {},
      posts: [],
    }
  },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const searchItem = ref("");

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
        this.distributionStatus = {};
        for(const post of dataSource.value) {
          this.distributionStatus[post.id] = post.status
        }
      } catch (error) {
        console.error(error);
      }
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
            regex.test(event.post_code) ||
            regex.test(event.post_supervisor_user_id)
          );
        });
      }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      results,
      searchItem,
      columns,
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
        if (data.status === true) {
          notification.success({
            message: "Distribution Started",
            description: data.message,
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000); 
          });
          location.reload();
        } else {
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
        if (data.status === true) {
          notification.success({
            message: "Distribution Closed",
            description: "Event has been closed successfully",
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000); 
          });
          location.reload();
        } else {
          this.eventStatus[id] = false;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.error({
            message: "Event Not Closed",
            description: "Only event host or facilitator can close event",
          });
        }
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
