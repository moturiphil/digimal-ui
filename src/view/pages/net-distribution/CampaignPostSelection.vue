<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="cps-page">
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Campaign Posts
            </h3>
            <p class="ph-subtitle">
              Carry last campaign's posts into the active campaign, and stop or
              restart posts that are no longer needed.
            </p>
          </div>
          <div class="ph-actions">
            <router-link to="/nets/distribution-post" class="cps-link">
              <sdFeatherIcons type="grid" size="13" />
              <span>All distribution posts</span>
            </router-link>
            <button class="cps-btn" :disabled="loading" @click="reload">
              <sdFeatherIcons type="refresh-cw" size="13" />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        <!-- Which campaign the selection applies to -->
        <section class="panel cps-context">
          <div class="cps-context-copy">
            <span class="cps-label">Active campaign</span>
            <span v-if="campaign" class="cps-campaign">{{ campaign.name }}</span>
            <span v-else-if="campaignChecked" class="cps-campaign cps-muted">
              No campaign is currently active
            </span>
            <span v-else class="cps-campaign cps-muted">Checking…</span>
            <span v-if="periodLabel" class="cps-period">{{ periodLabel }}</span>
          </div>
          <span v-if="campaign" class="cps-badge cps-badge-on">Running</span>
        </section>

        <section class="panel cps-panel">
          <!-- Posts are always selected for a campaign — say so instead of failing -->
          <div v-if="noAccess" class="cps-empty">
            <a-empty description="You cannot view the post list">
              <p class="cps-empty-note">
                Selecting campaign posts needs read access to the distribution
                posts (<code>posts_data</code>). Ask an administrator to grant it
                in Access Control.
              </p>
            </a-empty>
          </div>

          <div v-else-if="noCampaign" class="cps-empty">
            <a-empty description="No campaign is currently active">
              <p class="cps-empty-note">
                Posts are selected per campaign. An administrator must activate a
                campaign before posts can be carried over, stopped or restarted.
              </p>
              <router-link to="/campaigns/view-campaign">
                <a-button type="primary">Go to campaigns</a-button>
              </router-link>
            </a-empty>
          </div>

          <template v-else>
            <div class="cps-toolbar">
              <a-radio-group
                v-model:value="activeTab"
                button-style="solid"
                @change="onTabChange"
              >
                <a-radio-button value="carry">
                  To carry over ({{ counts.carry }})
                </a-radio-button>
                <a-radio-button value="in-campaign">
                  In campaign ({{ counts.inCampaign }})
                </a-radio-button>
                <a-radio-button value="stopped">
                  Stopped ({{ counts.stopped }})
                </a-radio-button>
              </a-radio-group>

              <div class="cps-toolbar-right">
                <a-input
                  v-model:value="search"
                  allow-clear
                  class="cps-search"
                  placeholder="Search post, code or supervisor"
                />
                <button
                  v-if="activeTab === 'carry'"
                  class="cps-btn cps-btn-primary"
                  :disabled="!canAct || !selectedRowKeys.length || actionLoading"
                  @click="confirmSelected"
                >
                  <sdFeatherIcons type="check" size="13" />
                  <span>Confirm selected ({{ selectedRowKeys.length }})</span>
                </button>
              </div>
            </div>

            <p v-if="activeTab === 'carry'" class="cps-hint">
              Only posts that are published and were
              <strong>active in the last campaign</strong> can be carried over.
              Stopped or unpublished posts never appear here.
            </p>
            <p v-else-if="activeTab === 'in-campaign'" class="cps-hint">
              Posts taking part in this campaign. A post can only be stopped while
              it holds no stock and has no unserved households.
            </p>
            <p v-else class="cps-hint">
              Posts confirmed for this campaign but no longer in use. Their history
              (households, stock, distributions) is kept.
            </p>

            <div v-if="loading" class="cps-loading"><a-spin /></div>

            <template v-else>
              <a-table
                :columns="columns"
                :data-source="posts"
                :pagination="false"
                :row-key="(row) => row.id"
                :row-selection="rowSelection"
                size="middle"
              >
                <template #status="{ record }">
                  <span
                    class="cps-badge"
                    :class="record.is_active ? 'cps-badge-on' : 'cps-badge-off'"
                  >
                    {{ record.is_active ? "In use" : "Stopped" }}
                  </span>
                </template>
                <template #actions="{ record }">
                  <div class="cps-row-actions">
                    <button
                      v-if="record.is_active"
                      class="cps-btn cps-btn-danger"
                      :disabled="!canAct || actionLoading"
                      @click="openStopModal(record)"
                    >
                      <sdFeatherIcons type="pause-circle" size="13" />
                      <span>Stop</span>
                    </button>
                    <button
                      v-else
                      class="cps-btn"
                      :disabled="!canAct || actionLoading"
                      @click="restart(record)"
                    >
                      <sdFeatherIcons type="play-circle" size="13" />
                      <span>Restart</span>
                    </button>
                  </div>
                </template>
              </a-table>

              <div v-if="!posts.length" class="cps-empty">
                <a-empty :description="emptyText" />
              </div>

              <div v-if="total > pageSize" class="cps-pagination">
                <a-pagination
                  :current="currentPage"
                  :total="total"
                  :page-size="pageSize"
                  :show-size-changer="false"
                  show-less-items
                  @change="onPageChange"
                />
              </div>
            </template>
          </template>
        </section>

        <!-- Stop a post: the backend requires a reason -->
        <a-modal
          title="Stop post in this campaign"
          :visible="stopModal.open"
          :confirm-loading="actionLoading"
          ok-text="Stop post"
          @ok="submitStop"
          @cancel="closeStopModal"
        >
          <p class="cps-modal-lead">
            <strong>{{ stopModal.post ? stopModal.post.name : "" }}</strong> will no
            longer be used in
            <strong>{{ campaign ? campaign.name : "the active campaign" }}</strong
            >. Its history is kept and it can be restarted later.
          </p>
          <p class="cps-modal-note">
            Stopping is refused while the post still holds stock or has households
            mapped to it that have not been served — transfer them first.
          </p>
          <label class="cps-field-label" for="cps-stop-reason">Reason</label>
          <a-textarea
            id="cps-stop-reason"
            v-model:value="stopModal.reason"
            :rows="3"
            :maxlength="255"
            show-count
            placeholder="e.g. Post closed for the remainder of the campaign"
          />
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { computed, h, onMounted, ref, watch } from "vue";
import { Modal, notification } from "ant-design-vue";
import dayjs from "dayjs";
import campaignPostService, {
  apiErrorMessage,
} from "@/services/campaign-post/campaign-post.service";
import { useCampaignPostPermissions } from "@/services/campaign-post/usePermissions";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import { Main } from "../../styled";

const { canManageCampaignPosts, canViewCampaignPosts } = useCampaignPostPermissions();
// Every write endpoint (confirm / deactivate / activate) is behind
// `role_permission:confirm_campaign_posts`.
const canAct = canManageCampaignPosts;

// ── Campaign context ─────────────────────────────────────────────────────────
const campaign = ref(null);
const campaignChecked = ref(false);
const noCampaign = ref(false);
// 403 from posts_data: the caller may manage posts but not read the list.
const noAccess = ref(false);

// ── Post list ────────────────────────────────────────────────────────────────
const activeTab = ref("carry");
const posts = ref([]);
const counts = ref({ carry: 0, inCampaign: 0, stopped: 0 });
const total = ref(0);
const pageSize = ref(50);
const currentPage = ref(1);
const search = ref("");
const loading = ref(true);
const actionLoading = ref(false);
const selectedRowKeys = ref([]);
const stopModal = ref({ open: false, post: null, reason: "" });

/** Tab -> `posts_data?status=` (see DistributionController::getAllPosts). */
const STATUS_BY_TAB = {
  carry: "unconfirmed",
  "in-campaign": "confirmed",
  stopped: "deactivated",
};

const periodLabel = computed(() => {
  if (!campaign.value) return "";
  const start = formatDate(campaign.value.start_date);
  const end = formatDate(campaign.value.end_date);
  if (start === "—" && end === "—") return "";
  return `${start} → ${end}`;
});

const emptyText = computed(() => {
  if (activeTab.value === "carry") {
    return "Nothing to carry over — every eligible post is already in this campaign.";
  }
  if (activeTab.value === "in-campaign") {
    return "No posts have been confirmed for this campaign yet.";
  }
  return "No posts have been stopped in this campaign.";
});

const columns = computed(() => {
  if (activeTab.value === "carry") {
    return [
      { title: "Distribution Post", dataIndex: "name", key: "name" },
      { title: "Post Code", dataIndex: "post_code", key: "post_code" },
      { title: "Sub County", dataIndex: "distribution_sub_county", key: "sub_county" },
      { title: "Ward", dataIndex: "distribution_ward", key: "ward" },
      { title: "Location", dataIndex: "distribution_location_id", key: "location" },
    ];
  }

  if (activeTab.value === "in-campaign") {
    return [
      { title: "Distribution Post", dataIndex: "name", key: "name" },
      { title: "Post Code", dataIndex: "post_code", key: "post_code" },
      { title: "Sub County", dataIndex: "distribution_sub_county", key: "sub_county" },
      { title: "Supervisor", dataIndex: "post_supervisor_user_id", key: "supervisor" },
      {
        title: "Confirmed",
        dataIndex: "confirmed_at",
        key: "confirmed_at",
        customRender: ({ text }) => formatDate(text),
      },
      {
        title: "Status",
        dataIndex: "is_active",
        key: "status",
        slots: { customRender: "status" },
      },
      { title: "", key: "actions", slots: { customRender: "actions" } },
    ];
  }

  return [
    { title: "Distribution Post", dataIndex: "name", key: "name" },
    { title: "Post Code", dataIndex: "post_code", key: "post_code" },
    { title: "Sub County", dataIndex: "distribution_sub_county", key: "sub_county" },
    { title: "Supervisor", dataIndex: "post_supervisor_user_id", key: "supervisor" },
    {
      title: "Stopped",
      dataIndex: "deactivated_at",
      key: "deactivated_at",
      customRender: ({ text }) => formatDate(text),
    },
    { title: "Reason", dataIndex: "deactivation_reason", key: "reason" },
    { title: "", key: "actions", slots: { customRender: "actions" } },
  ];
});

// Only the carry-over tab is a selection list.
const rowSelection = computed(() =>
  activeTab.value === "carry"
    ? {
        selectedRowKeys: selectedRowKeys.value,
        onChange: (keys) => {
          selectedRowKeys.value = keys;
        },
        getCheckboxProps: () => ({ disabled: !canAct.value }),
      }
    : undefined
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(value) {
  if (!value) return "—";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : "—";
}

/** Render the per-post refusals the backend reports under `failed`. */
const failureList = (failures) =>
  h(
    "div",
    { style: "max-height: 220px; overflow-y: auto;" },
    failures.map((failure) =>
      h("div", { style: "margin-bottom: 6px;" }, `• ${failure.reason}`)
    )
  );

// ── Loading ──────────────────────────────────────────────────────────────────
const loadCampaign = async () => {
  try {
    const { data } = await campaignPostService.activeCampaign();
    campaign.value = data?.data || null;
  } catch (error) {
    // `active_campaign` is granted separately from the post-selection
    // permissions — never block the page on it.
    campaign.value = null;
  } finally {
    campaignChecked.value = true;
  }
};

const loadPosts = async () => {
  if (!canViewCampaignPosts.value) {
    noAccess.value = true;
    posts.value = [];
    total.value = 0;
    loading.value = false;
    return;
  }
  noAccess.value = false;
  loading.value = true;
  try {
    const { data } = await campaignPostService.listPosts({
      status: STATUS_BY_TAB[activeTab.value],
      perPage: pageSize.value,
      page: currentPage.value,
      query: search.value.trim(),
    });
    posts.value = data?.data || [];
    total.value = data?.pagination?.total || 0;
    noCampaign.value = false;
  } catch (error) {
    posts.value = [];
    total.value = 0;
    if (error?.response?.status === 403) {
      // Granted the write permission but not `posts_data` — explain, don't toast.
      noAccess.value = true;
      return;
    }
    const message = apiErrorMessage(error);
    // CampaignContext::readId() answers 422 when nothing is running.
    noCampaign.value = /no campaign is currently active/i.test(message);
    if (!noCampaign.value) {
      notification.error({ message: "Could not load posts", description: message });
    }
  } finally {
    loading.value = false;
  }
};

const loadCounts = async () => {
  if (!canViewCampaignPosts.value) return;

  const read = (status) =>
    campaignPostService
      .listPosts({ status, perPage: 1 })
      .then(({ data }) => data?.pagination?.total || 0)
      .catch(() => 0);

  const [carry, inCampaign, stopped] = await Promise.all([
    read("unconfirmed"),
    read("confirmed"),
    read("deactivated"),
  ]);
  counts.value = { carry, inCampaign, stopped };
};

const reload = async () => {
  selectedRowKeys.value = [];
  await Promise.all([loadCampaign(), loadPosts(), loadCounts()]);
};

const onTabChange = () => {
  selectedRowKeys.value = [];
  currentPage.value = 1;
  loadPosts();
};

const onPageChange = (page) => {
  currentPage.value = page;
  loadPosts();
};

let searchTimer = null;
watch(search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    loadPosts();
  }, 350);
});



// ── Writes (confirm / stop / restart) ────────────────────────────────────────
/**
 * Run one campaign_posts/* call and report both halves of the answer: the posts
 * that were changed and the posts the backend refused (with the reason).
 */
const runAction = async ({ request, doneKey, verb }) => {
  actionLoading.value = true;
  try {
    const { data } = await request();
    const done = data?.[doneKey] || [];
    const failures = data?.failed || [];

    if (done.length) {
      notification.success({
        message: data?.message || `${done.length} post(s) ${verb}.`,
      });
    }
    if (failures.length) {
      notification.warning({
        message: `${failures.length} post(s) could not be ${verb}`,
        description: failureList(failures),
        duration: 12,
      });
    }

    selectedRowKeys.value = [];
    await Promise.all([loadPosts(), loadCounts()]);
    return done.length > 0;
  } catch (error) {
    notification.error({
      message: "Action failed",
      description: apiErrorMessage(error),
    });
    return false;
  } finally {
    actionLoading.value = false;
  }
};

const confirmSelected = () => {
  const ids = [...selectedRowKeys.value];
  if (!ids.length) return;

  Modal.confirm({
    title: `Carry ${ids.length} post(s) into ${
      campaign.value ? campaign.value.name : "the active campaign"
    }?`,
    content:
      "Each confirmed post starts this campaign with no supervisor and zero stock.",
    okText: "Confirm posts",
    onOk: () =>
      runAction({
        request: () => campaignPostService.confirmPosts(ids),
        doneKey: "confirmed",
        verb: "confirmed",
      }),
  });
};

const openStopModal = (record) => {
  stopModal.value = { open: true, post: record, reason: "" };
};

const closeStopModal = () => {
  stopModal.value = { open: false, post: null, reason: "" };
};

const submitStop = async () => {
  if (!stopModal.value.post) return;

  const reason = (stopModal.value.reason || "").trim();
  if (!reason) {
    notification.warning({ message: "A reason is required to stop a post." });
    return;
  }

  const stopped = await runAction({
    request: () => campaignPostService.stopPosts([stopModal.value.post.id], reason),
    doneKey: "deactivated",
    verb: "stopped",
  });
  if (stopped) closeStopModal();
};

const restart = (record) => {
  Modal.confirm({
    title: `Put ${record.name} back in use?`,
    content: "The post rejoins the active campaign with the supervisor it had there.",
    okText: "Restart post",
    onOk: () =>
      runAction({
        request: () => campaignPostService.restartPosts([record.id]),
        doneKey: "activated",
        verb: "restarted",
      }),
  });
};

onMounted(async () => {
  await Promise.all([loadCampaign(), loadPosts(), loadCounts()]);
});
</script>

<style lang="less" scoped>
.cps-page {
  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }

  /* ── active campaign strip ───────────────────────────── */
  .cps-context {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .cps-context-copy {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .cps-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #7a8a82;
  }

  .cps-campaign {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    word-break: break-word;
  }

  .cps-muted {
    color: #8a9399;
    font-weight: 600;
  }

  .cps-period {
    font-size: 12px;
    font-weight: 600;
    color: #2f6746;
    background: #eafff5;
    border: 1px solid #c9e6d3;
    border-radius: 999px;
    padding: 2px 10px;
  }

  /* ── badges ──────────────────────────────────────────── */
  .cps-badge {
    display: inline-flex;
    align-items: center;
    height: 22px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .cps-badge-on {
    background: #eafff5;
    color: #15693c;
    border: 1px solid #c9e6d3;
  }

  .cps-badge-off {
    background: #f5f6f8;
    color: #6b7480;
    border: 1px solid #e6ecef;
  }

  /* ── list panel ──────────────────────────────────────── */
  .cps-panel {
    padding: 12px;
  }

  .cps-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .cps-toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .cps-search {
    width: 260px;
    max-width: 100%;
    border-radius: 22px;
    border-color: #d9f0e2;
    background: #f7fdf9;
  }

  .cps-hint {
    margin: 0 2px 12px;
    font-size: 12px;
    color: #7a8a82;
    line-height: 1.5;
  }

  .cps-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .cps-empty {
    padding: 26px 0 34px;
    text-align: center;
  }

  .cps-empty-note {
    max-width: 420px;
    margin: 6px auto 16px;
    font-size: 13px;
    color: #7a8a82;
    line-height: 1.6;
  }

  .cps-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 14px 6px 4px;
  }

  /* ── table ───────────────────────────────────────────── */
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

  .cps-row-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* ── buttons ─────────────────────────────────────────── */
  .cps-btn,
  .cps-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid #d9f0e2;
    background: #fff;
    color: #15693c;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease,
      box-shadow 0.15s ease;

    &:hover:not(:disabled) {
      background: #f3fcf6;
      border-color: #9ad8b4;
      color: #15693c;
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  .cps-btn-primary {
    background: #15693c;
    border-color: #15693c;
    color: #fff;

    &:hover:not(:disabled) {
      background: #1f8a4f;
      border-color: #1f8a4f;
      color: #fff;
    }
  }

  .cps-btn-danger {
    color: #b42318;
    border-color: #ffd6d1;
    background: #fff6f5;

    &:hover:not(:disabled) {
      background: #ffefed;
      border-color: #ffb4a8;
      color: #b42318;
    }
  }

  /* ── stop modal ──────────────────────────────────────── */
  .cps-modal-lead {
    margin: 0 0 8px;
    font-size: 13px;
    color: #2f3a35;
    line-height: 1.6;
  }

  .cps-modal-note {
    margin: 0 0 16px;
    font-size: 12px;
    color: #a06200;
    background: #fff9ec;
    border: 1px solid #ffe2a8;
    border-radius: 8px;
    padding: 10px 12px;
    line-height: 1.6;
  }

  .cps-field-label {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #2f6746;
  }

  @media (max-width: 767px) {
    .cps-toolbar,
    .cps-toolbar-right {
      flex-direction: column;
      align-items: stretch;
    }

    .cps-search {
      width: 100%;
    }

    .cps-btn,
    .cps-link {
      justify-content: center;
    }
  }
}
</style>

