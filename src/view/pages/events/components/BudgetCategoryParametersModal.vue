<template>
  <a-modal
    :visible="visible"
    :width="860"
    :title="`Budget Category Parameters — ${props.categoryName || ''}`"
    :footer="null"
    :mask-closable="false"
    :destroy-on-close="true"
    @cancel="close"
  >
    <div class="bcpm-wrap">
      <div v-if="loading" class="bcpm-loading">
        <a-spin /> <span>Loading budget parameters…</span>
      </div>

      <template v-else>
        <p class="bcpm-intro">
          These are the cost parameters planned in the linked budget template
          and how much has actually been spent from it so far.
        </p>

        <!-- Summary tiles -->
        <div class="bcpm-summary">
          <div class="bcpm-tile">
            <span class="bcpm-tile-label">Allocated budget (this event)</span>
            <span class="bcpm-tile-value">{{ fmtKes(meta.category_total) }}</span>
          </div>
          <div class="bcpm-tile">
            <span class="bcpm-tile-label">Actual spend</span>
            <span class="bcpm-tile-value">{{ fmtKes(meta.total_actual_spend) }}</span>
          </div>
        </div>

        <a-alert
          v-if="!items.length"
          type="info"
          show-icon
          class="bcpm-empty"
          message="No line items found for this budget template."
        />

        <!-- Parameters table -->
        <TableWrapper class="bcpm-table table-responsive">
          <a-table
            :pagination="false"
            :dataSource="items"
            :columns="columns"
            row-key="id"
            size="small"
          >
          </a-table>
        </TableWrapper>
      </template>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { notification } from "ant-design-vue";
import { fetchCategoryLineItems } from "@/services/budgetLink";
import { TableWrapper } from "../../../styled";

const props = defineProps({
  visible: { type: Boolean, default: false },
  budgetId: { type: [Number, String], default: null },
  categoryId: { type: [Number, String], default: null },
  categoryName: { type: String, default: "" },
  targetName: { type: String, default: "" },
});

const emit = defineEmits(["update:visible"]);

const loading = ref(false);
const meta = ref({});
const items = ref([]);

const columns = [
  { title: "Parameter", dataIndex: "label", key: "label" },
  { title: "Basis", dataIndex: "unit_definition", key: "unit_definition" },
  { title: "Units", dataIndex: "unit_count", key: "unit_count", align: "right" },
  { title: "Unit Cost (KES)", dataIndex: "unit_cost", key: "unit_cost", align: "right" },
  { title: "Planned Cost (KES)", dataIndex: "effective_total", key: "effective_total", align: "right" },
  { title: "Actual (KES)", dataIndex: "actual_spent", key: "actual_spent", align: "right" },
];

const fmtKes = (n) => {
  const v = Number(n || 0);
  return Number.isNaN(v) ? "0.00" : v.toLocaleString("en-KE", { minimumFractionDigits: 2 });
};

const fmtUnits = (item) => {
  const headcount = Number(item?.headcount_actual_units || 0);
  const non = Number(item?.unit_count_used || 0);
  const extra = (headcount + non) > 0 ? ` (${headcount + non} used)` : "";
  return `${Number(item?.unit_count || 0)}${extra}`;
};

const normalize = (item) => {
  const planned = Number(item?.override_value ?? item?.total_cost ?? 0);
  const actual =
    Number(item?.headcount_actual_spent || 0) +
    Number(item?.non_headcount_actual_spent || 0);
  return {
    id: item.id,
    label: item.label,
    unit_definition: item.unit_definition,
    unit_count: fmtUnits(item),
    unit_cost: fmtKes(item.unit_cost),
    effective_total: fmtKes(planned),
    actual_spent: fmtKes(actual),
  };
};

const fetchItems = async () => {
  loading.value = true;
  try {
    const data = await fetchCategoryLineItems(props.budgetId, props.categoryId);
    meta.value = data.meta || {};
    items.value = (data.items || []).map(normalize);
  } catch (e) {
    items.value = [];
    notification.error({
      message: "Error",
      description:
        e?.response?.data?.message ||
        "Could not load the budget category parameters.",
    });
  } finally {
    loading.value = false;
  }
};

// NOTE: the watcher is intentionally declared AFTER `fetchItems`. Because it
// uses `immediate: true` (so it runs once at mount time — the modal is mounted
// v-if together with visible=true, so a non-immediate watcher would never fire
// on first open), `fetchItems` must already be initialized as a `const` before
// the immediate callback runs.
watch(
  () => props.visible,
  (open) => {
    if (open && props.budgetId && props.categoryId) fetchItems();
  },
  { immediate: true }
);

const close = () => {
  emit("update:visible", false);
};
</script>

<style scoped>
.bcpm-wrap { padding-top: 2px; }
.bcpm-loading { display: flex; align-items: center; gap: 10px; color: #666; }
.bcpm-intro { color: #555; font-size: 12.5px; margin-bottom: 10px; line-height: 1.5; }
.bcpm-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.bcpm-tile {
  flex: 1;
  background: #f6fbf8;
  border: 1px solid #e1efe6;
  border-radius: 8px;
  padding: 10px 14px;
}
.bcpm-tile-label {
  display: block;
  font-size: 11px;
  color: #7a8a82;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bcpm-tile-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #15693c;
  margin-top: 2px;
}
.bcpm-empty { margin-bottom: 12px; }
.bcpm-table { margin-top: 6px; }
</style>