<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ev-events-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> MassNet GF Events
            </h3>
            <p class="ph-subtitle">
              Manage events, registration, trainers &amp; payroll status
            </p>
          </div>
          <div class="ph-actions">
            <div class="ev-search">
              <span class="search-icon">
                <sdFeatherIcons type="search" size="14" />
              </span>
              <a-input
                v-model:value="searchItem"
                type="text"
                name="dataSource"
                placeholder="Search by name, code, venue or location"
                allow-clear
              />
            </div>
            <div class="ev-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="ev-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="ev-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Filter panel -->
        <section class="panel filter-panel">
          <div class="filter-grid">
            <a-select
              v-if="allowedLevels.includes('county')"
              v-model:value="county"
              show-search
              placeholder="Select County"
              :options="counties"
              :filter-option="filterOption"
              @change="handleChange($event, 'county')"
            ></a-select>
            <a-select
              v-if="allowedLevels.includes('subcounty')"
              v-model:value="subcounty"
              show-search
              placeholder="Select Sub County"
              :options="subcounties"
              :filter-option="filterOption"
              @change="handleChange($event, 'subcounty')"
            ></a-select>
            <a-select
              v-model:value="gfevent"
              show-search
              placeholder="Select an Event"
              :options="events"
              :filter-option="filterOption"
              @change="handleChange($event, 'event')"
            ></a-select>
            <a-select
              v-model:value="payroll_status"
              show-search
              placeholder="Event Payroll Status"
              :options="payroll_status_options"
              :filter-option="filterOption"
              @change="handleChange($event, 'payroll_status')"
            ></a-select>
          </div>
        </section>

        <!-- Events list -->
        <section class="panel events-panel">
          <div v-if="isLoading" class="ev-loading">
            <a-spin />
          </div>

          <div v-else>
            <!-- Table view -->
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ev-table-shell"
            >
              <a-table
                :pagination="false"
                :dataSource="dataSource"
                :columns="columns"
                row-key="id"
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
                                    funding_id: record.funding_source,
                                    start_date: record.start_date,
                                    event_list_id: record.event_list_id,
                                    location: record.county,
                                    payroll_status: record.payroll_status,
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
                            !record.start_date &&
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
                          v-if="record.status && record.payroll_status === 'Pending'"
                          @click="openCloseModal(record)"
                        >
                          <sdFeatherIcons type="x-circle" size="small" />
                          <span> Close Event </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          size="extra-small"
                          type="primary"
                          v-if="
                            !record.status &&
                            record.start_date &&
                            !record.payroll_submitted &&
                            record.payroll_status === 'Pending'
                          "
                          @click="openSubmitModal(record)"
                        >
                          <sdFeatherIcons type="send" size="small" />
                          <span> Submit for Payroll </span>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>

            <!-- Card view -->
            <div v-else class="ev-card-list">
              <article
                v-for="record in dataSource"
                :key="record.id"
                class="ev-card"
              >
                <div class="ev-card-head">
                  <div class="ev-card-title">{{ record.name }}</div>
                  <span class="ev-card-code">{{ record.event_code }}</span>
                </div>
                <div class="ev-card-meta">
                  <div>
                    <span class="lbl">Location</span>
                    <span class="val">{{ record.location_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Venue</span>
                    <span class="val">{{ record.venue || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Payroll Status</span>
                    <span class="val">{{ record.payroll_status || "—" }}</span>
                  </div>
                </div>
                <div class="ev-card-actions">
                  <sdButton
                    @click="handleRegistration(record.event_code)"
                    size="extra-small"
                    type="success"
                    v-if="record.payroll_status === 'Pending'"
                  >
                    <sdFeatherIcons type="user-plus" size="small" />
                    &nbsp; Register
                  </sdButton>
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
                              funding_id: record.funding_source,
                              start_date: record.start_date,
                              event_list_id: record.event_list_id,
                              location: record.county,
                              payroll_status: record.payroll_status,
                            })
                          ),
                        },
                      }"
                    >
                      View Event
                    </router-link>
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="success"
                    @click="manageEvent(record.event_code)"
                  >
                    View Trainers
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="success"
                    :disabled="isStarting"
                    @click="startEvent(record.id)"
                    v-if="
                      !record.status &&
                      !record.start_date &&
                      record.payroll_status === 'Pending'
                    "
                  >
                    <sdFeatherIcons type="play-circle" size="small" />
                    <span>Start Event</span>
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="danger"
                    :disabled="isStarting"
                    v-if="record.status && record.payroll_status === 'Pending'"
                    @click="openCloseModal(record)"
                  >
                    <sdFeatherIcons type="x-circle" size="small" />
                    <span>Close Event</span>
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="primary"
                    v-if="
                      !record.status &&
                      record.start_date &&
                      !record.payroll_submitted &&
                      record.payroll_status === 'Pending'
                    "
                    @click="openSubmitModal(record)"
                  >
                    <sdFeatherIcons type="send" size="small" />
                    <span>Submit for Payroll</span>
                  </sdButton>
                </div>
              </article>
              <div v-if="!dataSource.length" class="ev-empty">
                No events found.
              </div>
            </div>

            <div class="ev-pagination">
              <a-pagination
                :current="currentPage"
                :total="datatotal"
                :pageSize="pageSize"
                :showSizeChanger="true"
                @change="onPageChange($event)"
              />
            </div>

              <!-- view trainers modal -->
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
                    <li
                      v-for="facilitator in event_facilitators"
                      :key="facilitator"
                    >
                      {{ facilitator }}
                    </li>
                  </ul>
                </div>
              </a-modal>

              <!-- register -->
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

              <!-- close event workflow -->
              <EventClosureModal
                v-model:visible="isCloseModalOpen"
                :event="selectedEvent"
                @closed="onEventClosed"
              />

              <!-- submit for payroll workflow -->
              <EventSubmitPayrollModal
                v-model:visible="isSubmitModalOpen"
                :event="selectedEvent"
                @submitted="onEventSubmitted"
              />
          </div>
        </section>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import axios from "@/Axiosconfig";
import { RecordViewWrapper } from "./style";
import { BudgetPageWrapper } from "../budget/style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import { encrypt } from "@/cryptoHelper";
import EventClosureModal from "./components/EventClosureModal.vue";
import EventSubmitPayrollModal from "./components/EventSubmitPayrollModal.vue";

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

// const {
//   state,
// } = useStore();
const isLoading = ref(true);
const dataSource = ref([]);
const eventCode = ref("");
const searchItem = ref("");
const gfevent = ref(null);
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);
const isCloseModalOpen = ref(false);
const isSubmitModalOpen = ref(false);
const selectedEvent = ref(null);
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
const eventStatus = ref({}); // an object to keep track of the status of each even
const counties = ref(null);
const subcounties = ref(null);
const events = ref([]);
const allowedLevels = ref([]);
const access_level = ref(null);
const org_ids = ref([]);
const location_id = ref("");
const event_list = ref("");
const payroll_status = ref("");
const store = useStore();

const payroll_status_options = [
  {
    value: 2,
    label: "Pending Generation",
  },
  {
    value: 0,
    label: "Generated",
  },
  { value: 1, label: "Paid" },
];

// Fetch activity data from the API endpoint on component mount
onMounted(async () => {
  isLoading.value = true;
  const user = sessionStorage.getItem("user");
  const user_object = JSON.parse(user);
  if (user_object != null) {
    access_level.value = user_object.user;
    await updateFilters();
  }
  getEvents();
});
const updateFilters = async () => {
  if (access_level.value.level.id == 1) {
    allowedLevels.value = ["county", "subcounty"];
    await fetchCounties();
  } else if (access_level.value.level.id == 2) {
    allowedLevels.value = ["county", "subcounty"];
    counties.value = [
      {
        value: access_level.value.location.id,
        label: access_level.value.location.name,
      },
    ];
  }
};
const handleChange = async (org_id, org_level) => {
  //fetch child data
  let org = await org_ids.value
    .filter((x) => x.org_id === org_id)
    .map((e) => e.id);
  let parent_id = org[0] || 9;
  fetchChildData(parent_id, org_id, org_level);
};
const fetchChildData = async (parent_id, org_id, org_level) => {
  currentPage.value = 1;
  let fetchUrl = `get_sub_counties_list`;
  let masterUrl = `gf_events?per_page=${pageSize.value}&page=${currentPage.value}`;
  location_id.value = store.state.filters.location_id;
  if (org_level == "county") {
    store.dispatch("getCountyId", parent_id);
    location_id.value = store.state.filters.location_id;
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    //get county activities
    masterUrl += `&location_id=${location_id.value}`;
  } else if (org_level == "subcounty") {
    store.dispatch("getSubCountyId", parent_id);
    location_id.value = store.state.filters.location_id;
    //get subcounty activities
    fetchUrl += `?parent_id=${org_id}`;
    masterUrl += `&location_id=${location_id.value}`;
  } else if (org_level == "event") {
    //get activities
    location_id.value = store.state.filters.location_id;
    event_list.value = org_id;
    masterUrl += `&location_id=${location_id.value}&event_list=${org_id}`;
  } else if (org_level == "payroll_status") {
    console.log(org_id);
    console.log(org_id);
    //get activities
    // location_id.value = store.state.filters.location_id;
    payroll_status.value = org_id;
    masterUrl += `&payroll_status=${org_id}`;
  }
  await axios
    .get(`${fetchUrl}`)
    .then((response) => {
      let data = response.data.message;
      if (org_level == "county") {
        //get subcounties
        subcounties.value = data.map((x) => ({
          value: x.org_id,
          label: x.name,
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data.map((x) => ({ org_id: x.org_id, id: x.id })),
        ];
      }
    })
    .then(async () => {
      await axios.get(`${masterUrl}`).then((response) => {
        let data = response.data.data;
        dataSource.value = data;
        datatotal.value = response.data.pagination.total;
      });
    })
    .catch((error) => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    });
};
const fetchCounties = async () => {
  try {
    await axios.get("counties/").then((response) => {
      counties.value = response.data.map((x) => ({
        value: x.org_id,
        label: x.name,
      }));
      org_ids.value = [
        ...org_ids.value,
        ...response.data.map((x) => ({ org_id: x.org_id, id: x.id })),
      ];
      // console.log(counties.value)
    });
  } catch (error) {
    notification.error({
      message: `Error!`,
      description: `${error}`,
    });
  } finally {
    isLoading.value = false;
  }
};
const onPageChange = async (page) => {
  console.log(page);
  currentPage.value = page;
  try {
    const response = await axios.get(
      `gf_events?&location_id=${location_id.value}&event_list=${event_list.value}&payroll_status=${payroll_status.value}&page=${page}&per_page=${pageSize.value}`
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
const getEvents = () => {
  isLoading.value = true;
  axios
    .get(
      `gf_events?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}&location_id=${location_id.value}`
    )
    .then((response) => {
      // dataSource.value = response.data.data;
      // console.log(dataSource.value);\
      events.value = response.data.data.map((x) => ({
        value: x.event_list_id,
        label: x.name,
      }));
      console.log(events.value);
      const filteredData = response.data.data.filter(
        (item) => item.funding_source == 1
      );
      datatotal.value = response.data.pagination.total;
      dataSource.value = filteredData;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false; // Stop loading
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
// Event closure & payroll submission are handled by dedicated modals.
const openCloseModal = (record) => {
  selectedEvent.value = record;
  isCloseModalOpen.value = true;
};
const openSubmitModal = (record) => {
  selectedEvent.value = record;
  isSubmitModalOpen.value = true;
};
const onEventClosed = () => {
  setTimeout(() => location.reload(), 1500);
};
const onEventSubmitted = () => {
  setTimeout(() => location.reload(), 1500);
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
        "Participant Registration Failed, Registration Code does not exist",
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
    const { data } = await axios.get(`gf_events?event_code=${eventCode.value}`);
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
  margin-right: 25px; /* Adjust the value as needed */
  margin-bottom: 15px;
}

.remove-button {
  margin-left: 15px; /* Adjust the value as needed */
  margin-right: -25px;
}
</style>

<style lang="less" scoped>
.ev-events-page {
  /* heading search box */
  .ev-search {
    position: relative;
    display: flex;
    align-items: center;
    width: 280px;
    max-width: 100%;
    .search-icon {
      position: absolute;
      left: 14px;
      color: #9ab8a8;
      display: flex;
      z-index: 1;
    }
    :deep(input) {
      height: 100%;
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
    }
    :deep(.ant-input-affix-wrapper) {
      display: flex;
      align-items: center;
      border-radius: 22px;
      border: 1px solid #d9f0e2;
      background: #f7fdf9;
      padding: 0 16px 0 36px;
      height: 40px;
      width: 100%;
      max-width: 100%;
    }
  }

  /* card / table view toggle */
  .ev-view-toggle {
    display: inline-flex;
    background: #f0f7f3;
    border: 1px solid #d9f0e2;
    border-radius: 22px;
    padding: 3px;
    gap: 2px;
    .ev-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border: 0;
      background: transparent;
      color: #5f7268;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 18px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      &.active {
        background: #fff;
        color: #15693c;
        box-shadow: 0 2px 6px rgba(28, 122, 72, 0.12);
      }
    }
  }

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 10px;
    :deep(.ant-select) {
      width: 100%;
    }
  }

  .events-panel {
    padding: 10px;
  }

  .ev-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  /* table */
  .ev-table-shell {
    :deep(.ant-table) {
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
    }
    :deep(.ant-table-thead > tr > th) {
      background: #f4fbf6;
      color: #2f6746;
      font-weight: 700;
      border-bottom: 1px solid #e1efe6;
    }
    :deep(.ant-table-tbody > tr > td) {
      border-bottom: 1px solid #f0f7f3;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f5fbf7;
    }
    :deep(.table-actions) {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
  }

  /* card list */
  .ev-card-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4px;
  }

  .ev-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }

  .ev-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .ev-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.3;
  }

  .ev-card-code {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    color: #2f6746;
    background: #daf4e4;
    border: 1px solid #9ad8b4;
    border-radius: 12px;
    padding: 2px 10px;
  }

  .ev-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin-bottom: 14px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .lbl {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #7a8a82;
      font-weight: 600;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: #2f3a35;
      word-break: break-word;
    }
  }

  .ev-card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    :deep(.ant-btn) {
      width: 100%;
      justify-content: center;
    }
    :deep(a) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }
  }

  .ev-empty {
    text-align: center;
    padding: 40px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  .ev-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 14px 8px 6px;
  }

  /* ───────── Mobile-first tweaks ───────── */
  @media (max-width: 991px) {
    .ph-actions {
      width: 100%;
    }
    .ev-pagination {
      justify-content: center;
    }
  }

  @media (max-width: 575px) {
    .ev-search,
    .ev-view-toggle {
      width: 100%;
    }
    .ev-view-toggle {
      justify-content: center;
    }
    .filter-grid {
      grid-template-columns: 1fr 1fr;
    }
    .ev-card-meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>
