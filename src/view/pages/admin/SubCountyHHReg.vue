<template>
  <div>
    <sdPageHeader ghost title="Sub Counties Household Registrations">
      <template #buttons>
        <div class="search-box">
          <!-- <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by user, event or ip address..."
          /> -->
        </div></template
      >
    </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
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
                            <template #records="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="success"
                                    @click="createEvent(record)"
                                    v-if="record.event_id == null"
                                  >
                                    <span>Create Event</span>
                                  </sdButton>
                                  <span v-if="record.event_id == null">
                                    &nbsp;&nbsp;
                                  </span>
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    :disabled="isDisabled"
                                    @click="populateEvent(record)"
                                    v-if="record.event_id !== null"
                                  >
                                    {{
                                      isLoading
                                        ? "Loading..."
                                        : isDisabled
                                        ? "Processing ..."
                                        : "Populate Event"
                                    }}
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
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import store from "../../../vuex/store";

const columns = [
  {
    title: "County",
    dataIndex: "county_name",
    key: "id",
  },
  {
    title: "Sub County",
    dataIndex: "sub_county_name",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "records",
    slots: { customRender: "records" },
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
    const isDisabled = computed(() => state.isDisabled);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/household_registration_starts`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    // const tableData = ref([]);

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data;
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const createEvent = async (data) => {
      console.log(data.county_id);
      const event_api_url = `${process.env.VUE_APP_BASE_URL}/create_event_over_api`;

      const event_data = {
        county_id: data.county_id,
        subcounty_id: data.sub_county_id,
        venue: data.sub_county_name,
      };

      fetch(event_api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(event_data),
      })
        .then((response) => response.json())
        .then(({ success, data }) => {
          if (success) {
            // store.commit("setIsSubmitting", false);
            // router.push("event-create");
            notification["success"]({
              message: "Event Created",
              description: `Event Created successfully. Your event code is ${data.event.event_code}`,
              duration: 5.5,
            });
            new Promise((resolve) => {
            setTimeout(resolve, 3000);
          });
          }
          // show error message from the api response
          else {
            // store.commit("setIsSubmitting", false);
            notification["error"]({
              message: "Error!",
              description: "Fail to create event",
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          //   store.commit("setIsSubmitting", false);
          notification["error"]({
            message: "Error!",
            description: `${error}`,
            duration: 5.5,
          });
        });
    };

    // populateEvent

    const populateEvent = async (data) => {
      console.log(data);
      store.commit("setIsDisabled", true);

      axios
        .get(
          `${process.env.VUE_APP_BASE_URL}/generate_hh_reg_users/${data.sub_county_id}/${data.event_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            store.commit("setIsDisabled", false);
            notification["success"]({
              message: "Success",
              description: response.data.data,
              duration: 5.5,
            });
          } else {
            notification["error"]({
              message: "Error!",
              description: response.data.data,
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    console.log(dataSource.value);

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
      createEvent,
      populateEvent,
      isDisabled,
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
