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
      &nbsp;&nbsp;
      <sdButton
        class="btn-import"
        type="warning"
        @click="handleValidation()"
        size="extra-small"
        v-if="validate_status == 'Not Validated'"
      >
        Validate Payroll &nbsp; &nbsp;
      </sdButton>
      &nbsp;&nbsp;
      <sdButton
        class="btn-import"
        type="warning"
        @click="handleApproval()"
        size="extra-small"
        v-if="
          validate_status == 'Validated' && approved_status == 'Not Approved'
        "
      >
        Approve Payroll &nbsp; &nbsp;
      </sdButton>
      &nbsp;&nbsp;
      <sdButton size="extra-small" type="warning">
        <router-link
          :to="{
            path: `/gf/events/manage-allowance`,
          }"
        >
          Manage Allowances
        </router-link>
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
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    @click="addAllowance(record)"
                                    v-if="
                                      validate_status == 'Not Validated' ||
                                      approved_status == 'Not Approved'
                                    "
                                  >
                                    Add Allowance
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
                        width="35%"
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
                                  v-for="day in [1, 2, 3, 4, 5, 6]"
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

                      &nbsp;&nbsp;

                      <!-- Pay Modal -->
                      <a-modal
                        title="Payment OTP"
                        :visible="isPayModalOpen"
                        @cancel="handlePayCancel"
                        class="title-success"
                      >
                        <div>
                          <p>Enter payment OTP</p>
                          <input type="number" v-model="inputValue" />
                          <br />
                          <br />
                          <sdButton
                            type="success"
                            size="extra-small"
                            @click="resendOTP()"
                            :disabled="isDisabled"
                          >
                            Resend OTP
                            {{ countdown > 0 ? "(" + countdown + "s)" : "" }}
                          </sdButton>
                        </div>
                        <template v-slot:footer>
                          <a-button
                            @click="handleOk(recordId, inputValue)"
                            type="success"
                            :disabled="isPaying"
                            >{{
                              isLoading
                                ? "Loading..."
                                : isPaying
                                ? "Processing Payment..."
                                : "Pay"
                            }}</a-button
                          >
                          <a-button @click="handleCancel()" type="danger"
                            >Close</a-button
                          >
                        </template>
                      </a-modal>
                      <!-- End Pay Modal -->
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
import { useRouter } from "vue-router";
import store from "../../../vuex/store";

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
    const isLoading = ref(true);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const searchItem = ref("");
    const eventpayroll_list = ref([]);
    const additional_allowance = ref([]);
    const { query } = useRoute();
    const validate_status = query.validate_status;
    const approved_status = query.approval_status;
    const pay_status = query.payment_status;
    const payroll_status = query.validated_status;
    const event_name = query.name;
    const duration = query.duration;
    const venue = query.venue;
    const date = query.date;
    const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_list?event_payroll_id=${query.id}`;
    const dsa_api_url = `${process.env.VUE_APP_BASE_URL}/add_additional_dsa_matrix`;
    const transport_api_url = `${process.env.VUE_APP_BASE_URL}/add_additional_transport_matrix`;
    const export_pay_list_url = `${process.env.VUE_APP_BASE_URL}/event_pay_export?id=${query.id}`;
    const validate_payroll = `${process.env.VUE_APP_BASE_URL}/event_payroll_validation`;
    const approve_payroll = `${process.env.VUE_APP_BASE_URL}/event_payroll_approval`;
    const isModalOpen = ref(false);
    const isPayModalOpen = ref(false);
    const records = ref("");
    const router = useRouter();
    const isDisabled = ref(true);
    const countdown = ref(60);
    const recordId = ref(null);
    const payroll_list_id = ref();

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

    const handleApproval = () => {
      try {
        fetch(approve_payroll, {
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
                description: "Payroll Approved Successfully",
              });
              setTimeout(function () {
                // location.reload();
                router.go(-1);
              }, 3000);
            } else {
              notification.error({
                message: "Error",
                description: "Payroll Approved Failed",
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    const handlePay = () => {
      isPayModalOpen.value = true;
      countdownTimer();
      recordId.value = query.id;

      try {
        fetch(
          `${process.env.VUE_APP_BASE_URL}/payment_otp?payroll_summary_id=${query.id}&payment_type=Event`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.success === true) {
              notification.success({
                message: "Success!",
                description: data.message,
              });
              setTimeout(() => {}, 2000);
            } else {
              notification.error({
                message: "Error!",
                description: data.message,
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    const resendOTP = () => {
      try {
        fetch(
          `${process.env.VUE_APP_BASE_URL}/payment_otp?payroll_summary_id=${recordId.value}&payment_type=Event`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            countdownTimer();
            if (data.success === true) {
              notification.success({
                message: "Success!",
                description: data.message,
              });
              setTimeout(() => {}, 2000);
            } else {
              notification.error({
                message: "Error!",
                description: data.message,
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    const countdownTimer = () => {
      isDisabled.value = true;
      countdown.value = 60;
      startCountdown();
    };

    const startCountdown = () => {
      console.log("starting countdown");
      let timerId;
      countdown.value = 60;
      isDisabled.value = true;

      const updateCountdown = () => {
        countdown.value--;
        console.log(countdown.value);
        if (countdown.value <= 0) {
          clearInterval(timerId);
          isDisabled.value = false;
        }
      };

      timerId = setInterval(updateCountdown, 1000);

      updateCountdown();
    };

    const handleOk = async (id, inputValue) => {
      store.commit("setIsPaying", true);
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/pay_event_clients?event_payroll_summary_id=${recordId.value}&otp=${inputValue}`,
          {
            headers: authHeader(),
          }
        );
        if (response.status == 200) {
          store.commit("setIsPaying", true);
          notification.success({
            message: "Success",
            description: "Payment processed successful",
          });
          setTimeout(function () {
            location.reload();
          }, 3000);

          axios
            .post(`event_payroll_payment`, {
              payroll_id: recordId.value,
            })
            .then((responsePromise) => {
              return responsePromise.data;
            })
            .then((data) => {
              if (data.success == true) {
                notification.success({
                  message: "Success",
                  description:
                    "Payment Approved Successfully, Enter OTP to complete payment",
                });
              }
            });
        }
      } catch (error) {
        store.commit("setIsPaying", true);
        notification.error({
          message: "Error",
          description: "Payment failed",
        });
        // setTimeout(function () {
        //   location.reload();
        // }, 3000);
      }
      isModalOpen.value = false;
    };

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(() => {
      isLoading.value = true;
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          eventpayroll_list.value = response.data.data;
          dataSource.value = response.data.data;
          records.value = response.data.total_records;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          isLoading.value = false;
        });
    });

    const formState = reactive({
      allowance: "",
      no_of_days: "",
    });

    console.log(formState.no_of_days);

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

    const addAllowance = (payroll_detail) => {
      additionalAllowance();
      payroll_list_id.value = payroll_detail.id;
      isModalOpen.value = true;
      console.log(payroll_list_id.value);
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    const handlePayCancel = () => {
      isPayModalOpen.value = false;
    };

    const handleSubmit = async () => {
      const data = {
        payroll_id: query.id,
        formula: "",
        rate: null,
        payroll_list_id: payroll_list_id.value,
        payroll_matrix_id: formState.allowance,
      };

      for (let i = 0; i < additional_allowance.value.length; i++) {
        if (additional_allowance.value[i].id == formState.allowance) {
          data.formula = additional_allowance.value[i].formula_name;
          data.rate = additional_allowance.value[i].rate;

          if (data.formula == "Additional DSA") {
            data.no_of_days = formState.no_of_days;
            try {
              const response = await fetch(dsa_api_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
                body: JSON.stringify(data),
              });

              const result = await response.json();

              if (response.ok && result.success === true) {
                notification.success({
                  message: "Success",
                  description: result.data,
                });
                isModalOpen.value = false;
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else if (result.success == false) {
                notification.error({
                  message: "Error",
                  description: result.data,
                });
                isModalOpen.value = false;
              } else {
                notification.error({
                  message: "Error",
                  description: `${result.status}`,
                });
                isModalOpen.value = false;
              }
            } catch (error) {
              notification.error({
                message: "Error",
                description: `${error.message}`,
              });
            }
          } else {
            try {
              const response = await fetch(transport_api_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
                body: JSON.stringify(data),
              });

              const result = await response.json();

              if (response.ok && result.success === true) {
                notification.success({
                  message: "Success",
                  description: result.data,
                });
                isModalOpen.value = false;
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                notification.error({
                  message: "Error",
                  description: `${result.status}`,
                });
                isModalOpen.value = false;
              }
            } catch (error) {
              notification.error({
                message: "Error",
                description: `${error.message}`,
              });
            }
          }
        }
      }
    };

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
      addAllowance,
      isModalOpen,
      handleCancel,
      handleSubmit,
      additional_allowance,
      payroll_status,
      approved_status,
      records,
      handleApproval,
      pay_status,
      handlePay,
      resendOTP,
      handlePayCancel,
      isPayModalOpen,
      countdown,
      countdownTimer,
      isDisabled,
      handleOk,
    };
  },
});
</script>
