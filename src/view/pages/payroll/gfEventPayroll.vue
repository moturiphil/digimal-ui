<template>
  <Main>
    <SearchResultWrapper>
      <sdPageHeader ghost title="Global Fund Event Payroll">
        <template #buttons>
          <!-- <div class="search-box">
            <a-input
              style="
                border: 1px solid #151414;
                padding: 8px;
                border-radius: 5px;
                align-items: center;
                justify-items: center;
              "
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search by name"
            />
          </div> -->
        </template>
      </sdPageHeader>
    </SearchResultWrapper>
    <div style="background-color: #ececec; padding: 20px">
      <a-row :gutter="16">
        <a-col :span="6">
          <a href="/gf/events/all-payrolls">
            <a-card
              title="All Payroll"
              style="width: 300px"
              class="card-button"
            >
              <p>All Digimal payroll</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="/payroll-validation">
            <a-card
              title="Payrolls pending Validation"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll pending validations</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="/payroll-approval">
            <a-card
              title="Payrolls pending Approval"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll pending approval</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="/payroll-payments">
            <a-card
              title="Payrolls pending Payments"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll payments validations</p>
            </a-card>
          </a>
        </a-col>
      </a-row>
      <br />
      <br />
      <a-row :gutter="16">
        <a-col :span="6">
          <a href="/payrolls-paid">
            <a-card
              title="Payrolls Paid"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll paid</p>
            </a-card>
          </a>
        </a-col>
      </a-row>
    </div>
  </Main>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { onMounted, ref, watchEffect } from "vue";
import axios from "@/Axiosconfig";
// import { useStore } from "vuex";
import { notification } from "ant-design-vue";
// import store from "../../../vuex/store";
// import { DeleteRowOutlined } from "@ant-design/icons-vue";

// const openVoidModal = ref(false);
// const voidPayroll = ref(null);

// const showVoidModal = (record) => {
//   voidPayroll.value = record;
//   openVoidModal.value = true;
// };
// const handleVoidCancel = () => {
//   openVoidModal.value = false;
// };
// const actionVoidPayroll = async () => {
//   await axios
//     .post(`void_events_payroll_summaries/${voidPayroll.value.id}`)
//     .then((response) => {
//       openVoidModal.value = false;
//       console.log(response);
//       if (response.data.success == true) {
//         notification.success({
//           message: "Success",
//           description: response.data.message,
//         });
//       } else if (response.data.success == false) {
//         notification.warning({
//           message: "Info",
//           description: response.data.message,
//         });
//       }
//     })
//     .catch((e) => {
//       notification.error({
//         message: "Error!",
//         description: e.toString(),
//       });
//       console.log(e);
//     });
// };

// const columns = [
//   {
//     title: "Name",
//     dataIndex: "event_id",
//     key: "id",
//   },
//   // {
//   //   title: "Event",
//   //   dataIndex: "event_id",
//   //   key: "id",
//   // },
//   {
//     title: "Validated",
//     dataIndex: "status",
//     key: "id",
//   },
//   {
//     title: "Validator",
//     dataIndex: "validated_by",
//     key: "id",
//   },
//   {
//     title: "Approved",
//     dataIndex: "approval_status",
//     key: "id",
//   },
//   {
//     title: "Approver",
//     dataIndex: "approved_by",
//     key: "id",
//   },
//   {
//     title: "Status",
//     dataIndex: "payment_status",
//     key: "id",
//   },
//   {
//     title: "Amount",
//     dataIndex: "total_amount",
//     key: "id",
//   },
//   {
//     title: "",
//     dataIndex: "",
//     fixed: "right",
//     width: 20,
//     key: "payroll",
//     slots: { customRender: "payroll" },
//   },
// ];

// const { state } = useStore();
// const isLoading = computed(() => state.crud.loading);
const dataSource = ref([]);
// const payload = ref([]);
// const activeClass = ref("all");
// const recordId = ref(null);
// const isPaying = computed(() => state.isPaying);
const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_summary`;
// const isModalOpen = ref(false);
// const inputValue = ref("");
// const role_id = ref("");
const searchItem = ref("");
const eventspayroll = ref([]);
// const user = JSON.parse(sessionStorage.getItem("user"));

watchEffect(async () => {
  const query = searchItem.value.toLowerCase();
  try {
    if (!query) {
      dataSource.value = eventspayroll.value;
      return dataSource.value;
    }
    // return dataSource.value;
    if (query.length > 3) {
      const response = await axios.get(`event_pay_roll_summary?query=${query}`);

      const data = await response.data;
      const events = [];
      data.data.forEach((item) => {
        if (item.funding_source === 1) {
          events.push(item);
        }
      });
      dataSource.value = events;
      console.log(dataSource.value);
      dataSource.value.forEach((item) => {
        item.status = item.status === 1 ? "Validated" : "Not Validated";
        item.payment_status = item.payment_status === 1 ? "Paid" : "Not Paid";
        item.approval_status =
          item.approval_status === 1 ? "Approved" : "Not Approved";
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  }
});

// const filter = (data) => {
//   switch (activeClass.value) {
//     case "all":
//       return data;

//     case "not_validated":
//       return data.filter((item) => item.status === "Not Validated");

//     case "not_approved":
//       return data.filter(
//         (item) => item.status === "Validated" && item.approval_status === 0
//       );

//     case "pending_approval":
//       return data.filter(
//         (item) => item.approval_status === "Not Approved" && item.status === "Validated"
//       );

//     case "pending_payment":
//       return data.filter(
//         (item) =>
//           item.approval_status === "Approved" && item.payment_status === "Not Paid"
//       );

//     case "paid":
//       return data.filter(
//         (item) =>
//           item.payment_status === "Paid" &&
//           item.approval_status === "Approved" &&
//           item.status === "Validated"
//       );

//     default:
//       return data;
//   }
// };

// const filteredData = computed(() => {
//   return filter(dataSource.value);
// });

// const handleChange = (tab) => {
//   activeClass.value = tab;
// };

// // handle payment
// const handlePay = (id) => {
//   isModalOpen.value = true;
//   recordId.value = id;
//   try {
//     axios
//       .post(`payment_otp`, {
//         payroll_summary_id: id,
//         payment_type: "Event",
//       })
//       .then((responsePromise) => {
//         return responsePromise.data;
//       })
//       .then((data) => {
//         if (data.success == true) {
//           notification.success({
//             message: "Success",
//             description: "OTP Sent Successfully",
//           });
//         }
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const handleValidation = (id) => {
//   try {
//     axios
//       .post(`event_payroll_validation`, {
//         payroll_id: id,
//       })
//       .then((responsePromise) => {
//         return responsePromise.data;
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success == true) {
//           notification.success({
//             message: "Success",
//             description: "Payroll Validated Successfully",
//           });
//           // setTimeout(function () {
//           //   location.reload();
//           // }, 3000);
//         } else {
//           notification.error({
//             message: "Error",
//             description: "Payroll Validation Failed",
//           });
//         }
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const handleApproval = (id) => {
//   try {
//     axios
//       .post(`event_payroll_approval`, {
//         payroll_id: id,
//       })
//       .then((responsePromise) => {
//         return responsePromise.data;
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success == true) {
//           notification.success({
//             message: "Success",
//             description: "Payroll Approved Successfully",
//           });
//           setTimeout(function () {
//             location.reload();
//           }, 3000);
//         } else {
//           notification.error({
//             message: "Error",
//             description: "Payroll Approval Failed",
//           });
//         }
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const handleOk = async (id, inputValue) => {
//   store.commit("setIsPaying", true);
//   try {
//     const response = await axios.get(
//       `pay_event_clients?event_payroll_summary_id=${recordId.value}&otp=${inputValue}`
//     );
//     if (response.status == 200) {
//       store.commit("setIsPaying", true);
//       notification.success({
//         message: "Success",
//         description: "Payment processed successful",
//       });
//       setTimeout(function () {
//         location.reload();
//       }, 3000);

//       axios
//         .post(`event_payroll_payment`, {
//           payroll_id: recordId.value,
//         })
//         .then((responsePromise) => {
//           return responsePromise.data;
//         })
//         .then((data) => {
//           if (data.success == true) {
//             notification.success({
//               message: "Success",
//               description: "Payment Approved Successfully, Enter OTP to complete payment",
//             });
//           }
//         });
//     }
//   } catch (error) {
//     store.commit("setIsPaying", true);
//     notification.error({
//       message: "Error",
//       description: "Payment failed",
//     });
//     setTimeout(function () {
//       location.reload();
//     }, 3000);
//   }
//   isModalOpen.value = false;
// };

// const handleCancel = () => {
//   isModalOpen.value = false;
// };

onMounted(() => {
  axios
    .get(API_URL)
    .then((response) => {
      let payload = response.data.data;

      const filteredItems = [];
      payload.forEach((item) => {
        if (item.funding_source === 1) {
          filteredItems.push(item);
        }
      });
      eventspayroll.value = filteredItems;
      eventspayroll.value.forEach((item) => {
        item.status = item.status === 1 ? "Validated" : "Not Validated";
        item.payment_status = item.payment_status === 1 ? "Paid" : "Not Paid";
        item.approval_status =
          item.approval_status === 1 ? "Approved" : "Not Approved";
      });
      dataSource.value = eventspayroll.value;
    })
    .catch((error) => {
      console.error(error);
    });
});
// const handleVerify = (record) => {
//   console.log(record);
// };
// role_id.value = user.user.role_id;

// const isValidator = computed(() => {
//   return role_id.value === 63 || role_id.value === 53 || role_id.value === 4;
// });

// const isApprover = computed(() => {
//   return role_id.value === 64 || role_id.value === 53 || role_id.value === 59;
// });

// const isAdminAccountant = computed(() => {
//   return role_id.value === 65 || role_id.value === 53 || role_id.value === 1;
// });

// const isAdmin = computed(() => {
//   return role_id.value === 53;
// });
</script>
<style scoped>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
    border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.title-success {
  color: green;
}
</style>
<style scoped>
.icon-color-white {
  color: white;
}
.card-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s; /* Added background-color transition */
}

.card-button:hover {
  transform: scale(1.1);
  background-color: #1EC997; /* Green background color */
}
</style>
