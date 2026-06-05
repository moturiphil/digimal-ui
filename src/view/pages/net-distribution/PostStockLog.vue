<template>
  <div class="post-log">
    <header class="pl-head">
      <div>
        <h3 class="pl-title">Stock Movement Log — {{ post_name }}</h3>
        <p class="pl-sub">
          Immutable audit trail of every stock change at this post
        </p>
      </div>
      <div class="pl-tools">
        <a-select
          v-model:value="typeFilter"
          placeholder="All movement types"
          allow-clear
          style="min-width: 200px"
          :options="typeOptions"
        />
        <a-input
          v-model:value="search"
          placeholder="Search notes / user"
          allow-clear
          style="min-width: 200px"
        />
      </div>
    </header>

    <div v-if="isLoading" class="pl-loading"><a-spin /></div>

    <template v-else>
      <!-- Desktop / tablet table -->
      <TableWrapper class="table-responsive pl-table">
        <a-table
          :dataSource="filteredMovements"
          :columns="columns"
          :pagination="{ pageSize: 25, showSizeChanger: true }"
          size="small"
          row-key="id"
        >
          <template #type="{ record }">
            <td>
              <a-tag :color="typeColor(record.movement_type)">{{
                prettyType(record.movement_type)
              }}</a-tag>
            </td>
          </template>
          <template #qdelta="{ record }">
            <td>
              <span :class="deltaClass(record.quantity_delta)">
                {{ record.quantity_delta > 0 ? "+" : ""
                }}{{ record.quantity_delta }}
              </span>
            </td>
          </template>
          <template #vdelta="{ record }">
            <td>
              <span :class="deltaClass(record.quantity_verified_delta)">
                {{ record.quantity_verified_delta > 0 ? "+" : ""
                }}{{ record.quantity_verified_delta }}
              </span>
            </td>
          </template>
        </a-table>
      </TableWrapper>

      <!-- Mobile cards -->
      <div class="pl-cards">
        <article
          v-for="m in filteredMovements"
          :key="m.id"
          class="pl-card"
        >
          <div class="pl-card-head">
            <a-tag :color="typeColor(m.movement_type)">{{
              prettyType(m.movement_type)
            }}</a-tag>
            <span class="pl-time">{{ m.created_at }}</span>
          </div>
          <div class="pl-card-grid">
            <div>
              <span class="lbl">Δ System</span>
              <span class="val" :class="deltaClass(m.quantity_delta)"
                >{{ m.quantity_delta > 0 ? "+" : "" }}{{ m.quantity_delta }}</span
              >
            </div>
            <div>
              <span class="lbl">Δ Verified</span>
              <span class="val" :class="deltaClass(m.quantity_verified_delta)"
                >{{ m.quantity_verified_delta > 0 ? "+" : ""
                }}{{ m.quantity_verified_delta }}</span
              >
            </div>
            <div>
              <span class="lbl">Bal. System</span>
              <span class="val">{{ m.balance_after }}</span>
            </div>
            <div>
              <span class="lbl">Bal. Verified</span>
              <span class="val">{{ m.balance_verified_after }}</span>
            </div>
          </div>
          <div class="pl-card-foot">
            <span class="by">{{ m.created_by }}</span>
            <span v-if="m.notes" class="note">{{ m.notes }}</span>
          </div>
        </article>
        <div v-if="!filteredMovements.length" class="pl-empty">
          No stock movements recorded.
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "@/Axiosconfig";
import { TableWrapper } from "../../styled";

const { query } = useRoute();
const post_id = Number(query.id);
const post_name = query.name;

const isLoading = ref(true);
const movements = ref([]);
const typeFilter = ref(undefined);
const search = ref("");

const columns = [
  { title: "Date / Time", dataIndex: "created_at", key: "created_at" },
  { title: "Type", key: "type", slots: { customRender: "type" } },
  { title: "Δ System", key: "qdelta", slots: { customRender: "qdelta" } },
  { title: "Δ Verified", key: "vdelta", slots: { customRender: "vdelta" } },
  { title: "Bal. System", dataIndex: "balance_after", key: "balance_after" },
  {
    title: "Bal. Verified",
    dataIndex: "balance_verified_after",
    key: "balance_verified_after",
  },
  { title: "By", dataIndex: "created_by", key: "created_by" },
  { title: "Notes", dataIndex: "notes", key: "notes" },
];

const typeOptions = computed(() => {
  const types = [...new Set(movements.value.map((m) => m.movement_type))];
  return types.map((t) => ({ value: t, label: prettyType(t) }));
});

const filteredMovements = computed(() => {
  let rows = movements.value;
  if (typeFilter.value) {
    rows = rows.filter((m) => m.movement_type === typeFilter.value);
  }
  const q = search.value.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (m) =>
        (m.notes || "").toLowerCase().includes(q) ||
        (m.created_by || "").toLowerCase().includes(q)
    );
  }
  return rows;
});

const prettyType = (t) =>
  (t || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const typeColor = (t) => {
  const s = (t || "").toLowerCase();
  if (s.includes("verification")) return "green";
  if (s.includes("delivery") || s.includes("receive")) return "blue";
  if (s.includes("transfer")) return "purple";
  if (s.includes("return") || s.includes("damage")) return "orange";
  if (s.includes("opening") || s.includes("closing")) return "geekblue";
  return "default";
};

const deltaClass = (v) => {
  const n = Number(v);
  if (n > 0) return "pos";
  if (n < 0) return "neg";
  return "muted";
};

const fetchMovements = async () => {
  try {
    const { data } = await axios.get(`posts/${post_id}/stock-movements`);
    if (data.success) movements.value = data.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  isLoading.value = true;
  await fetchMovements();
  isLoading.value = false;
});
</script>

<style lang="less" scoped>
.post-log {
  .pl-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .pl-title {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    color: #1f2437;
  }
  .pl-sub {
    margin: 2px 0 0;
    font-size: 12px;
    color: #8a90a6;
  }
  .pl-tools {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pl-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .pl-table {
    :deep(.ant-table) {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e6f2eb;
      box-shadow: 0 4px 14px rgba(28, 122, 72, 0.06);
    }
    :deep(.ant-table-thead > tr > th) {
      background: #f4fbf6;
      color: #2f6746;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f3fbf6;
    }
  }

  .pos {
    color: #20c997;
    font-weight: 700;
  }
  .neg {
    color: #ff4d4f;
    font-weight: 700;
  }
  .muted {
    color: #9299b8;
  }

  /* mobile cards */
  .pl-cards {
    display: none;
    flex-direction: column;
    gap: 12px;
  }
  .pl-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }
  .pl-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .pl-time {
    font-size: 12px;
    color: #8a90a6;
  }
  .pl-card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin-bottom: 12px;
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
      font-size: 14px;
      font-weight: 700;
      color: #2f3a35;
    }
  }
  .pl-card-foot {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid #f1f7f3;
    padding-top: 10px;
    .by {
      font-size: 12px;
      font-weight: 600;
      color: #2f6746;
    }
    .note {
      font-size: 12px;
      color: #5a7a68;
      word-break: break-word;
    }
  }
  .pl-empty {
    text-align: center;
    padding: 36px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  @media (max-width: 767px) {
    .pl-table {
      display: none;
    }
    .pl-cards {
      display: flex;
    }
    .pl-tools {
      width: 100%;
    }
    .pl-tools :deep(.ant-select),
    .pl-tools :deep(.ant-input-affix-wrapper),
    .pl-tools :deep(.ant-input) {
      width: 100%;
    }
  }
}
</style>
