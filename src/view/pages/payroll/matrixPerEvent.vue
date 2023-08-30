<template>
  <div>
    <sdPageHeader
      :title="`Assign Event Payroll - ${event_name}`"
    ></sdPageHeader>
    <Main>
      <br />
      <br />
      <!-- <br> -->
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <!-- header -->
                      <sdHeader> <b> Assigned Organizations </b></sdHeader>
                      <br /><br />
                      <div>
                        <sdButton
                          class="spaced-button"
                          size="extra-small"
                          type="success"
                          outlined
                          v-for="org in orgTypeAssigned"
                          :key="org.id"
                        >
                          {{ org.org_id }}
                          <sdButton
                            class="remove-button"
                            size="extra-small"
                            type="danger"
                            @click="removeOrgType(org.id)"
                          >
                             <sdFeatherIcons type="trash-2" size="small" />
                            <!-- Replace "trash-2" with the appropriate sdfeather icon name -->
                          </sdButton>
                        </sdButton>
                      </div>
                      <br />
                      <br />
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>
                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #matrix="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    :disabled="isStarting"
                                    @click="removeMatrix(record.id)"
                                    v-if="!record.status"
                                  >
                                    <span>
                                      <sdFeatherIcons
                                        type="trash"
                                        size="small"
                                      />
                                      &nbsp;&nbsp; Remove Matrix
                                    </span>
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
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";

// const households = ref([]);

const columns = [
  {
    title: "Assigned Payroll Matrix",
    dataIndex: "pay_matrix_id",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "matrix",
    slots: { customRender: "matrix" },
  },
];
export default defineComponent({
  name: "MatrixPerActivity",
  components: {
    Main,
    SearchResultWrapper,
  },
  data() {
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
    };
  },
  methods: {},
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const orgTypeAssigned = ref([]);
    const activeClass = ref("all");

    const { params, query } = useRoute();

    console.log({ query, params });
    const matrix_id = query.id;
    console.log(matrix_id);
    const event_name = query.name;
    const API_URL = `${process.env.VUE_APP_BASE_URL}/view_event_matrix?event_list_id=${matrix_id}`;
    const assignedOrgs = `${process.env.VUE_APP_BASE_URL}/view_event_org_matrix?event_list_id=${matrix_id}`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          dataSource.value = response.data.data;
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(assignedOrgs, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data);
          orgTypeAssigned.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const removeMatrix = async (id) => {
      const removeMatrixUrl = `${process.env.VUE_APP_BASE_URL}/delete_event_matrix?matrix_id=${id}`;
      console.log(id);
      try {
        const response = await axios.delete(removeMatrixUrl, {
          headers: authHeader(),
        });

        console.log(response.data);

        if (response.data.success) {
          notification.success({
            message: "Success",
            description: response.data.message,
          });

          await new Promise((resolve) => {
            setTimeout(resolve, 1500); // Wait for 1.5 seconds (adjust the time as needed)
          });

          location.reload();
        } else {
          notification.error({
            message: "Error",
            description: response.data.message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const removeOrgType = async (id) => {
      const removeOrgTypeUrl = `${process.env.VUE_APP_BASE_URL}/delete_event_orgtype_matrix?matrix_id=${id}`;
      console.log(id);
      try {
        const response = await axios.delete(removeOrgTypeUrl, {
          headers: authHeader(),
        });

        console.log(response.data);

        if (response.data.success) {
          notification.success({
            message: "Success",
            description: response.data.message,
          });

          await new Promise((resolve) => {
            setTimeout(resolve, 1500); // Wait for 1.5 seconds (adjust the time as needed)
          });

          location.reload();
        } else {
          notification.error({
            message: "Error",
            description: response.data.message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const formState = reactive({
      searchItem: "",
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      columns,
      formState,
      // exportHouseHoldData,
      handleChange,
      activeClass,
      event_name,
      removeMatrix,
      orgTypeAssigned,
      removeOrgType,
    };
  },
  // computed: {
  // },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
    border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 1rem;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.spaced-button {
  margin-right: 25px; /* Adjust the value as needed */
  margin-bottom: 15px;
}

.remove-button {
  margin-left: 15px; /* Adjust the value as needed */
  margin-right: -25px;
}
</style>
