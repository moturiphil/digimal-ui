<template>
  <a-dropdown
    v-model:open="dropdownOpen"
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
          <a-button type="link" size="small" @click="fetchAll(true)">
            <ReloadOutlined /> Refresh
          </a-button>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
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

const markRead = async (id) => {
  try {
    await axios.post(`notifications/${id}/read`);
    const item = items.value.find((i) => i.id === id);
    if (item) item.read_at = new Date().toISOString();
    if (unreadCount.value > 0) unreadCount.value--;
  } catch {
    // ignore
  }
};

const markAllRead = async () => {
  try {
    await axios.post("notifications/read_all");
    items.value.forEach((i) => {
      if (!i.read_at) i.read_at = new Date().toISOString();
    });
    unreadCount.value = 0;
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

const openNotification = async (item) => {
  if (!item.read_at) await markRead(item.id);
  const target = routeForType(item.type);
  if (target) {
    dropdownOpen.value = false;
    router.push(target);
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
    text-align: right;
    border-top: 1px solid #eef0f4;
  }
}
</style>
