<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Events">
      <template #subTitle>
        
      </template>
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
                  :pagination="{ pageSize: 50, showSizeChanger: true }"
                  :dataSource="results"
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
                              path: `/event/details/${record.id}`,
                              query: {
                                id: record.id,
                                name: record.name,
                                event_code: record.event_code,
                                event_host_id: record.event_host_id,
                                eventEndDate: eventEndDate.toISOString(),
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
                                <!-- <sdButton
                                  size="extra-small"
                                  type="info"
                                  @click="manageEvent(record.event_code)"
                                >
                                  Add Trainer &nbsp; &nbsp;
                                </sdButton> -->
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
                              <!-- <li>
                                <sdButton
                                  class="spaced-button"
                                  size="extra-small"
                                  type="success"
                                  outlined
                                  v-for="facilitator in event_facilitators"
                                  :key="facilitator"
                                >
                                  {{ facilitator }}
                                  <sdButton
                                    class="remove-button"
                                    size="extra-small"
                                    type="danger"
                                  >
                                    <sdFeatherIcons
                                      type="trash-2"
                                      size="small"
                                    />
                                  </sdButton>
                                </sdButton> -->
                              <!-- </li> -->
                            </ul>
                          </div>
                        </a-modal>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import axios from "axios";
import authHeader from "../../../services/auth-header";
import { RecordViewWrapper } from "./style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, defineComponent } from "vue";
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
  // {
  //   title: "Host",
  //   dataIndex: "event_host",
  //   key: "id",
  // },
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
    fixed: 'right',
    width: 20,
    slots: { customRender: "events" },
  },
];

const ViewPage = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      modalType: "success",
      colorVisible: false,
      eventCode: "",
      isStarting: false,
      isStarted: false,
      events: [], // an array of events fetched from the server
      eventStatus: {}, // an object to keep track of the status of each event
    };
  },
  methods: {
    // start an event == only host can start/close
    async startEvent(id) {
      try {
        this.isStarting = true;
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/event_start_trigger/${id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.status === true) {
          this.eventStatus[id] = true;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.success({
            message: "Event Started",
            description: data.message,
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          location.reload();
        } else {
          this.eventStatus[id] = false;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.error({
            message: "Event Not Started",
            description: data.message,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isStarting = false;
      }
    },
    // close an event == only host can start/close
    async closeEvent(id) {
      try {
        this.isStarting = true;
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/event_close_trigger/${id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.status === true) {
          this.eventStatus[id] = true;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
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
          this.eventStatus[id] = false;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.error({
            message: "Event Not Closed",
            description: "Only event host can close event",
          });
        }
        // location.reload();
      } catch (error) {
        console.error(error);
      } finally {
        this.isStarting = true;
      }
    },
    handleCancel() {
      this.isModalOpen = false;
      this.visible = false;
      this.colorVisible = false;
    },
    handleTrainerCancel() {
      this.isTrainerModalOpen = false;
      this.visible = false;
      this.colorVisible = false;
    },
    handleOkTrainers() {
      this.isTrainerModalOpen = false;
      this.visible = false;
      this.colorVisible = false;
    },
    changeType(type) {
      this.modalType = type;
    },
  },
  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const eventCode = ref("");
    const searchItem = ref("");
    let isModalOpen = ref(false);
    const isTrainerModalOpen = ref(false);
    const recordId = ref(null);
    const event_host = ref("");
    const event_facilitators = ref([]);
    const eventEndDate = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}`;

    // participants registrations
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
        const response = await axios.get(
          `${API_URL}/event/${code}/facilitators`,
          {
            headers: authHeader(),
          }
        );
        const eventDetails = response.data.data;
        // Reset the arrays before adding new data

        event_host.value = eventDetails.event_host;
        event_facilitators.value = eventDetails.event_facilitators;

        console.log(event_host.value, event_facilitators.value);
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
          `${process.env.VUE_APP_BASE_URL}/event/${recordId.value}/participant/${inputValue}/assign`,
          { headers: authHeader() }
        );
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
            "Participant Registration Failed, Registration Code does not exist",
        });
        inputValue = "";
      } finally {
        console.log(inputValue);
        inputValue = ""; // Clear inputValue after the modal is closed
        isModalOpen = true;
      }
    };

    // get all the events
    onMounted(() => {
      axios
        .get(`${API_URL}/events/all`, {
          headers: authHeader(),
        })
        .then((response) => {
          dataSource.value = response.data.data;
          console.log(dataSource.value);
          dataSource.value.forEach((event) => {
            // Parse the start date string to a Date object
            const startDate = new Date(event.start_date);

            // Calculate the end date in milliseconds (at 12:00 PM)
            const endDateInMilliseconds =
              startDate.getTime() + event.number_of_days * 24 * 60 * 60 * 1000;

            // Create a new Date object for the end date
            const endDate = new Date(endDateInMilliseconds);

            // Set the time components to 12:00 PM
            endDate.setHours(12, 0, 0, 0);

            eventEndDate.value = endDate;
            console.log(eventEndDate.value);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    // Handle when event code is incorrect

    async () => {
      try {
        // Validate the event code
        const { data } = await axios.get(
          `${API_URL}/events/all?event_code=${eventCode.value}`
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

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    // search through the events table
    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((event) => {
          return regex.test(event.event_code) || regex.test(event.name)|| regex.test(event.location_id)|| regex.test(event.venue);
        });
      }
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      results,
      searchItem,
      dataSource,
      columns,
      handleRegistration,
      handleOk,
      isModalOpen,
      isTrainerModalOpen,
      manageEvent,
      event_host,
      event_facilitators,
      eventEndDate,
    };
  },
});

export default ViewPage;
</script>

<style lang="css">
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
    border-radius: 3px; */
  /* size */
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
