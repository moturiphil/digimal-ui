<template>
  <div>
    <sdPageHeader ghost :title="`${event_name} Activity`" />
    <Main>
      <div class="button-container">
        <sdButton
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
                : "Generate Payroll"
          }}
        </sdButton>
        <!-- &nbsp;
        <sdButton
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
        <sdButton
          class="btn-import"
          type="success"
          @click="exportParticipants"
          size="small"
        >
          Download List &nbsp; &nbsp;
          <sdFeatherIcons type="download-cloud" size="extra-small" />
        </sdButton>
        &nbsp;&nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="sendInvites"
          size="small"
        >
          Send Invites &nbsp; &nbsp;
          <sdFeatherIcons type="mail" size="extra-small" />
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
                                  >
                                    <span> Remove Officer </span>
                                    <sdFeatherIcons
                                      type="x-circle"
                                      size="small"
                                    />
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
                @cancel="handleCancelReceive"
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
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./style";
import { computed, onMounted, ref, defineComponent, reactive } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute } from "vue-router";
import store from "../../../vuex/store";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "fullName",
    key: "id",
    // render: (text, record) => `${record.first_name} ${record.last_name}`,
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
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
    key: "activity",
    slots: { customRender: "activity" },
  },
];
export default defineComponent({
  name: "Events Participants",
  components: {
    Main,
    SearchResultWrapper,
  },
  computed: {
    recordCount() {
      return this.dataSource.length;
    },
    confirmedCount() {
      return this.confirmed.length;
    },
    pendingCount() {
      return this.pending.length;
    },
  },
  data() {
    const { query } = useRoute();
    const created_by = query.created_by;
    const event_name = query.name;
    // const event_id = query.id;
    console.log(created_by);
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      households: [],
      event_name,
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
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const confirmed = ref({});
    const pending = ref([]);
    const officers = ref([]);
    const activeClass = ref("all");
    const { query } = useRoute();
    const isGenerating = computed(() => state.isGenerating);

    const isModalOpen = ref(false);

    console.log(query.id);

    const activity_code = query.code;

    console.log(new Date());

    // const API_URL = `${process.env.VUE_APP_BASE_URL}/events/${query.event_code}/participants`; // activity_invited_officers
    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_invited_officers?activity_id=${query.id}`;
    const BASE_URL = `${process.env.VUE_APP_BASE_URL}`;
    // const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${query.event_code}`;
    const export_participants_url = `${process.env.VUE_APP_BASE_URL}/activity_participants_export?activity_code=${query.code}`;

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
        const response = await fetch(
          `${BASE_URL}/resend_activity_confirmation_reminder/${query.id}/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
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

    const removeOfficer = (id) => {
      //   console.log("recordId", recordId.value);

      try {
        fetch(
          `${BASE_URL}/deassign_activity_facilitator?activity_id=${query.id}&user_id=${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
          .then(({ success, message }) => {
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
          .catch((message) => {
            notification.error({
              message: "Error",
              description: `${message}`,
            });
          });
      } catch (message) {
        notification.error({
          message: "Error",
          description: `${message}`,
        });
      }
    };

    const handleOk = async (id, inputValue) => {
      try {
        console.log(inputValue);
      } finally {
        console.log(inputValue);
        inputValue = ""; // Clear inputValue after the modal is closed
        isModalOpen.value = true;
      }
    };

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
          return {
            ...record,
            fullName,
          };
        });

        console.log(updatedData);

        dataSource.value = updatedData;
      } catch (error) {
        console.error(error);
      }
      try {
        const response = await axios.get(
          `${BASE_URL}/activity_participants?activity_id=${activity_code}&confirmed=1`,
          {
            headers: authHeader(),
          }
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
          `${BASE_URL}/activity_participants?activity_id=${activity_code}&confirmed=0`,
          {
            headers: authHeader(),
          }
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
        console.log(query.id);
        await fetch(
          `${process.env.VUE_APP_BASE_URL}/notify_activity_participants/${query.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
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
        await fetch(`${process.env.VUE_APP_BASE_URL}/add_officers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
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
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/activity_officers`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();

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
      if (user.user.role_id === 53 || user.user.role_id === 63 || user.user.role_id === 4 || user.user.role_id === 59) {
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
      try {
        const response = await fetch(
          `${BASE_URL}/generate_pay_roll?activity_code=${query.code}&confirmed=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        );
        console.log(response);
        if (response.status == 200) {
          store.commit("setIsGenerating", true);
          Modal.success({
            title: "Success",
            content: "Payroll Generated Successfully",
          });
        } else {
          store.commit("setIsGenerating", true);
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

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      confirmed,
      pending,
      columns,
      filteredData,
      handleChange,
      activeClass,
      generatePayroll,
      exportParticipants,
      isApprovedGenerator,
      isModalOpen,
      handleOk,
      isGenerating,
      openModal,
      handleCancel,
      officers,
      handleAddOfficers,
      formState,
      isCreator,
      resendSMS,
      removeOfficer,
      sendInvites,
    };
  },
  // computed: {
  // },
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
