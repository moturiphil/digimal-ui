<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Events">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <router-link to="/events/event-create">
            <sdFeatherIcons type="plus" size="14" /> Start New
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
            @change="onHandleSearch"
            v-model:value.trim="formState.searchItem"
            type="text"
            name="dataSource"
            placeholder="Search Here"
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
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #events="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          size="small"
                          type="success"
                          :disabled="isStarting"
                          @click="startEvent(record.id)"
                          v-if="!record.status"
                        >
                          <span >
                            <sdFeatherIcons type="clock" size="16" />
                            &nbsp;&nbsp; Start Event
                          </span>
                        </sdButton>
                        <sdButton
                          size="small"
                          type="success"
                          :disabled="isStarting"
                          v-else
                        >
                          <span v-if="!record.status">
                            <sdFeatherIcons type="clock" size="16" />
                            &nbsp;&nbsp; Start Event
                          </span>
                          <span  class="badge badge-green">
                            &nbsp;&nbsp; Started
                          </span>
                        </sdButton>
                        <sdButton
                          @click="showSuccessModal(record.event_code)"
                          size="small"
                          type="success"
                        >
                          <sdFeatherIcons type="user-plus" size="17" />
                          &nbsp;&nbsp; Register
                        </sdButton>
                        <!-- <sdButton
                          @click="startEvent(record.id)"
                          size="small"
                          type="success"
                        >
                          <sdFeatherIcons type="clock" size="17" />
                          &nbsp;&nbsp; Start Event
                        </sdButton> -->
                        <sdButton>
                          <router-link
                            :to="{
                              path: `/event/view/${record.id}`,
                              query: { id: record.event_code },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="16" />
                            &nbsp;&nbsp; Confirmed Participants
                          </router-link>
                        </sdButton>
                        <sdButton>
                          <router-link
                            :to="{
                              path: `/event/pending-confirmation/${record.id}`,
                              query: { id: record.event_code },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="pause" size="16" />
                            &nbsp;&nbsp; Pending Confirmation
                          </router-link>
                        </sdButton>

                        <!-- <sdButton>
                          <router-link
                            :to="{
                              path: `/event/view/${record.id}`,
                              query: { id: record.event_code },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="16" />
                            &nbsp;&nbsp; Pending Confirmation
                          </router-link>
                        </sdButton> -->
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
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "ant-design-vue";
// import axios from "axios";

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
    title: "User",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "Campaign",
    dataIndex: "campaign_id",
    key: "id",
  },
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
  components: { RecordViewWrapper, Main, TableWrapper },
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
          // this.$set(this.eventStatus, id, true); // update the eventStatus object for this event
          // Vue.set(this.eventStatus, id, true); // update the eventStatus object for this event
          this.eventStatus[id] = true;
          // this.$router.go();
          // console.log(this.eventStatus[1])
          localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
          // console.log(localStorage.getItem("eventStatus"));
        }
        location.reload();
      } catch (error) {
        console.error(error);
      } finally {
        this.isStarting = false;
      }
    },
    showModal() {
      this.visible = true;
    },
    showSuccessModal(record) {
      console.log(record);
      Modal.success({
        title: "Event Registration",
        content: (
          <div>
            <p>Enter Registration Code to Register</p>
            <Input
              id="regCode"
              v-model={this.eventCode}
              placeholder="Enter Registration code"
            />
          </div>
        ),
        okText: "Register",
        onOk: async () => {
          try {
            const userRegCode = document.getElementById("regCode").value;
            console.log(userRegCode);

            const response = await axios.get(
              `${process.env.VUE_APP_BASE_URL}/event/${record}/participant/${userRegCode}/assign`,
              { headers: authHeader() }
            );
            // console.log(record);
            // localStorage.setItem("eventCode", record);
            if (response.status !== 200) {
              throw new Error("Failed to Register Participant to event");
            } else {
              console.log("Participant Registered");
            }

            // Show success message
            Modal.success({
              title: "Success",
              content: "You have been registered for the event",
            });
          } catch (error) {
            Modal.error({
              title: "Error",
              content: error.message,
            });
          }
        },
        style: {
          float: "center",
          display: "grid",
          placeContent: "center",
        },
      });
    },

    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.colorVisible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
      this.colorVisible = false;
    },
    changeType(type) {
      this.modalType = type;
    },
    success() {
      Modal.success({
        title: "This is a success message",
        // JSX support
        content: (
          <div>
            <p>some messages...some messages...</p>
          </div>
        ),
      });
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

    const API_URL = `${process.env.VUE_APP_BASE_URL}/events/all`;

    console.log(API_URL);

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    async () => {
      try {
        // Validate the event code
        const { data } = await axios.get(
          `${API_URL}?event_code=${ eventCode.value }`
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

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

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
      dataSource,
      columns,
      formState,
    };
  },
});

export default ViewPage;
</script>

<style>
.badge-green {
  background-color: #1EC997;
  color: white;
  padding: 4px;
  border-radius: 3px;
}
</style>