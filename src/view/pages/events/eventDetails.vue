<template>
  <div>
    <sdPageHeader
      ghost
      :title="`${event_name} Event - ${event_code} on ${formattedStartDate}`"
    />
    <Main>
      <div class="button-container">
        <sdButton
          v-if="isApprovedGenerator"
          class="btn-import"
          type="success"
          size="extra-small"
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
        <span v-if="isApprovedGenerator">&nbsp;&nbsp;</span>

        <sdButton class="btn-import" type="success" size="extra-small">
          <router-link to="/events/add-stakeholder">
            Add Stakeholder</router-link
          >
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
        <span v-if="isApprovedGenerator">&nbsp;&nbsp;</span>
        <sdButton
          class="btn-import"
          type="warning"
          @click="openModal()"
          size="extra-small"
        >
          Archive Event &nbsp; &nbsp;
          <sdFeatherIcons type="archive" size="extra-small" />
        </sdButton>
        &nbsp; &nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="openMatrixModal()"
          size="extra-small"
        >
          Event Matrix &nbsp; &nbsp;
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
                <li>
                  <sdButton
                    class="btn-import"
                    type="warning"
                    @click="openCadreModal()"
                    size="extra-small"
                  >
                    Participation Summary &nbsp; &nbsp;
                    <sdFeatherIcons type="users" size="extra-small" />
                  </sdButton>
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
                            <template #participants="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="success"
                                    :disabled="isStarting"
                                    @click="assignFacilitator(record)"
                                    v-if="record.is_facilitator == false"
                                  >
                                    <span>Assign Facilitator </span>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    :disabled="isStarting"
                                    @click="deassignFacilitator(record)"
                                    v-else-if="record.is_facilitator == true"
                                  >
                                    <span> De-assign Facilitator </span>
                                  </sdButton>
                                  &nbsp; &nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    @click="voidParticipant(record.id)"
                                    v-if="isApprovedGenerator || isHost"
                                  >
                                    Void Participant
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
                            <template #participants="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    @click="resendConfirmation(record.id)"
                                  >
                                    Resend Confirmation
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                      <!-- Void Participants Modal -->
                      <a-modal
                        title="Void Participant"
                        :visible="isModalOpen"
                        @cancel="handleCancel"
                        width="20%"
                      >
                        <p>Are you sure you want to void participant?</p>

                        <a-form
                          class="add-record-form"
                          :style="{ width: '100%' }"
                          layout="vertical"
                          name="addactivity"
                          :model="formState"
                        >
                          <a-form-item name="reason_for_voiding" label="Reason">
                            <a-textarea
                              v-model:value="formState.reason_for_voiding"
                              placeholder="State reason for voiding..."
                              :rows="4"
                            />
                          </a-form-item>
                        </a-form>
                        <template #footer>
                          <a-button
                            key="cancel"
                            type="warning"
                            @click="handleCancel"
                          >
                            Cancel
                          </a-button>
                          <a-button
                            key="confirm"
                            type="danger"
                            @click="handleVoid"
                          >
                            Confirm
                          </a-button>
                        </template>
                      </a-modal>
                      <!-- End void participant modal -->

                      <!-- Archive Event Modal -->
                      <a-modal
                        title="Archive Event"
                        :visible="isArchiveModalOpen"
                        @cancel="handleCancelArchive"
                        width="20%"
                      >
                        <p>
                          Are you sure you want to archive event? <br />
                          <br />
                          By confirming this, the event will not be available to
                          users.
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
                            @click="handleArchiveEvent"
                          >
                            Confirm
                          </a-button>
                        </template>
                      </a-modal>
                      <!-- End Archive Event modal -->

                      <!-- Event Matrix Modal -->
                      <a-modal
                        title="Payroll Event Matrix"
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
                                      <span class="ai-playback-shuffle"></span
                                      >Payable Organizations
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
                                        :dataSource="event_matrixes"
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

                      <!-- End Event Matrix modal -->

                      <!-- Cadre Modal -->
                      <a-modal
                        title="Participation Summary"
                        :visible="isCadreModalOpen"
                        @cancel="handleCancelCadre"
                        width="40%"
                        :footer="null"
                      >
                        <sdCards headless>
                          <div class="result-list-content">
                            <a-row :gutter="15">
                              <a-col class="w-100" :md="24">
                                <sdCards headless>
                                  <div>
                                    <ul class="cadre-list">
                                      <li
                                        v-for="cadre in cadres"
                                        :key="cadre.role_id"
                                        class="cadre-list-item"
                                      >
                                        {{ cadre.role_id }} - {{ cadre.count }}
                                      </li>
                                    </ul>
                                  </div>
                                  <br />
                                </sdCards>
                              </a-col>
                            </a-row>
                          </div>
                        </sdCards>
                      </a-modal>

                      <!-- End Cadre Modal -->

                      <!-- Assign & Deassign Modals -->
                      <a-modal
                        title="Assign Facilitator"
                        :visible="isAssignModal"
                        @ok="handleAssign"
                        @cancel="handleAssignCancel"
                        class="title-success"
                      >
                        <div>
                          <p>
                            Please confirm that you want to assign
                            {{ participant.first_name }}
                            {{ participant.last_name }},
                            {{ participant.id_no }} of
                            {{ participant.location_id }} as facilitator to
                            <br />
                            Event: {{ event_name }}
                          </p>
                        </div>
                      </a-modal>

                      <a-modal
                        title="De-assign Facilitator"
                        :visible="deassignModal"
                        @ok="handleDeassign"
                        @cancel="handleDeassignCancel"
                        class="title-success"
                      >
                        <div>
                          <p>
                            Please confirm that you want to de-assign
                            {{ participant.first_name }}
                            {{ participant.last_name }},
                            {{ participant.id_no }} of
                            {{ participant.location_id }} as facilitator to
                            <br />
                            Event: {{ event_name }}
                          </p>
                        </div>
                      </a-modal>
                      <!--  End of assign & Deassign Modals  -->
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
  reactive,
  //defineComponent
} from "vue";
import authHeader from "../../../services/auth-header";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../../vuex/store";
import { decrypt } from "@/cryptoHelper";
import { notification } from "ant-design-vue";

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
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level_id",
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
  {
    title: "Action",
    dataIndex: "",
    key: "participants",
    slots: { customRender: "participants" },
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

const recordCount = computed(() => dataSource.value.length);
const confirmedCount = computed(() => confirmed.value.length);
const pendingCount = computed(() => pending.value.length);
const { query } = useRoute();
const plainquery = decrypt(decodeURIComponent(query.encryptedData));
const event_name = plainquery.name;
const event_code = plainquery.event_code;
const event_host_id = plainquery.event_host_id;
const router = useRouter();
const { state } = useStore();
const isLoading = computed(() => state.crud.loading);
const dataSource = ref([]);
const confirmed = ref([]);
const pending = ref([]);
const activeClass = ref("all");
const isGenerating = computed(() => state.isGenerating);
const isModalOpen = ref(false);
const isArchiveModalOpen = ref(false);
const isMatrixModalOpen = ref(false);
const isCadreModalOpen = ref(false);
const participant_id = ref("");
const API_URL = `events/${plainquery.event_code}/participants`;
const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${event_code}`;
const export_participants_url = `${process.env.VUE_APP_BASE_URL}/event_participants_export?event_code=${plainquery.event_code}`;
const event_matrix = `${process.env.VUE_APP_BASE_URL}/view_event_matrix?event_list_id=${plainquery.event_list_id}`;
const orgs_matrix = `${process.env.VUE_APP_BASE_URL}/view_event_org_matrix?event_list_id=${plainquery.event_list_id}`;
const cadres_url = `${process.env.VUE_APP_BASE_URL}/get_event-registration_role_count/${plainquery.id}`;
const event_matrixes = ref([]);
const org_matrixes = ref([]);
const cadres = ref([]);
const isAssignModal = ref(false);
const deassignModal = ref(false);
const participant = ref("");
const id_user = ref("");

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

const start_date = plainquery.start_date;
const formattedStartDate = formatDate(start_date);

const formState = reactive({
  reason_for_voiding: "",
});

const generatePayroll = async () => {
  store.commit("setIsGenerating", true);

  try {
    const response = await axios.get(genetatePayrollURL, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    console.log(response);

    if (response.status === 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      location.reload();
    } else {
      handleErrorResponse(response);
    }
  } catch (error) {
    console.error(error);
    handleErrorResponse();
  }
};

// resendConfirmation
const resendConfirmation = async (id) => {
  console.log(id);
  let user_id = id;

  const url = `${process.env.VUE_APP_BASE_URL}/resend_event_registration_code/${plainquery.id}/${user_id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    const { success, data } = await response.json();

    console.log({ success, data });

    if (success === true) {
      notification.success({
        message: "Success",
        description: data,
      });
      isModalOpen.value = false;
    } else {
      notification.info({
        message: "Info",
        description: data,
      });
    }
    isModalOpen.value = false;
  } catch (error) {
    console.error("Error:", error);
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const voidParticipant = (id) => {
  isModalOpen.value = true;
  console.log(id);
  participant_id.value = id;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

const handleVoid = async () => {
  console.log(participant_id.value);
  try {
    const data = {
      event_id: plainquery.id,
      user_id: participant_id.value,
      reason_for_voiding: formState.reason_for_voiding,
    };
    console.log(data);
    fetch(`${process.env.VUE_APP_BASE_URL}/void_event_participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        console.log(message);
        if (success == true) {
          notification.success({
            message: "Participant voided successfully",
            description: message,
          });
          new Promise((resolve) => {
            setTimeout(resolve, 3000);
          });
          location.reload();
        } else {
          notification.error({
            message: "Participant voiding not successful",
            description: message,
          });
        }
      })
      .catch((error) => {
        store.commit("setIsSubmitting", false);
        notification.error({
          message: "Could not submit!",
          description: "An error has occured. Please try again later.",
        });
        console.error("Error:", error);
      });
  } catch (error) {
    console.error(error);
  }
};

const handleArchiveEvent = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/event/archive?id=${plainquery.id}`,
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

const handleErrorResponse = (response) => {
  console.log(response);
  store.commit("setIsGenerating", false);
  Modal.error({
    title: "Error",
    content: "Something went wrong, contact admin",
  });
  setTimeout(() => location.reload(), 4000);
};
const openModal = () => {
  console.log("archive modal");
  isArchiveModalOpen.value = true;
};

const handleCancelArchive = () => {
  isArchiveModalOpen.value = false;
};

const openMatrixModal = () => {
  isMatrixModalOpen.value = true;
};

const handleCancelMatrix = () => {
  isMatrixModalOpen.value = false;
};

const openCadreModal = () => {
  isCadreModalOpen.value = true;
};

const handleCancelCadre = () => {
  isCadreModalOpen.value = false;
};

const getEventMatrix = () => {
  axios
    .get(event_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      event_matrixes.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

getEventMatrix();

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

const getTraineCadres = () => {
  axios
    .get(cadres_url, {
      headers: authHeader(),
    })
    .then((response) => {
      cadres.value = response.data.data;
      console.log(cadres.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

getTraineCadres();

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

const handleChange = (tab) => {
  activeClass.value = tab;
};

const assignFacilitator = (user) => {
  isAssignModal.value = true;
  console.log(user.first_name);
  participant.value = user;
  id_user.value = user.id;
};

const handleAssignCancel = () => {
  isAssignModal.value = false;
};

const deassignFacilitator = (user) => {
  deassignModal.value = true;
  participant.value = user;
  id_user.value = user.id;
};

const handleDeassignCancel = () => {
  deassignModal.value = false;
};

const handleAssign = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/assign_facilitator/${plainquery.id}/${id_user.value}`,
      null,
      {
        headers: authHeader(),
      }
    );

    isAssignModal.value = false;
    console.log(response);
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.data,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
};

const handleDeassign = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/de_assign_facilitator/${plainquery.id}/${id_user.value}`,
      null,
      {
        headers: authHeader(),
      }
    );

    isAssignModal.value = false;
    console.log(response);
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.data,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
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

const level_id = ref("");
const role_id = ref("");
const rt = useRouter();

const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user.user.id);

const isApprovedGenerator = computed(() => {
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
console.log(event_host_id);

const isHost = computed(() => {
  if (
    user.user.id === event_host_id
  ) {
    return true;
  } else {
    return false;
  }
});

computed(() => {
  if (user.user.org_types_id === 10) {
    return true;
  } else {
    return false;
  }
});

onMounted(async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: authHeader(),
    });
    console.log(response.data.data);

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
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
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    rt.push({ path: "/auth/login" });
  } else {
    level_id.value = user.user.level_id;
    role_id.value = user.user.role_id;
  }
});
</script>

<style>
.button-container {
  text-align: center;
}

.button-container sdButton {
  margin: 5px;
}

.cadre-list {
  list-style-type: none;
  padding: 0;
}

.cadre-list-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}

@media (min-width: 769px) {
  .button-container {
    text-align: left;
    display: inline-block;
  }

  .button-container sdButton {
    margin: 5px;
  }
}
@media (max-width: 768px) {
  .button-container sdButton {
    margin: 5px 0;
    padding: 5px;
  }
}
</style>
