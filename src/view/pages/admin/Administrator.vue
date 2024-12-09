<template>
  <div style="background-color: #121212; min-height: 100vh; color: #ffffff">
    <sdPageHeader
      ghost
      title="Administrator"
      style="background-color: #1f1f1f; color: #ffffff"
    >
      <template #buttons></template>
    </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <div
          style="background-color: #1f1f1f; padding: 20px; border-radius: 8px"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-card
                title="Event OTPs"
                :bordered="true"
                style="
                  background-color: #2b2b2b;
                  color: #ffffff;
                  border-color: #3a3a3a;
                "
              >
                <sdButton
                  size="extra-small"
                  type="success"
                  style="background-color: #1ec997; color: #ffffff"
                >
                  <router-link
                    :to="{ path: `/view/admin-events/` }"
                    style="color: #ffffff"
                  >
                    View Data
                  </router-link>
                </sdButton>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card
                title="Sub County Events"
                :bordered="true"
                style="
                  background-color: #2b2b2b;
                  color: #ffffff;
                  border-color: #3a3a3a;
                "
              >
                <sdButton
                  size="extra-small"
                  type="success"
                  style="background-color: #1ec997; color: #ffffff"
                >
                  <router-link
                    :to="{ path: `/admin/subcounty-hh-reg` }"
                    style="color: #ffffff"
                  >
                    View Data
                  </router-link>
                </sdButton>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card
                title="Transactions Report"
                :bordered="true"
                style="
                  background-color: #2b2b2b;
                  color: #ffffff;
                  border-color: #3a3a3a;
                "
              >
                <sdButton
                  size="extra-small"
                  type="success"
                  style="background-color: #1ec997; color: #ffffff"
                >
                  <router-link
                    :to="{ path: `/admin/transaction-reports` }"
                    style="color: #ffffff"
                  >
                    View Data
                  </router-link>
                </sdButton>
              </a-card>
            </a-col>
          </a-row>
          <br />
          <br />
          <br />
          <sdPageHeader
            ghost
            title="SMS Settings"
            style="
              background-color: #1f1f1f;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 40px;
            "
          >
          </sdPageHeader>
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
                    <a-table
                      :pagination="false"
                      :dataSource="dataSource"
                      :columns="columns"
                    >
                      <template #action="{ record }">
                        <td :style="{ 'margin-left': '3px' }">
                          <div class="table-actions">
                            <sdButton
                              type="success"
                              size="extra-small"
                              @click="handleToggle(record)"
                              >Toggle Provider</sdButton
                            >
                            &nbsp;&nbsp;
                            <a-modal
                              title="Toggle SMS Prodivider"
                              :visible="isModalOpen"
                              @cancel="handleCancel"
                              class="title-success"
                            >
                              <div>
                                <p>
                                  Are you sure you want to toggle the service
                                  <b>{{ service.service_label }}</b> from
                                  <b>{{ service.sms_provider }}</b>
                                </p>
                              </div>
                              <template v-slot:footer>
                                <a-button @click="handleCancel()" type="danger"
                                  >Close</a-button
                                >
                                <a-button
                                  @click="handleOk()"
                                  type="success"
                                  :disabled="isPaying"
                                  >{{
                                    isLoading
                                      ? "Loading..."
                                      : isPaying
                                      ? "Processing Payment..."
                                      : "Confirm"
                                  }}</a-button
                                >
                              </template>
                            </a-modal>
                          </div>
                        </td>
                      </template>
                    </a-table>
                    <br />
                    <br />
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
            <a-modal
              title="Payment OTP"
              :visible="isModalOpen"
              @cancel="handleCancel"
              class="title-success"
            >
              <div>
                <p>Enter payment OTP</p>
                <input type="number" v-model="inputValue" />
                <br />
                <br />
                <sdButton
                  type="success"
                  size="extra-small"
                  @click="resendOTP()"
                  :disabled="isDisabled"
                >
                  Resend OTP
                  {{ countdown > 0 ? "(" + countdown + "s)" : "" }}
                </sdButton>
              </div>
              <template v-slot:footer>
                <a-button
                  @click="handleOk(recordId, inputValue)"
                  type="success"
                  :disabled="isPaying"
                  >{{
                    isLoading
                      ? "Loading..."
                      : isPaying
                      ? "Processing Payment..."
                      : "Pay"
                  }}</a-button
                >
                <a-button @click="handleCancel()" type="danger">Close</a-button>
              </template>
            </a-modal>
          </a-row>
        </div>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Service",
    dataIndex: "service_label",
    key: "id",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "id",
  },
  {
    title: "Provider Name",
    dataIndex: "sms_provider",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "action",
    slots: { customRender: "action" },
  },
];
export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    SearchResultWrapper,
  },
  data() {
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      payroll: [],
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
    const activeClass = ref("all");
    const searchItem = ref("");
    const logs = ref([]);
    const isModalOpen = ref(false);
    const service = ref("");
    const service_id = ref(0);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/get_sms_settings`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    // const tableData = ref([]);

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          logs.value = response.data.data.map((item) => ({
            id: item.id,
            service_label: item.service_label,
            description: item.description,
            sms_provider:
              item.sms_provider_id === 1 ? "Advanta" : "Africa's Talking",
          }));
          console.log(logs.value);
          dataSource.value = logs.value;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const handleToggle = (record) => {
      console.log(record);
      isModalOpen.value = true;
      service.value = record;
      service_id.value = record.id;
    };

    const handleOk = async () => {
      console.log("Toggling service init...");
      console.log(
        `${process.env.VUE_APP_BASE_URL}/toggle_sms_provider/${service_id.value}`
      );

      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/toggle_sms_provider/${service_id.value}`,
          {
            method: "GET",
            headers: {
              ...authHeader(), // Include authHeader
              "Content-Type": "application/json", // If required for your API
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          if (data.success == true) {
            notification.success({
              message: "Success",
              description: data.message,
            });
            setTimeout(() => {
              location.reload();
            }, 3000);
          } else {
            notification.error({
              message: "Error",
              description: data.message,
            });
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);

        notification.error({
          message: "Error",
          description: "Payment failed",
        });
      } finally {
        isModalOpen.value = false;
      }
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      handleChange,
      isModalOpen,
      activeClass,
      handleToggle,
      handleCancel,
      service,
      handleOk,
    };
  },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>

<style scoped>
/* General page styling */
body {
  background-color: #121212;
  color: #ffffff;
}

/* Card styles */
a-card {
  transition: all 0.3s ease;
}

a-card:hover {
  background-color: #353535;
}

/* Buttons */
.sdButton {
  border-radius: 4px;
}

.sdButton:hover {
  background-color: #17a07d;
  color: #ffffff;
}

/* Headers */
sdPageHeader {
  border-bottom: 1px solid #2b2b2b;
}

/* Links */
a {
  color: #1ec997;
  text-decoration: none;
}

a:hover {
  color: #17a07d;
}

/* Table adjustments */
.ant-table {
  background-color: #1f1f1f;
  border-color: #3a3a3a;
}

.ant-table-thead > tr > th {
  background-color: #2b2b2b;
  color: #ffffff;
}

.ant-table-tbody > tr > td {
  background-color: #121212;
  color: #ffffff;
}
</style>
