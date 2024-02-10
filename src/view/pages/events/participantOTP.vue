<template>
    <div>
      <sdPageHeader ghost :title="`${event_name} Event`" />
      <Main>
        <div class="button-container">
        </div>
  
        <SearchResultWrapper>
          <a-row :gutter="25">
            <a-col :xs="24">
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
  
  <script>
  import { Main } from "../../styled";
  import { SearchResultWrapper } from "./style";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  import authHeader from "../../../services/auth-header";
  import axios from "axios";
  import { useStore } from "vuex";
  import { Modal } from "ant-design-vue";
  import { useRoute, useRouter } from "vue-router";
  import store from "../../../vuex/store";
  
  const columns = [
    {
      title: "Participant Name",
      dataIndex: "participant",
      key: "id",
      // render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Participant Phone",
      dataIndex: "participant_phone",
      key: "id",
    },
    {
      title: "Participant Id No",
      dataIndex: "participant_id_no",
      key: "id",
    },
    {
      title: "Registration Date",
      dataIndex: "registration_date",
      key: "id",
    },
    {
      title: "Confirmed By",
      dataIndex: "confirmed_by",
      key: "id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "id",
    },
    {
      title: "Registration Code",
      dataIndex: "otp",
      key: "id",
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
  
      const event_name = query.name;
      // const event_id = query.id;
      const event_code = query.event_code;
      console.log(event_code);
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
      handleCancel() {
        this.isModalOpen = false;
        this.visible = false;
        this.colorVisible = false;
      },
    },
    setup() {
      const { state } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
      const confirmed = ref([]);
      const pending = ref([]);
      const activeClass = ref("all");
      const { query } = useRoute();
      const isGenerating = computed(() => state.isGenerating);
  
      const isModalOpen = ref(false);
  
      console.log(query.id);
  
      const eventEndDate = query.eventEndDate;
  
      const formattedEndDate = new Date(eventEndDate);
  
      console.log(formattedEndDate);
  
      console.log(new Date());
  
      console.log(new Date() >= eventEndDate);
  
      const API_URL = `${process.env.VUE_APP_BASE_URL}/event_participant_otp?event_id=${query.id}`;
      const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${query.event_code}`;
      const export_participants_url = `${process.env.VUE_APP_BASE_URL}/event_participants_export?event_code=${query.event_code}`;
  
      const generatePayroll = async () => {
        store.commit("setIsGenerating", true);
        try {
          const response = await fetch(genetatePayrollURL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          });
          console.log(response.status == 200);
          if (response.status == 200) {
            store.commit("setIsGenerating", true);
            Modal.success({
              title: "Success",
              content: "Payroll Generated Successfully",
            });
            await new Promise((resolve) => {
              setTimeout(resolve, 4000); // Wait for 4 seconds (adjust the time as needed)
            });
            location.reload();
          } else {
            store.commit("setIsGenerating", true);
            Modal.error({
              title: "Error",
              content:
                "Something went wrong, ensure you have assigned payroll matrix to the event",
            });
            await new Promise((resolve) => {
              setTimeout(resolve, 4000); // Wait for 4 seconds (adjust the time as needed)
            });
            location.reload();
          }
        } catch (error) {
          store.commit("setIsGenerating", true);
          console.error(error);
          await new Promise((resolve) => {
            setTimeout(resolve, 4000); // Wait for 4 seconds (adjust the time as needed)
          });
          location.reload();
        }
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
  
          dataSource.value = response.data.data;
  
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
  
      const formState = reactive({
        searchItem: "",
      });
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
          user.user.role_id === 53 ||  user.user.role_id === 63 ||  user.user.role_id === 64 
        ) {
          return true;
        } else {
          return false;
        }
      });
  
      return {
        crud,
        isLoading,
        selectedRowKeys,
        dataSource,
        confirmed,
        pending,
        columns,
        formState,
        filteredData,
        handleChange,
        activeClass,
        generatePayroll,
        exportParticipants,
        isApprovedGenerator,
        isModalOpen,
        handleOk,
        isGenerating,
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
  