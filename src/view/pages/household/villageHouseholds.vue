<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> {{ village_name }} Households
            </h3>
            <div class="ou-crumb">
              <span class="crumb-link" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="12" /> Villages
              </span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ village_name }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Households</span>
            </div>
          </div>
          <div class="ph-actions">
            <div class="ou-search">
              <span class="search-icon">
                <sdFeatherIcons type="search" size="14" />
              </span>
              <a-input
                v-model:value="searchItem"
                type="text"
                name="dataSource"
                placeholder="Search by name or phone..."
                allow-clear
              />
            </div>
            <div class="ou-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Summary strip -->
        <section class="panel ou-stats">
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="home" size="16" /></span>
            <div>
              <span class="val">{{ summary.total }}</span>
              <span class="lbl">Households</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="users" size="16" /></span>
            <div>
              <span class="val">{{ summary.total_members }}</span>
              <span class="lbl">Total HH Members</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="check-circle" size="16" /></span>
            <div>
              <span class="val">{{ summary.chp_count }}</span>
              <span class="lbl">CHPs</span>
            </div>
          </div>
        </section>

        <!-- Households list -->
        <section class="panel ou-list-panel">
          <div v-if="isLoading" class="ou-loading">
            <a-spin />
          </div>

          <div v-else>
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ou-table-shell"
            >
              <a-table
                :pagination="{ pageSize: 50, showSizeChanger: true }"
                :dataSource="dataSource"
                :columns="columns"
                row-key="id"
              >
                <template #households="{ record }">
                  <td :style="{ 'margin-left': '3px' }">
                    <div class="table-actions">
                      <sdButton
                        type="primary"
                        size="extra-small"
                        class="ou-action-btn"
                        @click="handleVerify(record.id, record.hh_size)"
                      >
                        <sdFeatherIcons type="check" size="12" />
                        Verify
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
            <div v-else class="ou-card-list">
              <article
                v-for="record in dataSource"
                :key="record.id"
                class="ou-card"
              >
                <div class="ou-card-head">
                  <div class="ou-card-title">
                    {{ record.first_name }} {{ record.last_name }}
                  </div>
                  <span class="ou-chip">
                    {{ record.hh_size }} member(s)
                  </span>
                </div>
                <div class="ou-card-meta">
                  <div>
                    <span class="lbl">Phone</span>
                    <span class="val">{{ record.phone_no || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Post</span>
                    <span class="val">{{ record.post_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">CHP</span>
                    <span class="val">{{ record.chw_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">CHP Phone</span>
                    <span class="val">{{ record.chw_phone_no || "—" }}</span>
                  </div>
                </div>
                <div class="ou-card-actions">
                  <sdButton
                    type="primary"
                    size="extra-small"
                    class="ou-action-btn"
                    @click="handleVerify(record.id, record.hh_size)"
                  >
                    <sdFeatherIcons type="check" size="12" /> Verify
                  </sdButton>
                </div>
              </article>
              <div v-if="!dataSource.length" class="ou-empty">
                No households found in this village.
              </div>
            </div>
          </div>
        </section>

        <!-- HouseHold Size Validation modal -->
        <a-modal
          title="HouseHold Size Validation"
          :visible="isModalOpen"
          @ok="handleOk(recordId, inputValue)"
          @cancel="handleCancel"
          class="title-success"
        >
          <div>
            <h4>HouseHold Size Verification</h4>
            <p>HH Size: {{ inputValue }}</p>
            <input type="number" v-model="inputValue" />
          </div>
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { computed, onMounted, ref, defineComponent, watchEffect } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";

const columns = [
  {
    title: "First name",
    dataIndex: "first_name",
    key: "id_no",
  },
  {
    title: "Last name",
    dataIndex: "last_name",
    key: "id_no",
  },
  {
    title: "Phone number",
    dataIndex: "phone_no",
    key: "id_no",
  },
  {
    title: "Distribution Post",
    dataIndex: "post_id",
    key: "id_no",
  },
  {
    title: "Household size",
    dataIndex: "hh_size",
    key: "id_no",
  },
  {
    title: "CHP",
    dataIndex: "chw_id",
    key: "id_no",
  },
  {
    title: "CHP Phone Number",
    dataIndex: "chw_phone_no",
    key: "id_no",
  },
  {
    title: "Timestamp",
    dataIndex: "created_at_time",
    key: "id_no",
  },
];
export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    TableWrapper,
    RecordViewWrapper,
    BudgetPageWrapper,
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
    const activeClass = ref("all");
    const searchItem = ref("");
    const logs = ref([]);
    const { query } = useRoute();
    const router = useRouter();
    const viewMode = ref(
      typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
    );
    const goBack = () => {
      // History-aware; when the page is opened directly we fall back to the
      // originating sub-location (passed as org_id from the villages page) or
      // to the administrative-units root.
      if (window.history.state?.back) {
        router.back();
      } else if (query.org_id) {
        router.push({ path: `/org-units/villages/${query.org_id}` });
      } else {
        router.push({ path: "/org-units/view" });
      }
    };
    const summary = ref({
      total: 0,
      total_members: 0,
      chp_count: 0,
    });
    const inputValue = ref("");
    const household_id = ref("");
    const isModalOpen = ref(false);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/village_hh?village_id=${query.id}`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    const village_name = query.name;

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          summary.value = response.data.summary || {
            total: 0,
            total_members: 0,
            chp_count: 0,
          };
          logs.value = response.data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
          dataSource.value = logs.value;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    watchEffect(async () => {
      const query = searchItem.value.toLowerCase();
      try {
        if (!query) {
          dataSource.value = logs.value;
          return dataSource.value;
        }
        if (query.length > 3) {
          const response = await fetch(`${API_URL}/search?query=${query}`, {
            method: "GET",
            headers: authHeader(),
          });
          const data = await response.json();
          dataSource.value = data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    });

    const handleVerify = (hh_id, hh_size) => {
      console.log({ hh_id, hh_size });
      inputValue.value = hh_size;
      isModalOpen.value = true;
      household_id.value = hh_id;
    };

    const handleOk = async (id, inputValue) => {
      try {
        const house_id = household_id.value;

        // Call the authHeader() function to get the authorization token
        const headers = authHeader();

        // Construct the URL
        const url = `${process.env.VUE_APP_BASE_URL}/verify_household?house_id=${house_id}&inputValue=${inputValue}`;

        // Make the fetch request
        fetch(url, {
          method: "PATCH",
          headers: {
            ...headers,
            "Content-Type": "application/json", // Add any necessary headers
          },
          // body: JSON.stringify(data), // If you need to send a request body, add it here
        })
          .then((response) => {
            if (response.ok) {
              return response.json(); // Parse the JSON response
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            console.log(data); // Handle the successful response data here
            notification["success"]({
              message: "HouseHold Verified",
              description: `HouseHold has been verified successfully`,
              duration: 5.5,
            });
            // location.reload();
          })
          .catch((error) => {
            // Handle errors here
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
            notification["error"]({
              message: "HouseHold Not Verified",
              description: `HouseHold verification failed`,
              duration: 5.5,
            });
          })
          .finally(() => {
            inputValue = ""; // Clear inputValue after the modal is closed
            isModalOpen.value = false;
          });
      } catch (error) {
        // Handle exceptions here
        console.error("Error:", error);
      }
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      viewMode,
      goBack,
      summary,
      columns,
      handleChange,
      activeClass,
      handleVerify,
      handleOk,
      isModalOpen,
      village_name,
    };
  },
  props: {
    recordId: Number,
    hh_size: Number,
  },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>
