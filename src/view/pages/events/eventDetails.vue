<template>
  <div>
    <sdPageHeader ghost :title="`${event_name} Event`" />
    <Main>
      <div class="button-container">
        <sdButton
          v-if="isApprovedGenerator"
          class="btn-import"
          type="success"
          size="small"
          @click="generatePayroll"
          :disabled="isGenerating"
        >
          <!-- Generate Payroll -->
          {{
            isLoading
              ? "Loading..."
              : isGenerating
                ? "Processing ..."
                : "Generate Payroll"
          }}
        </sdButton>
        &nbsp;
        <!-- <sdButton
          class="btn-import"
          type="success"
          size="small"
          @click="generatePayroll"
          v-if="isApprovedGenerator"
          :disabled="isGenerating"
        >
          {{
            isLoading
              ? "Loading..."
              : isGenerating
                ? "Processing ..."
                : "Generate Draft Payroll"
          }}
        </sdButton> -->
        <span v-if="isApprovedGenerator">&nbsp;&nbsp;</span>
        <sdButton class="btn-import" type="success" size="small">
          <router-link to="/events/add-stakeholder">
            Add Stakeholder</router-link
          >
        </sdButton>
        <span v-if="isApprovedGenerator">&nbsp;&nbsp;</span>
        <sdButton
          class="btn-import"
          type="success"
          @click="exportParticipants"
          size="small"
        >
          Download List &nbsp; &nbsp;
          <sdFeatherIcons type="download-cloud" size="extra-small" />
        </sdButton>
      </div>

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
                      activeClass === 'confirmed' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('confirmed')"
                    href="#"
                  >
                    Confirmed Participants
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'pending' ? 'active' : 'deactivate'"
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
                          <p><b>Total Records: </b> {{ recordCount }}</p>

                          <a-table
                            :pagination="{
                              pageSize: 100,
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
                          <p><b>Total Records: </b> {{ confirmedCount }}</p>
                          <a-table
                            :pagination="{
                              pageSize: 100,
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
                          <p><b>Total Records: </b> {{ pendingCount }}</p>
                          <a-table
                            :pagination="{
                              pageSize: 100,
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

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./style";
import {
  computed,
  onMounted,
  ref,
  //reactive,
  //defineComponent
} from "vue";
import authHeader from "../../../services/auth-header";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../../vuex/store";
import { decrypt } from "@/cryptoHelper";

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
  {
    title: "Attendance Days",
    dataIndex: "no_of_days",
    key: "id",
  },
];

const recordCount = computed(() => dataSource.value.length);
const confirmedCount = computed(() => confirmed.value.length);
const pendingCount = computed(() => pending.value.length);

const { query } = useRoute();
const plainquery = decrypt(decodeURIComponent(query.encryptedData));
console.log(plainquery);
const event_name = plainquery.name;
// const event_id = query.id;
const event_code = plainquery.event_code;
console.log(event_code);
// const notData = ref(null);
// const current = ref(0);
// const pageSize = ref(0);
// const visible = ref(false);
// const confirmLoading = ref(false);
// const modalType = ref('primary');
// const colorVisible = ref(false);
// const households = ref([]);
// const eventName = ref('');

// const searchData = computed(() => {
//   return this.$store.state.headerSearch.data;
// });

// const handleSearch = (searchText) => {
//   const data = searchData.value.filter((item) =>
//     item.title.toUpperCase().startsWith(searchText.toUpperCase())
//   );
//   notData.value = data;
// };

// const onShowSizeChange = (current, pageSize) => {
//   current.value = current;
//   pageSize.value = pageSize;
// };

// const handleCancel = () => {
//   isModalOpen.value = false;
//   visible.value = false;
//   colorVisible.value = false;
// };

// // Watch for changes in searchData and update notData accordingly
// watch(searchData, () => {
//   handleSearch();
// });

const { state } = useStore();
// const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
// const selectedRowKeys = ref([]);
const dataSource = ref([]);
const confirmed = ref([]);
const pending = ref([]);
const activeClass = ref("all");
const isGenerating = computed(() => state.isGenerating);

//const isModalOpen = ref(false);

console.log(plainquery.event_code);

const API_URL = `events/${plainquery.event_code}/participants`;
const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${event_code}`;
const export_participants_url = `${process.env.VUE_APP_BASE_URL}/event_participants_export?event_code=${plainquery.event_code}`;

console.log(genetatePayrollURL);

const generatePayroll = async () => {
  store.commit("setIsGenerating", true);

  try {
    const response = await axios.get(genetatePayrollURL, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (response.status === 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      location.reload();
    } else {
      handleErrorResponse();
    }
  } catch (error) {
    console.error(error);
    handleErrorResponse();
  }
};

const handleErrorResponse = () => {
  store.commit("setIsGenerating", false);
  Modal.error({
    title: "Error",
    content:
      "Something went wrong, ensure you have assigned payroll matrix to the event",
  });
  setTimeout(() => location.reload(), 4000);
};
const exportParticipants = async () => {
  try {
    const response = await fetch(export_participants_url, {
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
    const fileName = "Event Participants.xlsx";
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

// const handleOk = async (id, inputValue) => {
//   try {
//     console.log(inputValue);
//   } finally {
//     console.log(inputValue);
//     inputValue = ""; // Clear inputValue after the modal is closed
//     isModalOpen.value = true;
//   }
// };

const handleChange = (tab) => {
  activeClass.value = tab;
};

onMounted(async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: authHeader(),
    });
    console.log(response.data.data);

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      // fullName = fullName.toUpperCase();
      return {
        ...record,
        fullName,
      };
    });

    dataSource.value = updatedData;

    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(API_URL + "?status=1", {
      headers: authHeader(),
    });
    console.log(API_URL + "?status=1");

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      // fullName = fullName.toUpperCase();
      return {
        ...record,
        fullName,
      };
    });

    confirmed.value = updatedData;

    console.log(confirmed.value.toRaw());
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(API_URL + "?status=0", {
      headers: authHeader(),
    });
    console.log(API_URL + "?status=0");
    console.log(response.data.data);

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      // fullName = fullName.toUpperCase();
      return {
        ...record,
        fullName,
      };
    });

    pending.value = updatedData;

    console.log(pending.value);
  } catch (error) {
    console.error(error);
  }
});

const filteredData = computed(() => {
  if (activeClass.value === "confirmed") {
    console.log(confirmed.value);
    return confirmed.value;
  } else if (activeClass.value === "pending") {
    console.log(dataSource.value);
    return pending.value;
  } else {
    return dataSource.value;
  }
});

const level_id = ref("");
const role_id = ref("");
// const current = ref("");
const rt = useRouter();

// const event_host_id = query.event_host_id;
const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user.user.id);

// const formState = reactive({
//   searchItem: "",
// });
onMounted(() => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    rt.push({ path: "/auth/login" });
  } else {
    level_id.value = user.user.level_id;
    role_id.value = user.user.role_id;
  }
});
const isApprovedGenerator = computed(() => {
  // const currentTime = new Date();
  if (
    user.user.role_id === 53 ||
    user.user.role_id === 63 ||
    user.user.role_id === 64 ||
    user.user.role_id === 59 ||
    user.user.role_id === 4
  ) {
    return true;
  } else {
    return false;
  }
});
console.log(user.user.org_types_id === 10);
// const isSCHMT =
computed(() => {
  if (user.user.org_types_id === 10) {
    return true;
  } else {
    return false;
  }
});
</script>

<style>
/* Default styles for buttons */
.button-container {
  text-align: center; /* Center align the buttons by default */
}

.button-container sdButton {
  margin: 5px; /* Add some margin between buttons */
}

/* Media query for screens larger than 768px (adjust breakpoint as needed) */
@media (min-width: 769px) {
  .button-container {
    text-align: left; /* Left align the buttons on larger screens */
    display: inline-block; /* Restore default inline-block behavior */
  }

  .button-container sdButton {
    margin: 5px; /* Adjust margin for desktop spacing */
  }
}
@media (max-width: 768px) {
  .button-container sdButton {
    margin: 5px 0; /* Adjust vertical margin for mobile spacing */
    padding: 5px; /* Add padding to create separation */
  }
}
</style>
