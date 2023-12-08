<template>
  <div>
    <sdPageHeader ghost title="Activity Dashboard"> </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24"> </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <h3>Created Activities</h3>
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 10,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions"></div>
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

      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <h3>Invited Activities</h3>
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 10,
                              showSizeChanger: true,
                            }"
                            :dataSource="invitedAct"
                            :columns="columns"
                          >
                            <template>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions"></div>
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

      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
                <h3> Enrolled Activities</h3>
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 10,
                              showSizeChanger: true,
                            }"
                            :dataSource="enrolledAct"
                            :columns="enrolled_columns"
                          >
                            <template>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions"></div>
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
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
// import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Actvity Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Actvity Code",
    dataIndex: "activity_code",
    key: "id",
  },
  {
    title: "Activity Start Date",
    dataIndex: "start_date",
    key: "id",
  },
  {
    title: "No of Days",
    dataIndex: "number_of_days",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "activity",
    slots: { customRender: "activity" },
  },
];

const enrolled_columns = [
  {
    title: "Actvity Name",
    dataIndex: "activity_id",
    key: "id",
  },
  {
    title: "Actvity Code",
    dataIndex: "code",
    key: "id",
  },
  {
    title: "Activity Start Date",
    dataIndex: "activity_date",
    key: "id",
  },
//   {
//     title: "Number of Days",
//     dataIndex: "number_of_days",
//     key: "id",
//   },
  {
    title: "",
    dataIndex: "",
    key: "activity",
    fixed: 'right',
    width: 20,
    slots: { customRender: "activity" },
  },
];
export default defineComponent({
  name: "HouseHold Validation",
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
      modalType: "primary",
      colorVisible: false,
      payroll: [],
    };
  },
  methods: {
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
    },
    searchData() {
      return this.$store.state.headerSearch.data;
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]); // invitedAct
    const invitedAct = ref([]);
    const enrolledAct = ref([]);
    const activeClass = ref("all");
    const searchItem = ref("");
    const logs = ref([]);

    const myCreatedActivities = `${process.env.VUE_APP_BASE_URL}/my_created_activities`;
    const myInvitedActivities = `${process.env.VUE_APP_BASE_URL}/my_assigned_activities`;
    const myEnrolledActivities = `${process.env.VUE_APP_BASE_URL}/my_enrolled_activities`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    // const tableData = ref([]);

    onMounted(() => {});

    axios
      .get(myCreatedActivities, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data.data);
        logs.value = response.data.data.map((item) => ({
          ...item,
          name: item.name,
        }));
        dataSource.value = logs.value;
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(myInvitedActivities, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data.data);
        logs.value = response.data.data.map((item) => ({
          ...item,
          name: item.name,
        }));
        invitedAct.value = logs.value;
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(myEnrolledActivities, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data.data);
        logs.value = response.data.data.map((item) => ({
          ...item,
          name: item.name,
        }));
        enrolledAct.value = logs.value;
      })
      .catch((error) => {
        console.error(error);
      });

    // watchEffect(async () => {
    //   const query = searchItem.value.toLowerCase();
    //   try {
    //     if (!query) {
    //       dataSource.value = logs.value;
    //       return dataSource.value;
    //     }
    //     if (query.length > 3) {
    //       const response = await fetch(`${API_URL}/search?query=${query}`, {
    //         method: "GET",
    //         headers: authHeader(),
    //       });
    //       const data = await response.json();
    //       dataSource.value = data;
    //     }
    //   } catch (error) {
    //     notification.error({
    //       message: "Error",
    //       description: error.message,
    //     });
    //   }
    // });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      handleChange,
      activeClass,
      invitedAct,
      enrolledAct,
      enrolled_columns,
    };
  },
  //   computed: {
  //     cardContent() {
  //       return this.dataSource;
  //     },
  //     invitedActContent() {
  //       return this.invitedAct;
  //     },
  //     enrolledActContent() {
  //       return this.enrolledAct;
  //     },
  //   },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>

<!-- <TableWrapper
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
                            <template>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions"></div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper> -->
