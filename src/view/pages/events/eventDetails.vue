<template>
  <div>
    <sdPageHeader ghost :title="`${event_name} Event`" />
    <Main>
      <sdButton class="btn-import" type="success" @click="generatePayroll">
        Generate Payroll
      </sdButton>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
              <ul>
                <li>
                  <a
                    :class="activeClass === 'all' ? 'active' : 'deactivate'"
                    @click="handleChange('all')"
                    href="#"
                  >
                    All Participants
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'approved' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('confirmed')"
                    href="#"
                  >
                    Confirmed Participants
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'outliers' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('pending')"
                    href="#"
                  >
                    Pending Participants
                  </a>
                </li>
              </ul>
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
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'confirmed'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'pending'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
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
import { SearchResultWrapper } from "./style";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import {  Modal } from "ant-design-vue";
import { useRoute } from "vue-router";

// const households = ref([]);

const columns = [
  {
    title: "Participant Name",
    dataIndex: "fullName",
    key: "id",
    // render: (text, record) => `${record.first_name} ${record.last_name}`,
  },
  {
    title: "Participant Phone",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "org_types_id",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "id",
  },
];
export default defineComponent({
  name: "Events Participants",
  components: {
    Main,
    SearchResultWrapper,
  },
  data() {
    const { query } = useRoute();

    const event_name = query.name;
    // const event_id = query.id;
    const event_code = query.event_code;
    console.log(event_code);
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      households: [],
      event_name,
    };
  },
  methods: {
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    // handleChange(value) {
    //   this.activeClass = value;
    // },
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
    const { query } = useRoute();

    console.log(query.event_code);

    const API_URL = `${process.env.VUE_APP_BASE_URL}`;
    const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${query.event_code}`;

    console.log(genetatePayrollURL);



    const generatePayroll = async () => {
      try {
        const response = await fetch(genetatePayrollURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        console.log(response.status == 200);
        if (response.status == 200) {
          Modal.success({
            title: "Success",
            content: "Payroll Generated Successfully",
          });
        } else {
          Modal.error({
            title: "Error",
            content:
              "Something went wrong, ensure you have assigned payroll matrix to the event",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const filteredData = computed(() => {
      if (activeClass.value === "confirmed") {
        console.log(dataSource.value);
        return dataSource.value.filter((item) => item.isVerified === 1);
      } else if (activeClass.value === "pending") {
        return dataSource.value.filter((item) => item.isVerified === 0);
      } else {
        return dataSource.value;
      }
    });

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(async () => {
      try {
        const response = await axios.get(
          `${API_URL}/events/${query.event_code}/participants`,
          {
            headers: authHeader(),
          }
        );
        console.log(response.data.data);

        const updatedData = response.data.data.map((record) => {
          let fullName = `${record.first_name} ${record.last_name}`;
          // fullName = fullName.toUpperCase();
          return {
            ...record,
            fullName,
          };
        });

        dataSource.value = response.data.data;
        console.log(updatedData);
        dataSource.value = updatedData;

        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });

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
      filteredData,
      handleChange,
      activeClass,
      generatePayroll,
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
</style>
