<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Events">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <router-link to="/events/event-create">
            <sdFeatherIcons type="plus" size="small" /> Start New
            Event</router-link
          >
        </sdButton>
      </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name or code"
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
                    <td :style="{ 'margin-left': '4px' }">
                      <div class="table-actions">
                        <sdButton
                          size="small"
                          type="success"
                          :disabled="isStarting"
                          @click="startEvent(record.id)"
                          v-if="!record.status"
                        >
                          <span>
                            <sdFeatherIcons type="clock" size="small" />
                            &nbsp;&nbsp; Start Event
                          </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          size="small"
                          type="danger"
                          :disabled="isStarting"
                          v-else
                          @click="closeEvent(record.id)"
                        >
                          <span v-if="!record.status">
                            <sdFeatherIcons type="clock" size="small" />
                            &nbsp;&nbsp; Start Event
                          </span>
                          <span> &nbsp;&nbsp; Close Event </span>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          @click="handleRegistration(record.event_code)"
                          size="small"
                          type="success"
                        >
                          <sdFeatherIcons type="user-plus" size="small" />
                          &nbsp; Register
                        </sdButton>
                        &nbsp;&nbsp;

                        <sdButton size="small" type="success">
                          <router-link
                            :to="{
                              path: `/event/details/${record.id}`,
                              query: {
                                id: record.id,
                                name: record.name,
                                event_code: record.event_code,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="small" />
                            &nbsp;&nbsp; View Event
                          </router-link>
                        </sdButton>
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
import { Modal, notification } from "ant-design-vue";
// import axios from "axios";

const router = useRouter();
const user = JSON.parse(sessionStorage.getItem("user"));

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
    title: "Host",
    dataIndex: "event_host",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  // {
  //   title: "County",
  //   dataIndex: "campaign_id",
  //   key: "id",
  // },
  {
    title: "Venue",
    dataIndex: "venue",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "events",
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
    async created() {
      // fetch events from the server and initialize eventStatus object
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/events/all`,
        {
          method: "GET",
          headers: authHeader(),
        }
      );
      const data = await response.json();
      console.log(data);
      this.events = data;
      this.eventStatus = {};
      for (const event of this.events) {
        this.eventStatus[event.id] = event.status;
      }
    },
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
            setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
          });
          location.reload();
        } else {
          this.eventStatus[id] = false;
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          notification.error({
            message: "Event Not Started",
            description: data.message,
          });
          // await new Promise((resolve) => {
          //   setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
          // });
          // location.reload();
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isStarting = false;
      }
    },
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
            description: "Only event host or facilitator can close event",
          });
          // await new Promise((resolve) => {
          // setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
          // });
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
    changeType(type) {
      this.modalType = type;
    },

    error() {
      Modal.error({
        title: "This is an error message",
        content: "some messages...some messages...",
      });
    },

    warning() {
      Modal.warning({
        title: "This is a warning message",
        content: "some messages...some messages...",
      });
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
    const isModalOpen = ref(false);
    const recordId = ref(null);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/events/all`;

    const handleRegistration = (id) => {
      isModalOpen.value = true;
      console.log("handlePay", id);
      recordId.value = id;
      console.log("recordId", recordId.value);
      try {
        console.log("register");
      } catch (error) {
        console.log(error);
      }
    };
    const handleOk = async (id, inputValue) => {
      console.log(recordId.value);
      console.log(inputValue);
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/event/${recordId.value}/participant/${inputValue}/assign`,
          // `${process.env.VUE_APP_BASE_URL}/pay_activity_clients?activity_payroll_summary_id=${recordId.value}&otp=${inputValue}`,
          { headers: authHeader() }
        );
        console.log(response);
        if (response.status == 200) {
          notification.success({
            message: "Success",
            description: "Event Registration Successful",
          });
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Participant Registration Failed",
        });
      }
      isModalOpen.value = false;
    };

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          
          if (user) {
            dataSource.value = response.data.data;
          } else {
            const rs = response.data.data.filter((event) => {
              return event.location_id === user.user[2].level_id;
            });
            dataSource.value = rs;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });

    async () => {
      try {
        // Validate the event code
        const { data } = await axios.get(
          `${API_URL}?event_code=${eventCode.value}`
        );
        if (!data || data.length === 0) {
          throw new Error("Invalid event code");
        }

        // Navigate to the event registration page
        const eventId = data[0].id;
        router.push(`/event/register/${eventId}`);
      } catch (error) {
        console.error(error);
        // Modal.error({
        //   title: "Registration failed",
        //   content: "Invalid event code",
        // });
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

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((event) => {
          return regex.test(event.event_code) || regex.test(event.name);
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
    };
  },
});

export default ViewPage;
</script>

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  border-radius: 3px;
}
.badge-red {
  background-color: #f64e60;
  color: white;
  padding: 4px;
  border-radius: 3px;
}
</style>
