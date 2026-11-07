<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ac-activities-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> MassNet Activities
            </h3>
            <p class="ph-subtitle">
              All approved field activities in one place — open an activity to
              manage officers, participants and payroll.
            </p>
            <span v-if="scopeLabel" class="ac-scope-chip">
              <sdFeatherIcons type="map-pin" size="12" />
              {{ scopeLabel }}
            </span>
          </div>
          <div class="ph-actions">
            <router-link
              v-if="canCreateActivity"
              to="/activities/activity-create"
              class="ac-create-btn"
            >
              <sdFeatherIcons type="plus" size="14" />
              Create Activity
            </router-link>
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
              v-model:value="fundingSource"
              placeholder="Funding Source"
              :options="funding_options"
              @change="handleFilterChange"
            ></a-select>
            <a-select
              v-model:value="campaignFilter"
              allow-clear
              show-search
              placeholder="Campaign"
              :options="campaignOptions"
              :filter-option="filterOption"
              :loading="campaignsLoading"
              @change="handleFilterChange"
            ></a-select>
            <a-select
              v-model:value="activityType"
              allow-clear
              show-search
              placeholder="Activity Type"
              :options="activityTypeOptions"
              :filter-option="filterOption"
              @change="handleFilterChange"
            ></a-select>
            <a-select
              v-model:value="payrollStatus"
              allow-clear
              placeholder="Activity Payroll Status"
              :options="payroll_status_options"
              @change="handleFilterChange"
            ></a-select>
            <a-select
              v-if="allowedLevels.includes('county')"
              v-model:value="countyFilter"
              allow-clear
              show-search
              :placeholder="countyPlaceholder"
              :options="countyOptions"
              :filter-option="filterOption"
              :loading="countiesLoading"
              :disabled="userLevelId === 2"
              @change="handleCountyChange"
            ></a-select>
            <a-select
              v-if="allowedLevels.includes('subcounty')"
              v-model:value="subCountyFilter"
              allow-clear
              show-search
              placeholder="Sub County"
              :options="subCountyOptions"
              :filter-option="filterOption"
              :loading="subCountiesLoading"
              @change="handleFilterChange"
            ></a-select>
          </div>

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
                :dataSource="dataSource"
                :columns="columns"
                row-key="id"
              >
                <template #payroll_status="{ record }">
                  <td>
                    <span
                      class="ac-status-chip"
                      :class="payrollChipClass(record.payroll_status)"
                    >
                      {{ record.payroll_status || "—" }}
                    </span>
                  </td>
                </template>
                <template #funding="{ record }">
                  <td>
                    <span
                      class="ac-fund-chip"
                      :class="fundingChipClass(record.funding_source, record.funding_id)"
                    >
                      {{ fundingLabel(record.funding_source, record.funding_id) }}
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
                          <sdFeatherIcons type="eye" size="12" /> Activity Details
                        </router-link>
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
<!-- Card view -->
            <div v-else class="ac-card-list">
              <article
                v-for="record in dataSource"
                :key="record.id"
                class="ac-card"
              >
                <div class="ac-card-head">
                  <div class="ac-card-title">{{ record.name }}</div>
                  <span class="ac-card-code">{{ record.activity_code }}</span>
                </div>
                <div class="ac-card-meta">
                  <div>
                    <span class="lbl">Funding</span>
                    <span class="val">
                      <span
                        class="ac-fund-chip"
                        :class="fundingChipClass(record.funding_source, record.funding_id)"
                      >
                        {{ fundingLabel(record.funding_source, record.funding_id) }}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span class="lbl">Start Date</span>
                    <span class="val">{{ record.start_date || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Payroll Status</span>
                    <span class="val">
                      <span
                        class="ac-status-chip"
                        :class="payrollChipClass(record.payroll_status)"
                      >
                        {{ record.payroll_status || "—" }}
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
                </div>
                <div class="ac-card-actions">
                  <sdButton
                    size="extra-small"
                    type="primary"
                    class="ac-action-btn"
                  >
                    <router-link :to="detailsLink(record)">
                      <sdFeatherIcons type="eye" size="12" /> Activity Details
                    </router-link>
                  </sdButton>
                </div>
              </article>
              <div v-if="!dataSource.length" class="ac-empty">
                No activities found.
              </div>
            </div>

            <div class="ac-pagination">
              <a-pagination
                :current="currentPage"
                :total="datatotal"
                :pageSize="pageSize"
                :showSizeChanger="true"
                @change="onPageChange($event)"
              />
            </div>
          </div>
        </section>
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

const columns = [
  { title: "Activity Name", dataIndex: "name", key: "id" },
  { title: "Activity Code", dataIndex: "activity_code", key: "id" },
  { title: "Start Date", dataIndex: "start_date", key: "id" },
  { title: "No. of Officers", dataIndex: "number_of_officers", key: "id" },
  { title: "No. of Days", dataIndex: "number_of_days", key: "id" },
  {
    title: "Funding",
    dataIndex: "funding_source",
    key: "funding",
    slots: { customRender: "funding" },
  },
  {
    title: "Payroll Status",
    dataIndex: "payroll_status",
    key: "payroll_status",
    slots: { customRender: "payroll_status" },
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
    width: 180,
    slots: { customRender: "actions" },
  },
];

const payroll_status_options = [
  { value: "2", label: "Pending Generation" },
  { value: "0", label: "Generated" },
  { value: "1", label: "Paid" },
];

const funding_options = [
  { value: "all", label: "All (GF + PMI)" },
  { value: "gf", label: "GF (Global Fund)" },
  { value: "pmi", label: "PMI" },
];

const isLoading = ref(true);
const dataSource = ref([]);
const searchItem = ref("");
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);

// filters
const fundingSource = ref("all");
const campaignFilter = ref(null);
const campaignOptions = ref([]);
const campaignsLoading = ref(false);
const activityType = ref(null);
const activityTypeOptions = ref([]);
const payrollStatus = ref(null);
const countyFilter = ref(null);
const countyOptions = ref([]);
const countiesLoading = ref(false);
const subCountyFilter = ref(null);
const subCountyOptions = ref([]);
const subCountiesLoading = ref(false);

const currentPage = ref(1);
const pageSize = ref(100);
const datatotal = ref(0);

// ── Role & location aware access ────────────────────────────────────────────
// The logged-in user lives in sessionStorage as { user: { level, location,
// role, level_id, location_id, role_id } }. We use it to scope the listing:
//   level 1 (national)   → filters for any county / sub-county
//   level 2 (county)     → pinned to their own county, may drill into sub-counties
//   level 3 (sub-county) → backend scopes data to their location, no pickers
let userSession = null;
try {
  userSession = JSON.parse(sessionStorage.getItem("user") || "null");
} catch (e) {
  userSession = null;
}
const profile = userSession?.user || userSession || {};
const userLevelId = Number(profile.level_id ?? profile.level?.id ?? 0);
const userLocationId = Number(profile.location_id ?? profile.location?.id ?? 0);
const userRoleName = profile.role?.name || "";
const userLocationName = profile.location?.name || "";

// Role-based access — the "Create Activity" shortcut is gated by the user's
// role NAME (stable key from the API roles table), not a hard-coded role id.
const canCreateActivity = computed(() => userRoleName === "Super Admin");

// Human readable scope shown in the page header, e.g. "Super Admin · Nairobi".
const scopeLabel = computed(() => {
  const parts = [];
  if (userRoleName) parts.push(userRoleName);
  if (userLevelId === 1) parts.push("National");
  else if (userLocationName) parts.push(userLocationName);
  return parts.join(" · ");
});

const allowedLevels = ref(["county", "subcounty"]);
const countyPlaceholder = userLevelId === 2 ? "Your County" : "County";

// Decide which location pickers are rendered based on the user's level.
const updateFilters = () => {
  if (userLevelId === 1) {
    allowedLevels.value = ["county", "subcounty"];
  } else if (userLevelId === 2) {
    // County users are pinned to their own county (the backend enforces the
    // same scope) but can still drill down into sub-counties below it.
    allowedLevels.value = ["county", "subcounty"];
    countyFilter.value = userLocationId || null;
    if (countyFilter.value) {
      countyOptions.value = [
        { value: countyFilter.value, label: userLocationName || "My County" },
      ];
    }
  } else {
    allowedLevels.value = [];
  }
};

// Load sub-counties that belong to the selected county (numeric org_units id).
const fetchSubCounties = async (countyId) => {
  subCountyOptions.value = [];
  if (!countyId) return;
  subCountiesLoading.value = true;
  try {
    const res = await axios.get("get_subcounties", {
      params: { county_id: countyId },
    });
    const json = res.data;
    const list = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
    subCountyOptions.value = list
      .filter((s) => s && s.id != null && s.name != null)
      .map((s) => ({ value: s.id, label: s.name }));
  } catch (error) {
    console.error(error);
    subCountyOptions.value = [];
  } finally {
    subCountiesLoading.value = false;
  }
};

const handleCountyChange = () => {
  subCountyFilter.value = null;
  subCountyOptions.value = [];
  if (countyFilter.value) fetchSubCounties(countyFilter.value);
  handleFilterChange();
};

// The list API returns BOTH `funding_id` (FK to funding_sources) and
// `funding_source` (the resolved NAME — "GF" / "PMI" / "GOK"). Render the name
// so the column always matches what the funding source is called; the numeric
// id is only a fallback for legacy payloads that predate the relation.
const fundingName = (source) =>
  source == null ? "" : String(source).trim();

const fundingId = (source, fallbackId) => {
  const name = fundingName(source);
  return name !== "" && !Number.isNaN(Number(name)) ? Number(name) : Number(fallbackId);
};

const fundingLabel = (source, fallbackId) => {
  const name = fundingName(source);
  // A non-numeric value is the funding source NAME — show it as-is.
  if (name !== "" && Number.isNaN(Number(name))) return name;
  const id = fundingId(source, fallbackId);
  return id === 1 ? "GF" : id === 2 ? "PMI" : "—";
};

const fundingChipClass = (source, fallbackId) => {
  const name = fundingName(source);
  if (name !== "" && Number.isNaN(Number(name))) {
    const lower = name.toLowerCase();
    return lower === "gf" ? "gf" : lower === "pmi" ? "pmi" : "";
  }
  const id = fundingId(source, fallbackId);
  return id === 1 ? "gf" : id === 2 ? "pmi" : "";
};

const filterOption = (input, option) =>
  String(option?.label ?? option?.children ?? "")
    .toLowerCase()
    .includes(String(input).toLowerCase());

const payrollChipClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("paid")) return "paid";
  if (s.includes("generated")) return "generated";
  return "pending";
};

const detailsLink = (record) => ({
  path: `/activity/details/${record.id}`,
  query: {
    id: record.id,
    name: record.name,
    code: record.activity_code,
    created_by: record.created_by,
    start_date: record.start_date,
    activity_list_id: record.activity_list_id,
    campaign_budget_id: record.campaign_budget_id ?? null,
    budget_category_id: record.budget_category_id ?? null,
    budget_category_name: record.budget_category_name ?? null,
    is_national: record.is_national ?? false,
  },
});

const formatActivity = (item) => {
  const countyName =
    Array.isArray(item.county_id) && item.county_id.length
      ? item.county_id.map((c) => c.name).join(", ")
      : "N/A";
  const subCountyName =
    Array.isArray(item.sub_county_id) && item.sub_county_id.length
      ? item.sub_county_id.map((s) => s.name).join(", ")
      : "N/A";
  return { ...item, county_id: countyName, sub_county_id: subCountyName };
};

const buildQuery = (page = currentPage.value) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("per_page", pageSize.value);
  if (searchItem.value) params.append("query", searchItem.value);
  if (payrollStatus.value != null && payrollStatus.value !== "")
    params.append("payroll_status", payrollStatus.value);
  // County (level 2) users are already scoped to their own county by the
  // backend. Sending the county param as well would additionally require a
  // sub-county relation and drop county-level activities, so we only append
  // it for national (level 1) users who actually pick a county.
  if (
    countyFilter.value != null &&
    countyFilter.value !== "" &&
    userLevelId !== 2
  )
    params.append("county", countyFilter.value);
  if (subCountyFilter.value != null && subCountyFilter.value !== "")
    params.append("sub_county", subCountyFilter.value);
  if (activityType.value != null && activityType.value !== "")
    params.append("activity_list", activityType.value);
  if (campaignFilter.value != null && campaignFilter.value !== "")
    params.append("campaign_id", campaignFilter.value);
  return params.toString();
};

const fetchActivities = async () => {
  isLoading.value = true;
  try {
    // "all" → main activity endpoint (both funding sources); gf/pmi →
    // the respective funding-scoped endpoints.
    const fund = fundingSource.value || "all";
    const endpoint =
      fund === "gf"
        ? "gf_activities"
        : fund === "pmi"
          ? "pmi_activities"
          : "activity";
    const response = await axios.get(`${endpoint}?${buildQuery()}`);
    datatotal.value = response.data?.pagination?.total ?? 0;
    const rows = response.data?.data || [];
    dataSource.value = rows.map(formatActivity);

    // Rebuild the "Activity Type" filter options from the fetched rows so
    // the dropdown always reflects the current funding scope.
    const seen = new Set();
    activityTypeOptions.value = rows
      .filter((x) => {
        if (seen.has(x.activity_list_id)) return false;
        seen.add(x.activity_list_id);
        return true;
      })
      .map((x) => ({ value: x.activity_list_id, label: x.name }));
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCounties = async () => {
  // County (2) & sub-county (3) users never load the full county list — their
  // scope is derived from their own location instead.
  if (userLevelId !== 1) return;
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

const fetchCampaigns = async () => {
  campaignsLoading.value = true;
  try {
    const res = await axios.get("campaign_all");
    const json = res.data;
    const list = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
    campaignOptions.value = list
      .filter((c) => c && c.id != null && c.name != null)
      .map((c) => ({ value: c.id, label: c.name }));
  } catch (error) {
    console.error(error);
    campaignOptions.value = [];
  } finally {
    campaignsLoading.value = false;
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

onMounted(() => {
  // Scope the location filters to the logged-in user's level & location.
  updateFilters();
  if (userLevelId === 1) fetchCounties();
  if (userLevelId === 2 && countyFilter.value)
    fetchSubCounties(countyFilter.value);
  fetchCampaigns();
  // Load the activity records. The original page relied on an immediate route
  // watcher to trigger this; after the consolidation the mount hook is the
  // single entry point, so it must call fetchActivities() explicitly.
  fetchActivities();
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

  /* Filter panel: filters on the left, search pinned to the right */
  .filter-panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
  .filter-panel .ac-search {
    flex: 0 0 auto;
    margin-left: auto;
  }

  .filter-grid {
    flex: 1 1 0;
    min-width: 240px;
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

  /* table (same look & feel as the Events list page) */
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

  /* funding chip */
  .ac-fund-chip {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    border-radius: 10px;
    padding: 2px 10px;
    background: #eef2f0;
    color: #5a6470;
    border: 1px solid #dce3e0;
    &.gf {
      background: #daf4e4;
      color: #15693c;
      border: 1px solid #9ad8b4;
    }
    &.pmi {
      background: #e0ecff;
      color: #1d4ed8;
      border: 1px solid #b3ccff;
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

  /* role / location scope chip in the page header */
  .ac-scope-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding: 4px 12px;
    border-radius: 999px;
    background: #eaf7f0;
    border: 1px solid #bfe6cd;
    color: #15693c;
    font-size: 12px;
    font-weight: 700;
    text-transform: capitalize;
  }

  /* role-based create shortcut in the page header */
  .ac-create-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 16px;
    border-radius: 22px;
    background: #16a34a;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    &:hover {
      background: #15803d;
      color: #fff;
    }
  }
}
</style>