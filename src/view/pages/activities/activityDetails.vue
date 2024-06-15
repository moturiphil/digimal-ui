<template>
  <div>
    <sdPageHeader
      ghost
      :title="`${event_name} Activity - ${activity_code} on ${formattedStartDate}`"
    />
    <Main>
      <div class="button-container">
        <sdButton
          class="btn-import"
          type="success"
          size="extra-small"
          @click="generatePayroll"
          v-if="isApprovedGenerator"
          :disabled="isGenerating"
        >
          {{
            isLoading
              ? "Loading..."
              : isGenerating
              ? "Processing ..."
              : "Generate Payroll"
          }}
        </sdButton>
        <span v-if="isApprovedGenerator">&nbsp;&nbsp;</span>
        <sdButton
          class="btn-import"
          type="success"
          @click="exportParticipants"
          size="extra-small"
        >
          Download List &nbsp; &nbsp;
          <sdFeatherIcons type="download-cloud" size="extra-small" />
        </sdButton>
        &nbsp;&nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="sendInvites"
          size="extra-small"
        >
          Send Invites &nbsp; &nbsp;
          <sdFeatherIcons type="mail" size="extra-small" />
        </sdButton>
        &nbsp; &nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="openArchiveModal()"
          size="extra-small"
        >
          Archive Event &nbsp; &nbsp;
        </sdButton>
        &nbsp; &nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="openMatrixModal()"
          size="extra-small"
        >
          Activity Matrix &nbsp; &nbsp;
          <sdFeatherIcons type="award" size="extra-small" />
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
                    Invited Officers
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
                    Confirmed Officers
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'pending' ? 'active' : 'deactivate'"
                    @click="handleChange('pending')"
                    href="#"
                  >
                    Pending Confirmation
                  </a>
                </li>
                <li v-if="isCreator">
                  <a
                    class="button-container"
                    size="extra-small"
                    type="success"
                    @click="openModal()"
                  >
                    Add Officer
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
                            <template #activity="{ record }">
                              <td>
                                <div class="table-actions" v-if="isCreator">
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    @click="removeOfficer(record.user_id)"
                                    v-show="record.status === 'Active'"
                                  >
                                    <span> Remove Officer </span>
                                  </sdButton>
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    @click="activateOfficer(record.user_id)"
                                    v-show="record.status === 'Inactive'"
                                  >
                                    <span> Activate Officer </span>
                                  </sdButton>
                                </div>
                              </td>
                            </template>
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
                            <template #activity="{ record }">
                              <td>
                                <!-- Buttons for viewing confirmed and pending participants -->
                                <div class="table-actions">
                                  <!-- Button for viewing confirmed participants -->
                                  <sdButton
                                    class="btn-import"
                                    type="warning"
                                    size="small"
                                    @click="resendSMS(record.id)"
                                  >
                                    <!-- {{
                                      isLoading
                                        ? "Loading..."
                                        : isGenerating
                                          ? "Processing ..."
                                          : "Generate Payroll"
                                    }} -->
                                    Resend SMS
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
              <!-- add officers -->
              <a-modal
                title="Add Officers"
                :visible="isModalOpen"
                @cancel="handleCancel"
                width="50%"
                footer=""
              >
                <BasicFormWrapper>
                  <a-form
                    class="add-transfer-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleAddOfficers"
                  >
                    <a-form-item
                      name="add_officer"
                      label="Add Officer to Activity"
                    >
                      <a-select
                        placeholder="Add Officer(s)"
                        v-model:value="formState.add_officer"
                        v-if="!loading"
                        show-search
                        option-filter-prop="label"
                        mode="multiple"
                        @search="handleOfficerSearch"
                      >
                        <a-select-option
                          v-for="officer in officers"
                          :key="officer.id"
                          v-model:value="officer.id"
                          :label="`${officer.first_name} ${officer.last_name} -${officer.role_id} `"
                        >
                          {{ officer.first_name }}
                          {{ officer.last_name }} - {{ officer.id_no }},
                          {{ officer.role_id }}, {{ officer.location_id }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
                </BasicFormWrapper>
              </a-modal>
              <!-- End of Assigning officer modal -->

              <!-- Archive Event Modal -->
              <a-modal
                title="Archive Activity"
                :visible="isArchiveModalOpen"
                @cancel="handleCancelArchive"
                width="20%"
              >
                <p>
                  Are you sure you want to archive activity? <br />
                  <br />
                  By confirming this, the event will not be available to users.
                </p>
                <template #footer>
                  <a-button
                    key="cancel"
                    type="warning"
                    @click="handleCancelArchive"
                  >
                    Cancel
                  </a-button>
                  <a-button
                    key="confirm"
                    type="danger"
                    @click="handleArchiveActivity"
                  >
                    Confirm
                  </a-button>
                </template>
              </a-modal>
              <!-- End Archive Event modal -->

              <!-- Activity Matrix Modal -->
              <a-modal
                title="Payroll Activity Matrix"
                :visible="isMatrixModalOpen"
                @cancel="handleCancelMatrix"
                width="60%"
                :footer="null"
              >
                <sdCards headless>
                  <div class="result-list-content">
                    <a-row :gutter="15">
                      <a-col class="w-100" :md="24">
                        <sdCards headless>
                          <sdHeader>
                            <b>
                              <span class="ai-playback-shuffle"></span>Payable
                              Organizations
                            </b>
                          </sdHeader>
                          <br />
                          <br />
                          <div>
                            <sdButton
                              class="spaced-button"
                              size="extra-small"
                              type="success"
                              outlined
                              v-for="org in org_matrixes"
                              :key="org.id"
                            >
                              {{ org.org_id }}
                            </sdButton>
                          </div>
                          <br />
                          <div v-if="isLoading" class="spin">
                            <a-spin />
                          </div>
                          <div v-else>
                            <TableWrapper
                              class="table-data-view table-responsive"
                              v-show="activeClass === 'all'"
                            >
                              <a-table
                                :dataSource="activity_matrixes"
                                :columns="matrix_column"
                              >
                              </a-table>
                            </TableWrapper>
                          </div>
                        </sdCards>
                      </a-col>
                    </a-row>
                  </div>
                </sdCards>
              </a-modal>

              <!-- End Activity Matrix modal -->
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
import { computed, onMounted, ref, reactive } from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../../vuex/store";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Phone",
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
    title: "Confirmed Days",
    dataIndex: "confirmed_days",
    key: "id",
  },
  {
    title: "Unconfirmed Days",
    dataIndex: "unconfirmed_days",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
    key: "activity",
    slots: { customRender: "activity" },
  },
];
const matrix_column = [
  {
    title: "Matrix",
    dataIndex: "pay_matrix_id",
    key: "id",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "id",
  },
];
const { state } = useStore();
const isLoading = computed(() => state.crud.loading);
const dataSource = ref([]);
const confirmed = ref({});
const pending = ref([]);
const officers = ref([]);
const activeClass = ref("all");
const { query } = useRoute();
const isGenerating = computed(() => state.isGenerating);
const isArchiveModalOpen = ref(false);
const router = useRouter();
const searchOfficerItem = ref("");
const isModalOpen = ref(false);
const activity_code = ref(query.code);
const recordCount = computed(() => {
  return dataSource.value.length;
});
const confirmedCount = computed(() => {
  return confirmed.value.length;
});
const pendingCount = computed(() => {
  return pending.value.length;
});
const event_name = ref(query.name);
const API_URL = `activity_invited_officers?activity_id=${query.id}`;
const export_participants_url = `${process.env.VUE_APP_BASE_URL}/activity_participants_export?activity_code=${query.code}`;
const isMatrixModalOpen = ref(false);
const activity_matrixes = ref([]);
const org_matrixes = ref([]);
const activity_matrix = `${process.env.VUE_APP_BASE_URL}/view_activity_matrix?activity_list_id=${query.activity_list_id}`;
const orgs_matrix = `${process.env.VUE_APP_BASE_URL}/view_activity_org_matrix?activity_list_id=${query.activity_list_id}`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to get the ordinal suffix for a number
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const formattedDay = `${day}${getOrdinalSuffix(day)}`;
  const formattedMonth = monthNames[monthIndex];

  return `${formattedDay} ${formattedMonth} ${year}`;
};
const start_date = query.start_date;
const formattedStartDate = formatDate(start_date);

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
    console.log(response);
    const fileName = "Activity Participants.xlsx";
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

const resendSMS = async (id) => {
  console.log(id);
  console.log(query.id);
  try {
    const response = await axios.get(
      `resend_activity_confirmation_reminder/${query.id}/${id}`
    );
    console.log(response);
    if (response.status == 200) {
      Modal.success({
        title: "Success",
        content: "SMS Confirmation Sent successfully",
      });
    } else {
      Modal.error({
        title: "Error",
        content: "Something went wrong during SMS resend",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const openArchiveModal = () => {
  console.log(query.id);
  isArchiveModalOpen.value = true;
  // formState.post_id = id;
};

const handleCancelArchive = () => {
  isArchiveModalOpen.value = false;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

const handleArchiveActivity = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/activity/archive?id=${query.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    );
    const data = await response.json();
    console.log(data);

    if (data.success === true) {
      notification.success({
        message: "Success!",
        description: data.data,
      });
      isArchiveModalOpen.value = true;
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      router.back();
    } else {
      notification.error({
        message: "Error!",
        description: data.data,
      });
      isArchiveModalOpen.value = false;
      router.back();
    }
  } catch (error) {
    console.error(error);
  }
};

const removeOfficer = (id) => {
  axios
    .post(
      `/deassign_activity_facilitator?activity_id=${query.id}&user_id=${id}`
    )
    .then((response) => {
      const { success, message } = response.data;
      if (success === true) {
        notification.success({
          message: "Success",
          description: message,
        });
        isModalOpen.value = false;
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        notification.error({
          message: "Error",
          description: `${message}`,
        });
      }
    })
    .catch((error) => {
      notification.error({
        message: "Error",
        description: `${error.message || "Unknown error"}`,
      });
    });
};

const activateOfficer = (id) => {
  axios
    .post(`/activate_officer?activity_id=${query.id}&user_id=${id}`)
    .then((response) => {
      const { success, data } = response.data;
      if (success === true) {
        notification.success({
          message: "Success",
          description: data,
        });
        isModalOpen.value = false;
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        notification.error({
          message: "Error",
          description: `${data}`,
        });
      }
    })
    .catch((error) => {
      notification.error({
        message: "Error",
        description: `${error.message || "Unknown error"}`,
      });
    });
};

const handleChange = (tab) => {
  activeClass.value = tab;
};

onMounted(async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data.data);

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;

      // check if status = 0 return inactive else return active
      let status = (record.status == 0 || record.status == null) ? "Inactive" : "Active";

      return {
        ...record,
        fullName,
        status,
      };
    });

    console.log(updatedData);

    dataSource.value = updatedData;
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(
      `activity_participants?activity_id=${activity_code.value}&confirmed=1`
    );
    console.log(response);
    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });
    console.log(response.data);
    confirmed.value = updatedData;
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(
      `activity_participants?activity_id=${activity_code.value}&confirmed=0`
    );

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });
    console.log(response.data);

    pending.value = updatedData;

    console.log(pending.value);
  } catch (error) {
    console.error(error);
  }
});

const formState = reactive({
  activity_id: query.id,
  add_officer: [],
});

const sendInvites = async () => {
  try {
    await axios
      .get(`notify_activity_participants/${query.id}`)
      .then((response) => response.data)
      .then(({ success, message }) => {
        console.log(message);
        if (success == true) {
          notification.success({
            message: "Success",
            description: message,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen.value = false;
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleAddOfficers = async () => {
  try {
    const data = {
      activity_id: formState.activity_id,
      participants: formState.add_officer,
    };

    console.log(data);

    console.log(JSON.stringify(data));
    await axios
      .post(`add_officers`, data)
      .then((response) => response.data)
      .then(({ success, data }) => {
        if (success == true) {
          notification.success({
            message: "Success",
            description: data,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${data}`,
          });
        }
        isModalOpen.value = false;
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const officersList = async () => {
  try {
    const response = await axios.get(`users?query=${searchOfficerItem.value}`);
    const data = await response.data;

    console.log(data);

    // Modify the structure of each supervisor to include a 'label' property
    officers.value = data.data.map((user) => ({
      ...user,
      label: `${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
    }));
  } catch (error) {
    console.error(error);
  }
};

officersList();

const handleOfficerSearch = (value) => {
  searchOfficerItem.value = value;
  officersList();
};

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

// const event_host_id = query.event_host_id;
const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user.user.id);

const isApprovedGenerator = computed(() => {
  // const currentTime = new Date();
  if (
    user.user.role_id === 53 ||
    user.user.role_id === 63 ||
    user.user.role_id === 4 ||
    user.user.role_id === 59
  ) {
    return true;
  } else {
    return false;
  }
});

const isCreator = computed(() => {
  // const currentTime = new Date();
  if (user.user.id == query.created_by) {
    return true;
  } else {
    return false;
  }
});

const generatePayroll = async () => {
  store.commit("setIsGenerating", true);
  try {
    const response = await axios.get(
      `/generate_pay_roll?activity_code=${query.code}&confirmed=1`
    );
    console.log(response);
    if (response.status == 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
    } else {
      store.commit("setIsGenerating", false);
      Modal.error({
        title: "Error",
        content:
          "Something went wrong, ensure you have assigned payroll matrix to the event",
      });
    }
  } catch (error) {
    store.commit("setIsGenerating", true);
    console.error(error);
  }
};
const openModal = () => {
  isModalOpen.value = true;
};

const openMatrixModal = () => {
  isMatrixModalOpen.value = true;
};

const handleCancelMatrix = () => {
  isMatrixModalOpen.value = false;
};
const getActivityMatrix = () => {
  axios
    .get(activity_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response.data.data);
      activity_matrixes.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

getActivityMatrix();
const getOrgMatrix = () => {
  axios
    .get(orgs_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      org_matrixes.value = response.data.data;
      console.log(org_matrixes.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

getOrgMatrix();
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
