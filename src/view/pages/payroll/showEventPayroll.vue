<template>
  <div>
    <sdPageHeader :title="`${event_name} Event`">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name, phone no, village or CHP"
          /></div
      ></template>
    </sdPageHeader>
    <Main>
      <p class="detail-info">
        <b>Location:</b> {{ ` ${venue}` }} || <b>Start Date:</b>
        {{ `${date}` }} || <b>Duration:</b> {{ `${duration} days` }}
      </p>
      <p><b>Total Records: </b> {{ recordCount }}</p>

      <sdButton
        class="btn-import"
        type="success"
        @click="exportPayrollList"
        size="extra-small"
      >
        Download List &nbsp; &nbsp;
        <sdFeatherIcons type="download-cloud" size="extra-small" />
      </sdButton>
      &nbsp;&nbsp;
      <sdButton
        class="btn-import"
        type="warning"
        @click="handleValidation()"
        size="extra-small"
        v-if= "validate_status == 'Not Validated'"
      >
        Validate Payroll &nbsp; &nbsp;
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
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton size="extra-small" type="success">
                                    <router-link
                                      :to="{
                                        path: `/event/breakdown/${record.id}`,
                                        query: {
                                          id: record.id,
                                          jg: record.job_group,
                                          name: user_id,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp; Breakdown
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
import {
  computed,
  onMounted,
  ref,
  reactive,
  defineComponent,
  watchEffect,
} from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
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
    title: "Attendance Days",
    dataIndex: "no_of_days",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
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
  name: "Event Payroll",
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
    const eventpayroll_list = ref([]);

    const { query } = useRoute();

    const validate_status = query.validate_status;

    console.log(validate_status == 'Not Validated');

    const event_name = query.name;
    const duration = query.duration;
    const venue = query.venue;
    const date = query.date;
    const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_list?event_payroll_id=${query.id}`;
    const export_pay_list_url = `${process.env.VUE_APP_BASE_URL}/event_pay_export?id=${query.id}`;
    const validate_payroll = `${process.env.VUE_APP_BASE_URL}/event_payroll_validation`

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

    const handleValidation = () => {
      try {
        fetch(validate_payroll, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify({
            payroll_id: Number(query.id),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.success === true) {
              notification.success({
                message: "Success",
                description: "Payroll Validated Successfully",
              });
              setTimeout(function () {
                location.reload();
              }, 3000);
            } else {
              notification.error({
                message: "Error",
                description: "Payroll Validation Failed",
              });
            }
          });
      } catch (error) {
        console.log(error);
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
          eventpayroll_list.value = response.data.data;
          dataSource.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const formState = reactive({
      searchItem: "",
    });

    // const results = computed(() => {
    //   const query = searchItem.value.toLowerCase();
    //   const regex = new RegExp(query, "i");
    //   if (!query) {
    //     return dataSource.value;
    //   } else {
    //     return dataSource.value.filter((event) => {
    //       return (
    //         regex.test(event.user_id) ||
    //         regex.test(event.location_id) ||
    //         regex.test(event.organization) ||
    //         regex.test(event.role)

    //       );
    //     });
    //   }
    // });
    watchEffect(async () => {
      const querysearch = encodeURIComponent(searchItem.value.toLowerCase());
      try {
        if (!querysearch) {
          dataSource.value = eventpayroll_list.value;
          return dataSource.value;
        }
        //  return dataSource.value;
        if (querysearch.length > 3) {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/event_pay_roll_list?event_payroll_id=${query.id}&query=${querysearch}`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
          console.log(data);
          dataSource.value = data.data;
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
      columns,
      formState,
      handleChange,
      activeClass,
      event_name,
      duration,
      venue,
      date,
      searchItem,
      exportPayrollList,
      handleValidation,
      validate_status,
    };
  },
});
</script>
