<template>
  <div>
    <sdPageHeader ghost title="Activity Dashboard">
      <template #buttons> ></template>
    </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <div style="background-color: #ececec; padding: 20px">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-card
                title="Created Activities"
                :bordered="true"
                @click="selectCard('created')"
              >
                <sdButton size="extra-small" type="success">View</sdButton>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card
                title="Invited Activities"
                :bordered="true"
                @click="selectCard('invited')"
              >
                <sdButton size="extra-small" type="success">View</sdButton>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card
                title="Enrolled Activities"
                :bordered="true"
                @click="selectCard('enrolled')"
              >
                <sdButton size="extra-small" type="success">View</sdButton>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- Render table based on the selected card -->
        <div>
          <a-col class="w-100" :md="24">
            <!-- Render table for Created Activities -->
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>

              <div v-else>
                <TableWrapper
                  class="table-data-view table-responsive"
                  v-show="activeClass === 'created'"
                >
                  <a-table
                    :pagination="{
                      pageSize: 10,
                      showSizeChanger: true,
                    }"
                    :dataSource="created_act"
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
        </div>

        <div>
          <!-- Render table for Invited Activities -->
          <!-- Adjust the Table component accordingly -->
          <a-col class="w-100" :md="24">
            <!-- Render table for Invited Activities -->
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>

              <div v-else>
                <TableWrapper
                  class="table-data-view table-responsive"
                  v-show="activeClass === 'invited'"
                >
                  <a-table
                    :pagination="{
                      pageSize: 10,
                      showSizeChanger: true,
                    }"
                    :dataSource="invited_act"
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
        </div>

        <div>
          <!-- Render table for Enrolled Activities -->
          <!-- Adjust the Table component accordingly -->

          <a-col class="w-100" :md="24">
            <!-- Render table for Created Activities -->
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>

              <div v-else>
                <TableWrapper
                  class="table-data-view table-responsive"
                  v-show="activeClass === 'enrolled'"
                >
                  <a-table
                    :pagination="{
                      pageSize: 10,
                      showSizeChanger: true,
                    }"
                    :dataSource="enrolled_act"
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
        </div>
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
    title: "Number of Officers",
    dataIndex: "number_of_officers",
    key: "id",
  },
  {
    title: "Number of Days",
    dataIndex: "number_of_days",
    key: "id",
  },
  {
    title: "County",
    dataIndex: "county_id",
    key: "id",
  },
  {
    title: "Sub County",
    dataIndex: "sub_county_id",
    key: "id",
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
    const dataSource = ref([]);
    const activeClass = ref("all");
    const searchItem = ref("");
    const created_act = ref([]);
    const invited_act = ref([]);
    const enrolled_act = ref([]);

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    // const tableData = ref([]);

    onMounted(() => {});

    const selectCard = async (cardType) => {
      console.log(cardType);
      try {
        let apiUrl = "";

        if (cardType === "created") {
          apiUrl = `${process.env.VUE_APP_BASE_URL}/my_created_activities`;
          console.log(apiUrl);
          const response = await axios.get(apiUrl, {
            headers: authHeader(),
          });
          console.log(response.data.data);
          created_act.value = response.data.data;
        } else if (cardType === "invited") {
          apiUrl = `${process.env.VUE_APP_BASE_URL}/my_assigned_activities`;
          // Handle the API request and update the corresponding ref here
          console.log(apiUrl);
          const response = await axios.get(apiUrl, {
            headers: authHeader(),
          });
          console.log(response.data.data);
          invited_act.value = response.data.data;
        } else if (cardType === "enrolled") {
          apiUrl = `${process.env.VUE_APP_BASE_URL}/my_enrolled_activities`;
          // Handle the API request and update the corresponding ref here
          console.log(apiUrl);
          const response = await axios.get(apiUrl, {
            headers: authHeader(),
          });
          console.log(response.data.data);
          enrolled_act.value = response.data.data;
        }

        // The API requests for "invited" and "enrolled" are missing from the original code
        // Make the API requests for these card types and update the corresponding refs
      } catch (error) {
        console.error(error);
      }
    };

    console.log(activeClass);

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      handleChange,
      activeClass,
      // handleVerify,
      selectCard,
      created_act,
      invited_act,
      enrolled_act,
    };
  },
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
