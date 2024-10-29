<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Events">
      <template #subTitle> </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <!-- Increase the size of the search icon by setting the 'font-size' property -->
            <sdFeatherIcons type="search" size="24" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name code, venue or location"
            style="
              font-size: 15px;
              width: 100%;
              max-width: 300px;
              height: 2.5rem;
            "
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :pagination="false"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #events="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          @click="handleRegistration(record.event_code)"
                          size="extra-small"
                          type="success"
                          v-if="record.payroll_status === 'Pending'"
                        >
                          <sdFeatherIcons type="user-plus" size="small" />
                          &nbsp; Register
                        </sdButton>
                        <span v-if="record.payroll_status === 'Pending'"
                          >&nbsp;&nbsp;</span
                        >
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              name: `view-details`,
                              params: { id: record.id },
                              query: {
                                encryptedData: encodeURIComponent(
                                  encrypt({
                                    id: record.id,
                                    name: record.name,
                                    event_code: record.event_code,
                                    event_host_id: record.event_host_id,
                                    start_date: record.start_date,
                                    event_list_id: record.event_list_id,
                                    location: record.county,
                                  })
                                ),
                              },
                            }"
                          >
                            View Event
                          </router-link>
                        </sdButton>
                        &nbsp; &nbsp;
                        <sdButton
                          size="extra-small"
                          type="success"
                          @click="manageEvent(record.event_code)"
                        >
                          View Trainers &nbsp; &nbsp;
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          size="extra-small"
                          type="success"
                          :disabled="isStarting"
                          @click="startEvent(record.id)"
                          v-if="
                            !record.status &&
                            record.payroll_status === 'Pending'
                          "
                        >
                          <sdFeatherIcons type="play-circle" size="small" />
                          <span>Start Event </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          size="extra-small"
                          type="danger"
                          :disabled="isStarting"
                          v-else-if="record.payroll_status === 'Pending'"
                          @click="closeEvent(record.id)"
                        >
                          <sdFeatherIcons type="x-circle" size="small" />
                          <span> Close Event </span>
                        </sdButton>
                        &nbsp;&nbsp;
                      </div>
                    </td>
                  </template>
                </a-table>
                <a-pagination
                  :current="currentPage"
                  :total="datatotal"
                  :pageSize="pageSize"
                  :showSizeChanger="true"
                  :pagination="true"
                  @change="onPageChange($event)"
                />
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
      <a-modal
        title="Event Confirmation"
        :visible="isModalOpen"
        @ok="handleOk(recordId, inputValue)"
        @cancel="handleCancel"
        class="title-success"
      >
        <div>
          <p>Registration Confirmation processing</p>
          <input type="number" v-model="inputValue" />
        </div>
      </a-modal>
      <a-modal
        title="Event Trainers"
        :visible="isTrainerModalOpen"
        @ok="handleOkTrainers"
        @cancel="handleTrainerCancel"
        class="title-success"
      >
        <div>
          <h4>
            <b>
              <u> Event Host </u>
            </b>
          </h4>
          <p>{{ event_host }}</p>
          <h4>
            <b>
              <u> Event Facilitators </u>
            </b>
          </h4>
          <br />
          <ul>
            <li v-for="facilitator in event_facilitators" :key="facilitator">
              {{ facilitator }}
            </li>
          </ul>
        </div>
      </a-modal>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import axios from "@/Axiosconfig";
import { RecordViewWrapper } from "./style";
import { Main } from "../../styled";
import { computed, onMounted, ref, defineProps, watch } from "vue";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";

const router = useRouter();

const columns = [
  {
    title: "Event Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Event Code",
    dataIndex: "event_code",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Venue",
    dataIndex: "venue",
    key: "id",
  },
  {
    title: "Payroll Status",
    dataIndex: "payroll_status",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "events",
    slots: { customRender: "events" },
  },
];

defineProps({
  event: {
    type: Object,
    required: true,
  },
});


const isLoading = ref(true);
const dataSource = ref([]);
const eventCode = ref("");
const searchItem = ref("");
let isModalOpen = ref(false);
const isTrainerModalOpen = ref(false);
const recordId = ref(null);
const event_host = ref("");
const event_facilitators = ref([]);
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const visible = ref(false);
const colorVisible = ref(false);
const isStarting = ref(false);
const eventStatus = ref({}); 
import { encrypt } from "@/cryptoHelper";

const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    const response = await axios.get(
      `events/all?page=${page}&per_page=${pageSize.value}`
    );
    dataSource.value = response.data.data;
    datatotal.value = response.data.pagination.total;
  } catch (error) {
    console.error(error);
  }
};
// search events
watch(
  () => searchItem.value,
  (newValue) => {
    searchItem.value = newValue;
    getEvents();
  }
);
// get all the events
onMounted(() => {
  getEvents();
});

const getEvents = () => {
  isLoading.value = true;
  axios
    .get(
      `events/all?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`
    )
    .then((response) => {
      datatotal.value = response.data.pagination.total;
      console.log(datatotal.value);
      dataSource.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
// start an event == only host can start/close
const startEvent = async (id) => {
  try {
    isStarting.value = true;
    const response = await axios.get(`event_start_trigger/${id}`);
    const data = await response.data;
    console.log(data);
    if (data.status === true) {
      eventStatus.value[id] = true;
      localStorage.setItem("eventStatus", JSON.stringify(eventStatus.value));
      notification.success({
        message: "Event Started",
        description: data.message,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else {
      eventStatus.value[id] = false;
      localStorage.setItem("eventStatus", JSON.stringify(eventStatus.value));
      notification.error({
        message: "Event Not Started",
        description: data.message,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    isStarting.value = false;
  }
};
// close an event == only host can start/close
const closeEvent = async (id) => {
  try {
    isStarting.value = true;
    const response = await axios.get(`event_close_trigger/${id}`);
    const data = await response.data;
    console.log(data);
    if (data.status === true) {
      eventStatus.value[id] = true;
      localStorage.setItem("eventStatus", JSON.stringify(eventStatus.value));
      // notify the user
      notification.success({
        message: "Event Closed",
        description: "Event has been closed successfully",
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
      });
      location.reload();
    } else {
      eventStatus.value[id] = false;
      localStorage.setItem("eventStatus", JSON.stringify(eventStatus.value));
      notification.error({
        message: "Event Not Closed",
        description: "Only event host can close event",
      });
    }
    // location.reload();
  } catch (error) {
    console.error(error);
  } finally {
    isStarting.value = true;
  }
};

const handleCancel = () => {
  isModalOpen.value = false;
  visible.value = false;
  colorVisible.value = false;
};
const handleTrainerCancel = () => {
  isTrainerModalOpen.value = false;
  visible.value = false;
  colorVisible.value = false;
};
const handleOkTrainers = () => {
  isTrainerModalOpen.value = false;
  visible.value = false;
  colorVisible.value = false;
};
const handleRegistration = (id) => {
  isModalOpen.value = true;
  console.log("Event Code;", id);
  recordId.value = id;
  console.log("recordId", recordId.value);
  try {
    console.log("register");
  } catch (error) {
    console.log(error);
  }
};
const manageEvent = async (code) => {
  console.log(code);
  console.log("console.log");
  isTrainerModalOpen.value = true;
  try {
    const response = await axios.get(`event/${code}/facilitators`);
    const eventDetails = response.data.data;
    // Reset the arrays before adding new data

    event_host.value = eventDetails.event_host;
    event_facilitators.value = eventDetails.event_facilitators;

    //console.log(event_host.value, event_facilitators.value);
  } catch (error) {
    console.error(error);
  }
};
// confirm participant registration code
const handleOk = async (id, inputValue) => {
  console.log(recordId.value);
  console.log(inputValue);
  try {
    const response = await axios.get(
      `event/${recordId.value}/participant/${inputValue}/assign`
    );
    //console.log(response);
    console.log(response);

    if (response.status == 200) {
      inputValue = "";
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      inputValue = "";
    } else if (response.status == 208) {
      notification.info({
        message: "Info",
        description: response.data.message,
      });
      inputValue = "";
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: "Error",
      description:
        error,
    });
    inputValue = "";
  } finally {
    console.log(inputValue);
    inputValue = ""; // Clear inputValue after the modal is closed
    isModalOpen = true;
  }
};

// Handle when event code is incorrect
async () => {
  try {
    // Validate the event code
    const { data } = await axios.get(
      `events/all?event_code=${eventCode.value}`
    );
    if (!data || data.length === 0) {
      throw new Error("Invalid event code");
    }

    // Navigate to the event registration page
    const eventId = data[0].id;
    router.push(`/event/register/${eventId}`);
  } catch (error) {
    console.error(error);
  }
};
computed(() => {
  const query = searchItem.value.toLowerCase();
  const regex = new RegExp(query, "i");
  if (!query) {
    return dataSource.value;
  } else {
    return dataSource.value.filter((event) => {
      return (
        regex.test(event.event_code) ||
        regex.test(event.name) ||
        regex.test(event.location_id) ||
        regex.test(event.venue)
      );
    });
  }
});
</script>

<style lang="css">
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 1rem;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.spaced-button {
  margin-right: 25px; 
  margin-bottom: 15px;
}

.remove-button {
  margin-left: 15px;
  margin-right: -25px;
}
</style>
