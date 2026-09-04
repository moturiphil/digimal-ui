<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ac-pending-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Activities Pending Approval
            </h3>
            <p class="ph-subtitle">
              Review the field activities awaiting approval in your area and
              approve the ones ready to run.
            </p>
          </div>
          <div class="ph-actions">
            <div class="ac-search">
              <span class="search-icon">
                <sdFeatherIcons type="search" size="14" />
              </span>
              <a-input
                v-model:value="searchItem"
                type="text"
                name="dataSource"
                placeholder="Search by name or activity code"
                allow-clear
              />
            </div>
            <div class="ac-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="ac-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="ac-toggle-btn"
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
              v-model:value="countyFilter"
              allow-clear
              placeholder="Filter by County"
              :options="countyOptions"
              :loading="countiesLoading"
              @change="handleFilterChange"
            ></a-select>
          </div>
        </section>

        <!-- Activities list -->
        <section class="panel activities-panel">
          <div v-if="isLoading" class="ac-loading">
            <a-spin />
          </div>

          <div v-else>
            <!-- Table view -->
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ac-table-shell"
            >
              <a-table
                :pagination="false"
                :dataSource="filteredActivities"
                :columns="columns"
                row-key="id"
              >
                <template #status="{ record }">
                  <td>
                    <span class="ac-status-chip pending">
                      {{ record.status_label }}
                    </span>
                  </td>
                </template>
                <template #county="{ record }">
                  <td>{{ record.county_id || "—" }}</td>
                </template>
                <template #sub_county="{ record }">
                  <td>{{ record.sub_county_id || "—" }}</td>
                </template>
                <template #actions="{ record }">
                  <td>
                    <div class="table-actions ac-actions">
                      <sdButton
                        size="extra-small"
                        type="primary"
                        class="ac-action-btn"
                      >
                        <router-link :to="detailsLink(record)">
                          <sdFeatherIcons type="eye" size="12" />
                          Activity Details
                        </router-link>
                      </sdButton>
                      <sdButton
                        v-if="!record.status"
                        size="extra-small"
                        type="success"
                        class="ac-action-btn"
                        :disabled="approvingId === record.id"
                        @click="openApproveModal(record)"
                      >
                        <sdFeatherIcons type="check" size="12" /> Approve
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
<!-- Card view -->
            <div v-else class="ac-card-list">
              <article
                v-for="record in filteredActivities"
                :key="record.id"
                class="ac-card"
              >
                <div class="ac-card-head">
                  <div class="ac-card-title">{{ record.name }}</div>
                  <span class="ac-card-code">{{ record.activity_code }}</span>
                </div>
                <div class="ac-card-meta">
                  <div>
                    <span class="lbl">Start Date</span>
                    <span class="val">{{ record.start_date || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Status</span>
                    <span class="val">
                      <span class="ac-status-chip pending">
                        {{ record.status_label }}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span class="lbl">County</span>
                    <span class="val">{{ record.county_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Sub County</span>
                    <span class="val">{{ record.sub_county_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Officers / Days</span>
                    <span class="val">
                      {{ record.number_of_officers }} / {{ record.number_of_days }}
                    </span>
                  </div>
                </div>
                <div class="ac-card-actions">
                  <sdButton
                    size="extra-small"
                    type="primary"
                    class="ac-action-btn"
                  >
                    <router-link :to="detailsLink(record)">
                      <sdFeatherIcons type="eye" size="12" />
                      Activity Details
                    </router-link>
                  </sdButton>
                  <sdButton
                    v-if="!record.status"
                    size="extra-small"
                    type="success"
                    class="ac-action-btn"
                    :disabled="approvingId === record.id"
                    @click="openApproveModal(record)"
                  >
                    <sdFeatherIcons type="check" size="12" /> Approve
                  </sdButton>
                </div>
              </article>
              <div v-if="!filteredActivities.length" class="ac-empty">
                No activities found.
              </div>
            </div>

            <div class="ac-pagination">
              <a-pagination
                :current="currentPage"
                :total="displayTotal"
                :pageSize="pageSize"
                :showSizeChanger="true"
                @change="onPageChange($event)"
              />
            </div>
          </div>
        </section>

        <!-- Approve activity modal -->
        <a-modal
          title="Approve Activity"
          :visible="isApproveModalOpen"
          @ok="confirmApprove"
          @cancel="isApproveModalOpen = false"
          class="title-success"
        >
          <div>
            <p>
              Approve <b>{{ activeActivity.name }}</b
              > ({{ activeActivity.activity_code }})? Once approved it will appear
              on the main activities list.
            </p>
          </div>
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import axios from "@/Axiosconfig";
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main } from "../../styled";
import { computed, onMounted, ref, watch } from "vue";
import { notification } from "ant-design-vue";

const columns = [
  { title: "Activity Name", dataIndex: "name", key: "id" },
  { title: "Activity Code", dataIndex: "activity_code", key: "id" },
  { title: "Start Date", dataIndex: "start_date", key: "id" },
  { title: "No. of Officers", dataIndex: "number_of_officers", key: "id" },
  { title: "No. of Days", dataIndex: "number_of_days", key: "id" },
  {
    title: "Status",
    dataIndex: "status_label",
    key: "status",
    slots: { customRender: "status" },
  },
  {
    title: "County",
    dataIndex: "county_id",
    key: "county",
    slots: { customRender: "county" },
  },
  {
    title: "Sub County",
    dataIndex: "sub_county_id",
    key: "sub_county",
    slots: { customRender: "sub_county" },
  },
  {
    title: "",
    dataIndex: "",
    key: "actions",
    fixed: "right",
    width: 220,
    slots: { customRender: "actions" },
  },
];

const isLoading = ref(true);
const dataSource = ref([]);
const searchItem = ref("");
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);

// filters
const countyFilter = ref(null);
const countyOptions = ref([]);
const countiesLoading = ref(false);

const currentPage = ref(1);
const pageSize = ref(100);
const datatotal = ref(0);

const detailsLink = (record) => ({
  path: `/activity/pending-approval-details/${record.id}`,
  query: {
    id: record.id,
    name: record.name,
    code: record.activity_code,
  },
});

const formatPendingActivity = (item) => {
  const countyName =
    Array.isArray(item.county_id) && item.county_id.length
      ? item.county_id.map((c) => c.name).join(", ")
      : "N/A";
  const subCountyName =
    Array.isArray(item.sub_county_id) && item.sub_county_id.length
      ? item.sub_county_id.map((s) => s.name).join(", ")
      : "N/A";
  return {
    ...item,
    county_id: countyName,
    sub_county_id: subCountyName,
    status_label: "Pending Approval",
  };
};

// Client-side search (the pending-approval endpoint has no query param).
const filteredActivities = computed(() => {
  const q = searchItem.value.trim().toLowerCase();
  if (!q) return dataSource.value;
  return dataSource.value.filter(
    (a) =>
      String(a.name || "").toLowerCase().includes(q) ||
      String(a.activity_code || "").toLowerCase().includes(q)
  );
});

const displayTotal = computed(() =>
  searchItem.value.trim() ? filteredActivities.value.length : datatotal.value
);

const fetchActivities = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams();
    params.append("page", currentPage.value);
    if (countyFilter.value != null && countyFilter.value !== "")
      params.append("county", countyFilter.value);
    const res = await axios.get(`activities_pending_approval?${params.toString()}`);
    const paginator = res.data?.data || {};
    const rows = Array.isArray(paginator.data) ? paginator.data : [];
    dataSource.value = rows.map(formatPendingActivity);
    datatotal.value = paginator.total || rows.length;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCounties = async () => {
  countiesLoading.value = true;
  try {
    const res = await axios.get("get_counties");
    const json = res.data;
    const list = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
    countyOptions.value = list.map((c) => ({ value: c.id, label: c.name }));
  } catch (error) {
    console.error(error);
    countyOptions.value = [];
  } finally {
    countiesLoading.value = false;
  }
};

const onPageChange = (page) => {
  currentPage.value = page;
  fetchActivities();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  fetchActivities();
};

watch(
  () => searchItem.value,
  () => {
    currentPage.value = 1;
    fetchActivities();
  }
);

// ── Approve workflow ──
const activeActivity = ref({});
const isApproveModalOpen = ref(false);
const approvingId = ref(null);

const openApproveModal = (record) => {
  activeActivity.value = record;
  isApproveModalOpen.value = true;
};

const confirmApprove = async () => {
  const record = activeActivity.value;
  if (!record || !record.id) return;
  approvingId.value = record.id;
  try {
    const res = await axios.post(`approve_activity/${record.id}`);
    const json = res.data;
    if (json.success === true) {
      notification.success({
        message: "Success",
        description: json.message,
      });
      isApproveModalOpen.value = false;
      fetchActivities();
    } else {
      notification.error({
        message: "Error",
        description: json.message || "Unable to approve activity.",
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.message ||
        "Unable to approve activity. Please try again.",
    });
  } finally {
    approvingId.value = null;
  }
};

onMounted(() => {
  fetchActivities();
  fetchCounties();
});
</script>
<style lang="less" scoped>
.ac-activities-page,
.ac-pending-page {
  .ac-search {
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

  .ac-view-toggle {
    display: inline-flex;
    background: #f0f7f3;
    border: 1px solid #d9f0e2;
    border-radius: 22px;
    padding: 3px;
    gap: 2px;
    .ac-toggle-btn {
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
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    :deep(.ant-select) {
      width: 100%;
    }
  }

  .activities-panel {
    padding: 10px;
  }

  .ac-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  /* status / payroll chip */
  .ac-status-chip {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    border-radius: 10px;
    padding: 2px 10px;
    &.pending {
      background: #fff4e0;
      color: #b45309;
      border: 1px solid #fcd9a0;
    }
    &.generated {
      background: #e0ecff;
      color: #1d4ed8;
      border: 1px solid #b3ccff;
    }
    &.paid {
      background: #daf4e4;
      color: #15693c;
      border: 1px solid #9ad8b4;
    }
  }

  /* table */
  .ac-table-shell {
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

  /* uniform action buttons */
  :deep(.ac-action-btn.ant-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    box-shadow: none;
    transition: transform 0.12s ease, box-shadow 0.15s ease;
    a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: inherit;
    }
    &:hover:not([disabled]) {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(15, 105, 60, 0.15);
    }
    svg {
      flex-shrink: 0;
    }
  }
  :deep(.ac-action-btn.ant-btn-primary) {
    background: #2c99ff;
    border-color: #2c99ff;
    color: #fff;
    &:hover:not([disabled]) {
      background: #1a86ec;
      border-color: #1a86ec;
    }
  }
  :deep(.ac-action-btn.ant-btn-success) {
    background: #16a34a;
    border-color: #16a34a;
    color: #fff;
    &:hover:not([disabled]) {
      background: #15803d;
      border-color: #15803d;
    }
  }
/* card list */
  .ac-card-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4px;
  }

  .ac-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }

  .ac-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .ac-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.3;
  }

  .ac-card-code {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    color: #2f6746;
    background: #daf4e4;
    border: 1px solid #9ad8b4;
    border-radius: 12px;
    padding: 2px 10px;
  }

  .ac-card-meta {
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

  .ac-card-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px dashed #e1efe6;
    :deep(a) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }
  }

  @media (max-width: 480px) {
    .ac-card-actions {
      flex-direction: column;
      align-items: stretch;
      :deep(.ac-action-btn.ant-btn) {
        width: 100%;
      }
    }
  }

  .ac-empty {
    text-align: center;
    padding: 40px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  .ac-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 14px 8px 6px;
  }

  /* mobile tweaks */
  @media (max-width: 991px) {
    .ph-actions {
      width: 100%;
    }
    .ac-pagination {
      justify-content: center;
    }
  }

  @media (max-width: 575px) {
    .ac-search,
    .ac-view-toggle {
      width: 100%;
    }
    .ac-view-toggle {
      justify-content: center;
    }
    .filter-grid {
      grid-template-columns: 1fr;
    }
    .ac-card-meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>