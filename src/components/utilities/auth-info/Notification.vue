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
        <AtbdTopDropdwon class="atbd-top-dropdwon" style="width: 360px;">
          <sdHeading as="h5" class="atbd-top-dropdwon__title">
            <span class="title-text">Notifications</span>
            <a class="mark-all" v-if="unreadCount > 0" @click.stop="markAllRead">Mark all read</a>
          </sdHeading>

          <div v-if="loading && !items.length" class="np-empty">Loading…</div>
          <div v-else-if="!items.length" class="np-empty">You're all caught up.</div>

          <perfect-scrollbar
            v-else
            :options="{ wheelSpeed: 1, swipeEasing: true, suppressScrollX: true }"
          >
            <ul class="atbd-top-dropdwon__nav notification-list">
              <li v-for="n in items" :key="n.id" @click="openNotification(n)">
                <a class="np-item" :class="{ 'np-unread': !n.read_at }">
                  <div class="atbd-top-dropdwon__content notifications">
                    <div class="notification-icon" :class="iconBg(n.type)">
                      <sdFeatherIcons :type="iconFor(n.type)" />
                    </div>
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">{{ n.title }}</sdHeading>
                        <p class="np-msg">{{ n.message }}</p>
                        <p class="np-time">{{ relativeTime(n.created_at) }}</p>
                      </div>
                      <div class="notification-status">
                        <a-badge dot v-if="!n.read_at" />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </perfect-scrollbar>
        </AtbdTopDropdwon>
      </template>

      <a-badge :count="unreadCount" :offset="[-4, 4]" :overflow-count="99">
        <a class="head-example">
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
import { AtbdTopDropdwon } from "./auth-info-style";
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/Axiosconfig";

const POLL_MS = 60_000;

export default defineComponent({
  name: "Notification",
  components: { AtbdTopDropdwon, PerfectScrollbar },
  setup() {
    const router      = useRouter();
    const items       = ref([]);
    const unreadCount = ref(0);
    const loading     = ref(false);
    const popoverOpen = ref(false);
    let pollTimer     = null;

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
      unreadCount: computed(() => unreadCount.value),
      loading,
      popoverOpen,
      onVisibleChange,
      openNotification,
      markAllRead,
      iconFor,
      iconBg,
      relativeTime,
    };
  },
});
</script>

<style scoped>
.ps { max-height: 360px; }
.np-empty { padding: 24px 16px; text-align: center; color: #868eae; font-size: 13px; }
.np-item { display: block; cursor: pointer; }
.np-item:hover { background: #f4f5f7; }
.np-unread { background: #f8f9fb; }
.np-msg { margin: 2px 0 4px; font-size: 12px; color: #5a5f7d; line-height: 1.4; }
.np-time { margin: 0; font-size: 11px; color: #9299b8; }
.mark-all { font-size: 12px; color: #5f63f2; cursor: pointer; float: right; }
.mark-all:hover { text-decoration: underline; }
</style>
