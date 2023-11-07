<template>
  <div>
    <sdPageHeader ghost title="HouseHold Summary Dashboard" />

    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="12">
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              >
                                Household Registered
                              </div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              ></div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'outliers'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              ></div>
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
          <a-col :xs="12">
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              >
                                Distribution Posts
                              </div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              >
                                Distribution Posts
                              </div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'outliers'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              ></div>
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
          <a-col :xs="12">
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              >
                                InActive Villages
                              </div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              ></div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'outliers'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              ></div>
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
          <a-col :xs="12">
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              >
                                Distribution Posts
                              </div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              ></div>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'outliers'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #title>
                              <div
                                style="
                                  text-align: center;
                                  font-weight: bold;
                                  font-size: 18px;
                                "
                              >
                                Distribution Posts
                              </div>
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
import { Main } from "../styled";
import { SearchResultWrapper } from "./users/style";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../src/services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";

// const households = ref([]);

const columns = [
  {
    title: "First name",
    dataIndex: "first_name",
    key: "id_no",
  },
  {
    title: "Last name",
    dataIndex: "last_name",
    key: "id_no",
  },
  {
    title: "Phone number",
    dataIndex: "phone_no",
    key: "id_no",
  },
  {
    title: "Household size",
    dataIndex: "hh_size",
    key: "id_no",
  },
  {
    title: "Village",
    dataIndex: "location_id",
    key: "id_no",
  },
  {
    title: "CHP",
    dataIndex: "chw_id",
    key: "id_no",
  },
  {
    title: "CHP Phone Number",
    dataIndex: "chw_phone_no",
    key: "id_no",
  },
  {
    title: "Timestamp",
    dataIndex: "created_at",
    key: "id_no",
  },
  {
    title: "",
    dataIndex: "",
    key: "households",
    slots: { customRender: "households" },
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
      households: [],
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
    handleCancel() {
      this.isModalOpen = false;
      this.visible = false;
      this.colorVisible = false;
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const isModalOpen = ref(false);
    const inputValue = ref("");
    const household_id = ref("");
    const searchItem = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/househo`;

    const households_url = `${process.env.VUE_APP_BASE_URL}/generateHHC`;

    const exportHouseHoldData = async () => {
      try {
        const response = await fetch(households_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch export data");
        }

        const fileBlob = await response.blob();
        const fileName = "households.csv";
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([fileBlob]));
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error(error);
      }
    };

    const filteredData = computed(() => {
      if (activeClass.value === "approved") {
        console.log(dataSource.value);
        return dataSource.value.filter((item) => item.isVerified === 1);
      } else if (activeClass.value === "outliers") {
        return dataSource.value.filter((item) => item.isVerified === 0);
      } else {
        return dataSource.value;
      }
    });

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
          // households.value = response.data.data;
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });
    const handleVerify = (hh_id, hh_size) => {
      console.log({ hh_id, hh_size });
      inputValue.value = hh_size;
      isModalOpen.value = true;
      household_id.value = hh_id;
    };

    const handleOk = async (id, inputValue) => {
      try {
        console.log(household_id.value);
        const house_id = household_id.value;
        console.log(inputValue);

        // Call the authHeader() function to get the authorization token
        const headers = authHeader();

        // Construct the URL
        const url = `${process.env.VUE_APP_BASE_URL}/verify_household?house_id=${house_id}&inputValue=${inputValue}`;

        // Make the fetch request
        fetch(url, {
          method: "PATCH",
          headers: {
            ...headers,
            "Content-Type": "application/json", // Add any necessary headers
          },
          // body: JSON.stringify(data), // If you need to send a request body, add it here
        })
          .then((response) => {
            if (response.ok) {
              return response.json(); // Parse the JSON response
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            console.log(data); // Handle the successful response data here
            notification["success"]({
              message: "HouseHold Verified",
              description: `HouseHold has been verified successfully`,
              duration: 5.5,
            });
            // location.reload();
          })
          .catch((error) => {
            // Handle errors here
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
            notification["error"]({
              message: "HouseHold Not Verified",
              description: `HouseHold verification failed`,
              duration: 5.5,
            });
          })
          .finally(() => {
            inputValue = ""; // Clear inputValue after the modal is closed
            isModalOpen.value = false;
          });
      } catch (error) {
        // Handle exceptions here
        console.error("Error:", error);
      }
    };

    const formState = reactive({
      searchItem: "",
    });

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return filteredData;
      } else {
        return filteredData.value.filter((household) => {
          return (
            regex.test(household.first_name) ||
            regex.test(household.last_name) ||
            regex.test(household.chw_id) ||
            regex.test(household.chw_phone_no) ||
            regex.test(household.location_id)
          );
        });
      }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      columns,
      formState,
      exportHouseHoldData,
      filteredData,
      handleChange,
      activeClass,
      handleVerify,
      isModalOpen,
      inputValue,
      household_id,
      handleOk,
      results,
      searchItem,
    };
  },
  props: {
    recordId: Number,
    hh_size: Number,
  },
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
</style>
