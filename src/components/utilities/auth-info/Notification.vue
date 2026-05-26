<template>
  <div class="notification">
    <a-popover
      placement="bottomLeft"
      trigger="click"
      overlay-class-name="np-popover"
      v-model:visible="popoverOpen"
      @visibleChange="onVisibleChange"
    >
      <template #content>
        <div class="np-panel">
          <header class="np-head">
            <div class="np-head__title">
              <sdFeatherIcons type="bell" size="18" />
              <span>Notifications</span>
              <span v-if="unreadCount > 0" class="np-head__count">{{ unreadCount }}</span>
            </div>
            <a v-if="unreadCount > 0" class="np-head__action" @click.stop="markAllRead">
              <sdFeatherIcons type="check-circle" size="14" />
              Mark all read
            </a>
          </header>

          <nav class="np-tabs">
            <button
              type="button"
              class="np-tab"
              :class="{ 'np-tab--active': activeFilter === 'all' }"
              @click="activeFilter = 'all'"
            >
              All <span class="np-tab__chip">{{ items.length }}</span>
            </button>
            <button
              type="button"
              class="np-tab"
              :class="{ 'np-tab--active': activeFilter === 'unread' }"
              @click="activeFilter = 'unread'"
            >
              Unread <span class="np-tab__chip np-tab__chip--accent">{{ unreadCount }}</span>
            </button>
          </nav>

          <div v-if="loading && !items.length" class="np-state">
            <div class="np-spinner" />
            <p>Loading notifications…</p>
          </div>
          <div v-else-if="!filteredItems.length" class="np-state">
            <div class="np-state__icon">
              <sdFeatherIcons type="inbox" size="28" />
            </div>
            <p class="np-state__title">You're all caught up</p>
            <p class="np-state__sub">
              {{ activeFilter === 'unread' ? 'No unread notifications.' : 'New activity will appear here.' }}
            </p>
          </div>

          <perfect-scrollbar
            v-else
            class="np-scroll"
            :options="{ wheelSpeed: 1, swipeEasing: true, suppressScrollX: true }"
          >
            <ul class="np-list">
              <li
                v-for="n in filteredItems"
                :key="n.id"
                class="np-row"
                :class="{ 'np-row--unread': !n.read_at }"
                @click="openNotification(n)"
              >
                <span class="np-row__rail" :class="iconBg(n.type)" />
                <div class="np-row__icon" :class="iconBg(n.type)">
                  <sdFeatherIcons :type="iconFor(n.type)" size="16" />
                </div>
                <div class="np-row__body">
                  <div class="np-row__top">
                    <span class="np-row__title">{{ n.title }}</span>
                    <span class="np-row__time">{{ relativeTime(n.created_at) }}</span>
                  </div>
                  <p class="np-row__msg">{{ n.message }}</p>
                </div>
                <span v-if="!n.read_at" class="np-row__dot" aria-label="unread" />
              </li>
            </ul>
          </perfect-scrollbar>

          <footer class="np-foot">
            <a @click="goToAll">View all activity</a>
          </footer>
        </div>
      </template>

      <a-badge :count="unreadCount" :offset="[-4, 4]" :overflow-count="99">
        <a class="head-example np-bell" :class="{ 'np-bell--active': unreadCount > 0 }">
          <sdFeatherIcons type="bell" size="20" />
        </a>
      </a-badge>
    </a-popover>
  </div>
</template>

<script>
/**
 * Bell-icon notification feed.
 *
 * Polls /notifications/unread_count every 60s while mounted to keep the
 * badge fresh. Loads the latest 20 items on dropdown open. Clicking a
 * row marks it read and deep-links the user to the budget page that
 * matches their role/level.
 */
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/Axiosconfig";

const POLL_MS = 60_000;

export default defineComponent({
  name: "Notification",
  components: { PerfectScrollbar },
  setup() {
    const router      = useRouter();
    const items       = ref([]);
    const unreadCount = ref(0);
    const loading     = ref(false);
    const popoverOpen = ref(false);
    const activeFilter = ref("all");
    let pollTimer     = null;

    const filteredItems = computed(() =>
      activeFilter.value === "unread"
        ? items.value.filter((n) => !n.read_at)
        : items.value,
    );

    const fetchCount = async () => {
      try {
        const { data } = await axios.get("notifications/unread_count");
        unreadCount.value = data?.count ?? 0;
      } catch (_) { /* keep last known count */ }
    };

    const fetchList = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get("notifications", { params: { per_page: 20 } });
        items.value = data?.data ?? [];
      } catch (_) {
        items.value = [];
      } finally {
        loading.value = false;
      }
    };

    const onVisibleChange = (visible) => {
      if (visible) fetchList();
    };

    const openNotification = async (n) => {
      if (!n.read_at) {
        n.read_at = new Date().toISOString();
        unreadCount.value = Math.max(0, unreadCount.value - 1);
        axios.post(`notifications/${n.id}/read`).catch(() => {});
      }
      popoverOpen.value = false;
      const route = resolveRouteForUser();
      if (route) router.push(route).catch(() => {});
    };

    const markAllRead = async () => {
      try {
        await axios.post("notifications/read_all");
        const now = new Date().toISOString();
        items.value = items.value.map((n) => ({ ...n, read_at: n.read_at || now }));
        unreadCount.value = 0;
      } catch (_) { /* preserve current state on error */ }
    };

    const goToAll = () => {
      popoverOpen.value = false;
      const route = resolveRouteForUser();
      if (route) router.push(route).catch(() => {});
    };

    // Bell is global so we don't know the page context here. Pick a
    // destination per level:
    //   1 (National)   → national review queue
    //   2 (County)     → county budgeting page
    //   3 (Sub-county) → sub-county budgeting page
    const resolveRouteForUser = () => {
      try {
        const raw = localStorage.getItem("currentUser");
        const lvl = raw ? Number(JSON.parse(raw)?.user?.level_id) : null;
        if (lvl === 1) return "/budget/national-review";
        if (lvl === 2) return "/budget/county-budgeting";
        if (lvl === 3) return "/budget/budgeting";
      } catch (_) { /* ignore */ }
      return null;
    };

    const iconFor = (type) => {
      switch (type) {
        case "budget.submitted":       return "send";
        case "budget.county_approved": return "check";
        case "budget.approved":        return "check-circle";
        case "budget.referred":        return "rotate-ccw";
        default:                       return "bell";
      }
    };
    const iconBg = (type) => {
      switch (type) {
        case "budget.approved":        return "bg-success";
        case "budget.county_approved": return "bg-primary";
        case "budget.referred":        return "bg-warning";
        case "budget.submitted":       return "bg-info";
        default:                       return "bg-secondary";
      }
    };
    const relativeTime = (ts) => {
      if (!ts) return "";
      const diff = Math.max(0, Date.now() - new Date(ts).getTime());
      const m = Math.floor(diff / 60_000);
      if (m < 1) return "just now";
      if (m < 60) return `${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h ago`;
      return `${Math.floor(h / 24)}d ago`;
    };

    onMounted(() => {
      fetchCount();
      pollTimer = setInterval(fetchCount, POLL_MS);
    });
    onBeforeUnmount(() => {
      if (pollTimer) clearInterval(pollTimer);
    });

    return {
      items,
      filteredItems,
      activeFilter,
      unreadCount: computed(() => unreadCount.value),
      loading,
      popoverOpen,
      onVisibleChange,
      openNotification,
      markAllRead,
      goToAll,
      iconFor,
      iconBg,
      relativeTime,
    };
  },
});
</script>

<style scoped>
/* Bell trigger -------------------------------------------------- */
.np-bell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5a5f7d;
  transition: color 0.2s ease, transform 0.2s ease;
}
.np-bell:hover { color: #1f9254; }
.np-bell--active { color: #1f9254; }
.np-bell--active :deep(svg) { animation: np-shake 1.6s ease-in-out infinite; }

@keyframes np-shake {
  0%, 92%, 100% { transform: rotate(0); }
  94% { transform: rotate(-12deg); }
  96% { transform: rotate(10deg); }
  98% { transform: rotate(-6deg); }
}

/* Panel shell --------------------------------------------------- */
.np-panel {
  width: 380px;
  max-width: 92vw;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  font-family: inherit;
}

/* Header -------------------------------------------------------- */
.np-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%);
  color: #fff;
}
.np-head__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.np-head__title :deep(svg) { stroke: #fff; }
.np-head__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
}
.np-head__action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.92;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.np-head__action:hover { opacity: 1; text-decoration: underline; }
.np-head__action :deep(svg) { stroke: #fff; }

/* Tabs ---------------------------------------------------------- */
.np-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px 0;
  border-bottom: 1px solid #f1f2f6;
  background: #fafbff;
}
.np-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #5a5f7d;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.np-tab:hover { color: #2b2f3d; }
.np-tab--active {
  color: #20c997;
  border-bottom-color: #20c997;
}
.np-tab__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: #eef0f5;
  color: #5a5f7d;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
}
.np-tab__chip--accent { background: #fff1f0; color: #ff4d4f; }
.np-tab--active .np-tab__chip { background: #e3f9f1; color: #0fbf8a; }

/* States -------------------------------------------------------- */
.np-state {
  padding: 36px 20px;
  text-align: center;
  color: #868eae;
}
.np-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 10px;
  background: #e3f9f1;
  border-radius: 50%;
  color: #0fbf8a;
}
.np-state__icon :deep(svg) { stroke: #0fbf8a; }
.np-state__title {
  margin: 0 0 4px;
  color: #2b2f3d;
  font-size: 14px;
  font-weight: 600;
}
.np-state__sub { margin: 0; font-size: 12px; color: #9299b8; }

.np-spinner {
  width: 28px;
  height: 28px;
  margin: 0 auto 10px;
  border: 3px solid #eef0f5;
  border-top-color: #20c997;
  border-radius: 50%;
  animation: np-spin 0.8s linear infinite;
}
@keyframes np-spin { to { transform: rotate(360deg); } }

/* List ---------------------------------------------------------- */
.np-scroll { max-height: 380px; }
.np-list { list-style: none; margin: 0; padding: 4px 0; }
.np-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px 12px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
  animation: np-fade 0.25s ease both;
}
.np-row + .np-row { border-top: 1px solid #f5f6fa; }
.np-row:hover { background: #f1fbf7; }
.np-row--unread { background: #f6fdfa; }

.np-row__rail {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.np-row--unread .np-row__rail { opacity: 1; }

.np-row__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  color: #fff;
}
.np-row__icon :deep(svg) { stroke: #fff; }

.np-row__body { flex: 1; min-width: 0; }
.np-row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}
.np-row__title {
  color: #2b2f3d;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.np-row__time { color: #9299b8; font-size: 11px; flex-shrink: 0; }
.np-row__msg {
  margin: 0;
  color: #5a5f7d;
  font-size: 12px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.np-row__dot {
  position: absolute;
  top: 16px;
  right: 12px;
  width: 8px;
  height: 8px;
  background: #20c997;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.2);
}

/* Type colours -------------------------------------------------- */
.bg-success   { background: #20c997; }
.bg-primary   { background: #5f63f2; }
.bg-warning   { background: #fa8b0c; }
.bg-info      { background: #00aaff; }
.bg-secondary { background: #868eae; }

/* Footer -------------------------------------------------------- */
.np-foot {
  padding: 10px 16px;
  border-top: 1px solid #f1f2f6;
  background: #fafbff;
  text-align: center;
}
.np-foot a {
  color: #0fbf8a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.np-foot a:hover { text-decoration: underline; }

@keyframes np-fade {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<style>
/* Overlay class (unscoped so antdv wrapper styling applies) */
.np-popover .ant-popover-inner-content { padding: 0; }
.np-popover .ant-popover-inner { border-radius: 12px; overflow: hidden; box-shadow: 0 12px 32px rgba(36, 46, 92, 0.18); }
.np-popover .ant-popover-arrow { display: none; }
</style>
