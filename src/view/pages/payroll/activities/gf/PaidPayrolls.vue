<template>
  <div>
    <sdPageHeader ghost title="GF Paid Activities Payrolls">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by payroll details..."
          /></div
      ></template>
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
                            :pagination="false"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton size="small" type="success">
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          activity: record.activity_id,
                                          county: record.county,
                                          sub_county: record.sub_county,
                                          no_of_days: record.no_of_days,
                                          start_date: record.start_date,
                                          status: record.status,
                                          approval_status:
                                            record.approval_status,
                                          payment_status: record.payment_status,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp;
                                      <span>&nbsp;&nbsp; Payroll Details</span>
                                    </router-link>
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                          <br />
                          <br />
                          <a-pagination
                            :current="currentPage"
                            :total="datatotal"
                            :pageSize="pageSize"
                            :showSizeChanger="true"
                            :pagination="true"
                            @change="onPageChange($activity)"
                          />
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
import { Main } from "../../../../styled";
import { SearchResultWrapper } from "../../../style";
import { computed, onMounted, ref, defineComponent, watchEffect } from "vue";
import authHeader from "../../../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Name",
    dataIndex: "activity_id",
    key: "id",
  },
  {
    title: "Validator",
    dataIndex: "validated_by",
    key: "id",
  },
  {
    title: "Validated Time",
    dataIndex: "validation_date",
    key: "id",
  },
  {
    title: "Approver",
    dataIndex: "approved_by",
    key: "id",
  },
  {
    title: "Approval Time",
    dataIndex: "approval_time",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "payment_status",
    key: "id",
  },
  {
    title: "Payment Time",
    dataIndex: "payment_date",
    key: "id",
  },
  {
    title: "Payroll Amount",
    dataIndex: "total_amount",
    key: "id",
  },
  {
    title: "Total Paid",
    dataIndex: "amount_transacted",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
    key: "payroll",
    slots: { customRender: "payroll" },
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
    searchData() {
      return this.$store.state.headerSearch.data;
    },
  },
  setup() {
    var currentPage = ref(1);
    var pageSize = ref(100);
    var datatotal = ref(0);
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const searchItem = ref("");
    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(() => {
      fetchPayrolls();
    });

    const fetchPayrolls = () => {
      const API_URL = `${process.env.VUE_APP_BASE_URL}/all_activity_payrolls?funding_id=1&is_paid=1&page=${currentPage.value}&per_page=${pageSize.value}`;
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          datatotal.value = response.data.pagination.total;
          dataSource.value = response.data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
          dataSource.value.forEach((item) => {
            item.status = item.status === 1 ? "Validated" : "Not Validated";
            item.payment_status =
              item.payment_status === 1 ? "Paid" : "Not Paid";
            item.approval_status =
              item.approval_status === 1 ? "Approved" : "Not Approved";
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const onPageChange = async (page) => {
      console.log(page);
      currentPage.value = page;
      try {
        fetchPayrolls();
      } catch (error) {
        console.error(error);
      }
    };

    watchEffect(async () => {
      const API_URL = `${process.env.VUE_APP_BASE_URL}/all_activity_payrolls?funding_id=1&is_paid=1&page=${currentPage.value}&per_page=${pageSize.value}`;
      const query = searchItem.value.toLowerCase();
      try {
        if (!query) {
          return dataSource.value;
        }
        if (query.length > 3) {
          const response = await fetch(`${API_URL}&query=${query}`, {
            method: "GET",
            headers: authHeader(),
          });
          const data = await response.json();
          dataSource.value = data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      handleChange,
      activeClass,
      onPageChange,
      currentPage,
      pageSize,
      datatotal,
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
