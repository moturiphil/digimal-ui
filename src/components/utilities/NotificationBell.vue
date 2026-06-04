<template>
  <a-dropdown
    v-model:visible="dropdownOpen"
    placement="bottomRight"
    :trigger="['click']"
    overlay-class-name="notif-bell-overlay"
  >
    <a-badge :count="unreadCount" :overflow-count="99" :offset="[-2, 4]">
      <button class="bell-btn" type="button" aria-label="Notifications">
        <BellOutlined />
      </button>
    </a-badge>

    <template #overlay>
      <div class="notif-panel">
        <div class="notif-head">
          <span class="notif-title">Notifications</span>
          <a-button
            v-if="unreadCount > 0"
            type="link"
            size="small"
            @click="markAllRead"
          >
            Mark all read
          </a-button>
        </div>

        <div class="notif-body">
          <a-spin v-if="loading" />
          <div v-else-if="items.length === 0" class="notif-empty">
            <InboxOutlined class="empty-icon" />
            <p>You're all caught up.</p>
          </div>
          <ul v-else class="notif-list">
            <li
              v-for="item in items"
              :key="item.id"
              :class="['notif-item', { unread: !item.read_at }]"
              @click="openNotification(item)"
            >
              <div class="notif-icon" :class="typeClass(item.type)">
                <component :is="typeIcon(item.type)" />
              </div>
              <div class="notif-text">
                <strong>{{ item.title }}</strong>
                <p>{{ item.message }}</p>
                <span class="notif-time">{{ relativeTime(item.created_at) }}</span>
              </div>
              <span v-if="!item.read_at" class="unread-dot"></span>
            </li>
          </ul>
        </div>

        <div class="notif-foot">
          <a-button type="link" size="small" @click="openAllModal">
            View all activity
          </a-button>
          <a-button type="link" size="small" @click="fetchAll(true)">
            <ReloadOutlined /> Refresh
          </a-button>
        </div>
      </div>
    </template>
  </a-dropdown>

  <!-- Full activity modal: a richer, scrollable list with pagination -->
  <a-modal
    v-model:visible="allModalOpen"
    title="All notifications"
    :footer="null"
    width="640px"
    wrap-class-name="notif-all-modal"
    @cancel="allModalOpen = false"
  >
    <div class="modal-toolbar">
      <span class="modal-meta">
        {{ allMeta.total }} total · {{ allUnread }} unread
      </span>
      <a-space>
        <a-button
          v-if="allUnread > 0"
          size="small"
          type="link"
          @click="markAllRead(true)"
        >
          Mark all read
        </a-button>
        <a-button size="small" type="link" @click="fetchAllPage(1)">
          <ReloadOutlined /> Refresh
        </a-button>
      </a-space>
    </div>

    <a-spin v-if="allLoading" />
    <div v-else-if="allItems.length === 0" class="notif-empty">
      <InboxOutlined class="empty-icon" />
      <p>You have no notifications yet.</p>
    </div>
    <ul v-else class="notif-list notif-list--modal">
      <li
        v-for="item in allItems"
        :key="item.id"
        :class="['notif-item', { unread: !item.read_at }]"
        @click="openNotification(item, { fromModal: true })"
      >
        <div class="notif-icon" :class="typeClass(item.type)">
          <component :is="typeIcon(item.type)" />
        </div>
        <div class="notif-text">
          <strong>{{ item.title }}</strong>
          <p>{{ item.message }}</p>
          <span class="notif-time">{{ relativeTime(item.created_at) }}</span>
        </div>
        <span v-if="!item.read_at" class="unread-dot"></span>
      </li>
    </ul>

    <div v-if="allMeta.last_page > 1" class="modal-pager">
      <a-pagination
        v-model:current="allMeta.current_page"
        :total="allMeta.total"
        :page-size="allMeta.per_page"
        :show-size-changer="false"
        size="small"
        @change="fetchAllPage"
      />
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import axios from "@/Axiosconfig";
import {
  BellOutlined,
  InboxOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

const router = useRouter();

const dropdownOpen = ref(false);
const loading = ref(false);
const items = ref([]);
const unreadCount = ref(0);
let pollTimer = null;

// "View all activity" modal state
const allModalOpen = ref(false);
const allLoading = ref(false);
const allItems = ref([]);
const allMeta = reactive({
  current_page: 1,
  per_page: 15,
  total: 0,
  last_page: 1,
});
const allUnread = computed(() =>
  allItems.value.filter((i) => !i.read_at).length
);

const typeIcon = (type) => {
  if (!type) return InfoCircleOutlined;
  if (type.endsWith("approved")) return CheckCircleOutlined;
  if (type.endsWith("rejected")) return CloseCircleOutlined;
  if (type.endsWith("submitted")) return EditOutlined;
  return InfoCircleOutlined;
};

const typeClass = (type) => {
  if (!type) return "info";
  if (type.endsWith("approved")) return "success";
  if (type.endsWith("rejected")) return "danger";
  if (type.endsWith("submitted")) return "primary";
  return "info";
};

const relativeTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const fetchUnreadCount = async () => {
  try {
    const res = await axios.get("notifications/unread_count");
    unreadCount.value = res.data?.count ?? 0;
  } catch {
    // silent — bell stays usable even if endpoint hiccups
  }
};

const fetchAll = async (manual = false) => {
  loading.value = true;
  try {
    const res = await axios.get("notifications", { params: { per_page: 20 } });
    items.value = res.data?.data || [];
    await fetchUnreadCount();
  } catch (err) {
    if (manual) message.error("Failed to load notifications.");
  } finally {
    loading.value = false;
  }
};

const fetchAllPage = async (page = 1) => {
  allLoading.value = true;
  try {
    const res = await axios.get("notifications", {
      params: { per_page: allMeta.per_page, page },
    });
    const body = res.data || {};
    allItems.value = body.data || [];
    allMeta.current_page = body.current_page || page;
    allMeta.per_page = body.per_page || allMeta.per_page;
    allMeta.total = body.total ?? allItems.value.length;
    allMeta.last_page = body.last_page || 1;
  } catch {
    message.error("Failed to load notifications.");
  } finally {
    allLoading.value = false;
  }
};

const openAllModal = async () => {
  dropdownOpen.value = false;
  allModalOpen.value = true;
  await fetchAllPage(1);
};

const markRead = async (id) => {
  try {
    await axios.post(`notifications/${id}/read`);
    const stamp = new Date().toISOString();
    const a = items.value.find((i) => i.id === id);
    if (a) a.read_at = stamp;
    const b = allItems.value.find((i) => i.id === id);
    if (b) b.read_at = stamp;
    if (unreadCount.value > 0) unreadCount.value--;
  } catch {
    // ignore
  }
};

const markAllRead = async (silent = false) => {
  try {
    await axios.post("notifications/read_all");
    const stamp = new Date().toISOString();
    items.value.forEach((i) => { if (!i.read_at) i.read_at = stamp; });
    allItems.value.forEach((i) => { if (!i.read_at) i.read_at = stamp; });
    unreadCount.value = 0;
    if (!silent) message.success("All notifications marked as read.");
  } catch {
    message.error("Failed to mark notifications as read.");
  }
};

const routeForType = (type) => {
  if (!type) return null;
  if (type.startsWith("hh_change_request.submitted")) {
    return "/household/change-requests/review";
  }
  if (
    type.startsWith("hh_change_request.approved") ||
    type.startsWith("hh_change_request.rejected")
  ) {
    return "/household/my-change-requests";
  }
  return null;
};

// Defensive — the `data` column is JSON on the backend and Laravel casts it to
// an array, but if anything ever stores it as a raw string (legacy rows, raw
// inserts, etc.) we still want navigation to work.
const parseData = (raw) => {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw) || {}; } catch { return {}; }
  }
  return {};
};

const openNotification = async (item, opts = {}) => {
  // Close UI surfaces *first* so the route change isn't competing with ant
  // design's portal/animation cleanup (a common cause of "click does nothing").
  dropdownOpen.value = false;
  if (opts.fromModal) {
    allModalOpen.value = false;
  }

  // Mark read in the background — don't block navigation on this.
  if (!item.read_at) {
    markRead(item.id).catch(() => {});
  }

  const data = parseData(item.data);

  // Resolve a target route + highlight id from either the stored url or the
  // notification type + request_id fallback.
  let path = null;
  const query = {};

  const explicitUrl = typeof data.url === "string" ? data.url : null;
  if (explicitUrl) {
    const [p, queryString] = explicitUrl.split("?");
    path = p;
    if (queryString) {
      for (const part of queryString.split("&")) {
        const [k, v] = part.split("=");
        if (k) query[decodeURIComponent(k)] = v ? decodeURIComponent(v) : "";
      }
    }
  } else {
    path = routeForType(item.type);
  }

  // Always make sure `highlight` is set if we know the request id — this is
  // what the target pages key off to scroll + open the drawer.
  if (!query.highlight && data.request_id != null) {
    query.highlight = String(data.request_id);
  }

  if (!path) {
    message.info("This notification has no linked page.");
    return;
  }

  // Verify the path actually resolves to a known route. If a stored url is
  // stale (e.g. from a previous deploy with different routes) fall back to
  // routeForType so we still navigate somewhere useful.
  let resolved = null;
  try { resolved = router.resolve({ path }); } catch { resolved = null; }
  if (!resolved || !resolved.matched || resolved.matched.length === 0) {
    const fallback = routeForType(item.type);
    if (fallback) {
      path = fallback;
    } else {
      message.warning("Linked page is unavailable.");
      return;
    }
  }

  // If we're already on the same path, router.push with an identical query
  // would be a no-op and the deep-link handlers on the target page would not
  // fire. Force a unique query value so the route.query watcher always runs.
  const current = router.currentRoute.value;
  const samePath = current.path === path;
  const sameHighlight =
    String(current.query.highlight || "") === String(query.highlight || "");

  if (samePath && sameHighlight && query.highlight) {
    query._t = String(Date.now());
  }

  // Wait one tick so the dropdown/modal teardown commits before navigation.
  await nextTick();

  try {
    await router.push({ path, query });
  } catch (err) {
    // Swallow NavigationDuplicated etc. — the target page still reacts via its
    // route.query watcher because of the `_t` cache-buster.
    if (err && err.name !== "NavigationDuplicated") {
      // eslint-disable-next-line no-console
      console.warn("Notification navigation failed:", err);
    }
  }
};

onMounted(() => {
  fetchAll();
  pollTimer = setInterval(fetchUnreadCount, 60000);
});

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style lang="less" scoped>
.bell-btn {
  background: transparent;
  border: none;
  color: #475569;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(47, 108, 223, 0.08);
    color: #2f6cdf;
  }
}
</style>

<style lang="less">
.notif-bell-overlay {
  .notif-panel {
    width: 360px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.16);
    overflow: hidden;
  }

  .notif-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #eef0f4;

    .notif-title {
      font-weight: 600;
      color: #0f172a;
    }
  }

  .notif-body {
    max-height: 420px;
    overflow-y: auto;
  }

  .notif-empty {
    text-align: center;
    padding: 36px 16px;
    color: #94a3b8;

    .empty-icon {
      font-size: 36px;
      margin-bottom: 8px;
    }
  }

  .notif-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .notif-item {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer;
    transition: background 0.15s ease;
    position: relative;

    &:hover {
      background: #f8fafc;
    }

    &.unread {
      background: #f0f7ff;

      &:hover {
        background: #e6f1ff;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .notif-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;

    &.primary {
      background: #dbeafe;
      color: #1d4ed8;
    }

    &.success {
      background: #dcfce7;
      color: #15803d;
    }

    &.danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    &.info {
      background: #e2e8f0;
      color: #475569;
    }
  }

  .notif-text {
    flex: 1;
    min-width: 0;
    line-height: 1.35;

    strong {
      display: block;
      font-size: 13px;
      color: #0f172a;
      margin-bottom: 2px;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #475569;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .notif-time {
      display: block;
      margin-top: 4px;
      font-size: 11px;
      color: #94a3b8;
    }
  }

  .unread-dot {
    width: 8px;
    height: 8px;
    background: #2f6cdf;
    border-radius: 50%;
    flex-shrink: 0;
    align-self: center;
  }

  .notif-foot {
    padding: 6px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eef0f4;
  }
}

/* "View all activity" modal */
.notif-all-modal {
  .ant-modal-body {
    padding-top: 0;
  }

  .modal-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0 12px;
    border-bottom: 1px solid #eef0f4;
    margin-bottom: 8px;

    .modal-meta {
      font-size: 12px;
      color: #64748b;
    }
  }

  .notif-list--modal {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 60vh;
    overflow-y: auto;

    .notif-item {
      display: flex;
      gap: 12px;
      padding: 12px 8px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background 0.15s ease;
      border-radius: 6px;

      &:hover { background: #f8fafc; }
      &.unread { background: #f0f7ff; }
      &.unread:hover { background: #e6f1ff; }

      .notif-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;

        &.primary { background: #dbeafe; color: #1d4ed8; }
        &.success { background: #dcfce7; color: #15803d; }
        &.danger  { background: #fee2e2; color: #b91c1c; }
        &.info    { background: #e2e8f0; color: #475569; }
      }

      .notif-text {
        flex: 1;
        min-width: 0;
        line-height: 1.4;

        strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          margin-bottom: 2px;
        }
        p {
          margin: 0;
          font-size: 12px;
          color: #475569;
        }
        .notif-time {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          color: #94a3b8;
        }
      }

      .unread-dot {
        width: 8px;
        height: 8px;
        background: #2f6cdf;
        border-radius: 50%;
        flex-shrink: 0;
        align-self: center;
      }
    }
  }

  .notif-empty {
    text-align: center;
    padding: 36px 16px;
    color: #94a3b8;
    .empty-icon { font-size: 36px; margin-bottom: 8px; }
  }

  .modal-pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
  }
}

@media (max-width: 640px) {
  .notif-all-modal .ant-modal {
    max-width: calc(100vw - 16px);
    margin: 8px auto;
  }
}
</style>
