<template>
  <div>
    <sdPageHeader ghost :title="`${activity_name} Payroll`" />
    <Main>
      <p class="detail-info">
        <b>County:</b> {{ ` ${county}` }} || <b>Start Date:</b>
        {{ `${start_date}` }} || <b>Duration:</b> {{ `${no_of_days} days` }}
      </p>
      <p><b>Total Records: </b> {{ records }}</p>
      <sdButton
        class="btn-import"
        type="success"
        @click="exportPayrollList"
        size="extra-small"
      >
        Download List &nbsp; &nbsp;
        <sdFeatherIcons type="download-cloud" size="extra-small" />
      </sdButton>
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
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton type="success" size="extra-small"
                                    ><router-link
                                      :to="{
                                        path: `/activity/breakdown/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.user_id,
                                          jg: record.job_group,
                                          location: record.location_id,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp;
                                      <span class=""
                                        >&nbsp;&nbsp; Breakdown</span
                                      >
                                    </router-link></sdButton
                                  >
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    @click="addAllowance(record)"
                                  >
                                    Add Allowance
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
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
                          v-show="activeClass === 'outliers'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="check"
                                    size="16"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <span class="badge badge-green"
                                      >&nbsp;&nbsp; Verify</span
                                    >
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'paid'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="check"
                                    size="16"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <span class="badge badge-green"
                                      >&nbsp;&nbsp; Verify</span
                                    >
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                      <!-- Add Allowance Modal -->
                      <a-modal
                        title="Add Allowance"
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
                            <a-form-item
                              name="allowance"
                              label="Select Allowance"
                            >
                              <a-select
                                v-model:value="formState.allowance"
                                show-search
                                option-filter-prop="label"
                                placeholder="Select an additional allowance"
                              >
                                <a-select-option
                                  v-for="allowance in additional_allowance"
                                  :key="allowance.id"
                                  :value="allowance.id"
                                  :label="`${allowance.formula_name}`"
                                >
                                  {{ allowance.formula_name }}
                                </a-select-option>
                              </a-select>
                            </a-form-item>

                            <a-form-item
                              v-if="formState.allowance === 90"
                              name="no_of_days"
                              label="No of Days"
                            >
                              <a-select
                                v-model:value="formState.no_of_days"
                                show-search
                                option-filter-prop="label"
                                placeholder="Select number of days"
                                :maxTagCount="5"
                                :maxTagPlaceholder="'...and more'"
                              >
                                <a-select-option
                                  v-for="day in [1, 2, 3, 4, 5]"
                                  :key="day"
                                  :value="day"
                                >
                                  {{ day }} day{{ day > 1 ? "s" : "" }}
                                </a-select-option>
                              </a-select>
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
                      <!-- End of Add Allowance Modal -->
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
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
// import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Name",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "organization",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "id",
  },
  {
    title: "Job Group",
    dataIndex: "job_group",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "id",
  },
  {
    title: "Days Confirmed",
    dataIndex: "no_of_days",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
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
    const records = ref("");
    const { query } = useRoute();
    const activity_name = query.activity;
    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_payroll_list?payroll_id=${query.id}`;
    const county = query.county;
    // const sub_county = query.sub_county ? query.sub_county : "N/A";
    const start_date = query.start_date;
    const no_of_days = query.no_of_days;
    const export_pay_list_url = `${process.env.VUE_APP_BASE_URL}/activity_pay_export?id=${query.id}`;
    const additional_allowance = ref([]);
    const isModalOpen = ref(false);
    const payroll_list_id = ref();

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

    const exportPayrollList = async () => {
      try {
        const response = await fetch(export_pay_list_url, {
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
        const fileName = "Payroll Participants.xlsx";
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
          records.value = dataSource.value.length;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    //send a request to the data to pay for activity from the pay buttons
    const handleVerify = () => {
      axios
        .get(
          `${process.env.VUE_APP_BASE_URL}/pay_activity_clients?activity_payroll_summary_id=${query.id}`,
          {
            headers: authHeader(),
          }
        )
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            notification["success"]({
              message: "Transaction Processing",
              description: `Transaction is being processed. Please wait for completion before checking the transaction details page`,
              duration: 11,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const formState = reactive({
      searchItem: "",
    });

    const additionalAllowance = () => {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/additional_payroll_matrix`, {
          headers: authHeader(),
        })
        .then((response) => {
          additional_allowance.value = response.data.data.map((allowance) => ({
            ...allowance,
            label: `${allowance.formula_name} `,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    };

    additionalAllowance();

    const addAllowance = (payroll_detail) => {
      console.log(payroll_detail);
      payroll_list_id.value = payroll_detail.id;
      isModalOpen.value = true;
      console.log(payroll_list_id.value);
    };

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
      handleVerify,
      exportPayrollList,
      activity_name,
      county,
      // sub_county,
      start_date,
      no_of_days,
      records,
      addAllowance,
      isModalOpen,
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

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
.detail-info {
  font-family: Arial, sans-serif;
  line-height: 1.5;
}
.detail-info .label {
  font-weight: bold;
}
.detail-info .value {
  margin-left: 5px;
}
.detail-info .section {
  margin-bottom: 10px;
}
.sub-counties-list {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
