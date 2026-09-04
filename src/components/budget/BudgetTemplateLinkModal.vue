<template>
  <a-modal
    :visible="visible"
    :width="680"
    :title="`Link Budget Template — ${targetName || ''}`"
    :footer="null"
    :mask-closable="false"
    :destroy-on-close="true"
    @cancel="close"
  >
    <div class="btl-modal">
      <!-- Already linked + not allowed to re-link → read only, no re-link -->
      <a-alert v-if="linked && !allowRelink" type="success" show-icon class="btl-alert">
        <template #message>Already linked to a budget template</template>
        <template #description>
          <p>
            This {{ targetType }} is budgeted against
            <b>{{ currentLink?.budget_category_name || 'a budget template' }}</b>.
            Spend is attributed on close, so the template cannot be changed.
            Contact the county budget office if a correction is needed.
          </p>
        </template>
      </a-alert>

      <!-- Editable (unlinked, or already-linked + re-link permitted) -->
      <template v-else>
        <!-- Head of the list: unobtrusive callout when re-linking is allowed -->
        <a-alert
          v-if="linked && allowRelink"
          type="warning"
          show-icon
          class="btl-alert"
          message="Re-linking — you can move this target to a different budget template."
        />

        <!-- Loading -->
        <div v-if="loading" class="btl-loading">
          <a-spin /> <span>Loading approved campaign budgets…</span>
        </div>

        <!-- Linked form -->
        <template v-else>
        <p class="btl-intro">
          Link this {{ targetType }} to an <b>approved campaign budget</b> and a
          <b>budget template</b> (a budget category within it). Participant slots
          and costs are drawn from the template's pool, shared across all
          {{ targetType }}s linked to the same template.
        </p>

        <a-form layout="vertical">
          <!-- Step 1: Campaign budget -->
          <a-form-item label="1. Campaign budget">
            <a-select
              v-model:value="selectedBudgetId"
              placeholder="Select an approved campaign budget"
              show-search
              allow-clear
              option-filter-prop="label"
              :loading="budgetsLoading"
              style="width: 100%"
              @change="onBudgetChange"
            >
              <a-select-option
                v-for="b in budgets"
                :key="b.id"
                :value="b.id"
                :label="b.label"
                :disabled="!b.is_approved"
              >
                <strong>{{ b.label }}</strong>
                <a-tag v-if="!b.is_approved" color="orange" class="btl-status-tag">
                  {{ b.status_label }}
                </a-tag>
                <span v-if="b.grand_total != null">
                  — KES {{ formatKes(b.grand_total) }}
                </span>
              </a-select-option>
            </a-select>
            <a-alert
              v-if="hasUnapprovedBudgets"
              type="info"
              show-icon
              class="btl-alert"
              message="Some budgets are not yet approved. Only approved budgets can be linked — select the approved one (or wait for approval)."
            />
          </a-form-item>

          <!-- Step 2: Budget template (category) -->
          <a-form-item label="2. Budget template">
            <a-alert
              v-if="selectedBudgetId && !budgetHasCategories"
              type="warning"
              show-icon
              class="btl-alert"
              message="This budget has no matching {{ targetType }} templates."
            />
            <a-alert
              v-else-if="!selectedBudgetId"
              type="info"
              show-icon
              class="btl-alert"
              message="Choose a campaign budget to load its templates."
            />
            <a-select
              v-else
              v-model:value="selectedCategoryId"
              placeholder="Select a budget template"
              show-search
              allow-clear
              option-filter-prop="label"
              :loading="categoriesLoading"
              style="width: 100%"
            >
              <a-select-option
                v-for="c in categories"
                :key="c.category_id"
                :value="c.category_id"
                :label="categoryLabel(c)"
              >
                <strong>{{ c.name }}</strong>
                <span v-if="c.planned_capacity != null" class="btl-capacity">
                  &nbsp;·&nbsp;{{ c.planned_capacity }} participant slots
                </span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>

        <div class="btl-actions">
          <sdButton size="small" type="light" outlined @click="close">
            Cancel
          </sdButton>
          <sdButton
            type="primary"
            size="small"
            :disabled="!canLink || linking"
            @click="submit"
          >
            <sdFeatherIcons type="link" size="13" />&nbsp;
            {{ linking ? "Linking…" : `Link ${targetLabel}` }}
          </sdButton>
        </div>
        </template>
      </template>
    </div>
  </a-modal>
</template>
<script setup>
import { ref, computed, watch, defineProps, defineEmits } from "vue";
import { notification } from "ant-design-vue";
import {
  fetchApprovedBudgets,
  fetchBudgetCategories,
  linkTarget,
} from "@/services/budgetLink";

const props = defineProps({
  visible: { type: Boolean, default: false },
  targetType: { type: String, default: "event" }, // 'event' | 'activity'
  targetId: { type: [Number, String], default: null },
  targetName: { type: String, default: "" },
  currentLink: { type: Object, default: null },
  // When true, an already-linked target can be re-linked to a different
  // template (super admin / accountant only). Off by default.
  allowRelink: { type: Boolean, default: false },
});

const emit = defineEmits(["update:visible", "linked"]);

const loading = ref(false);
const budgetsLoading = ref(false);
const categoriesLoading = ref(false);
const linking = ref(false);

const budgets = ref([]);
const categories = ref([]);
const selectedBudgetId = ref(null);
const selectedCategoryId = ref(null);

const targetLabel = computed(() =>
  props.targetType === "activity" ? "Activity" : "Event"
);

const linked = computed(
  () =>
    !!(props.currentLink?.campaign_budget_id && props.currentLink?.budget_category_id)
);

const budgetHasCategories = computed(() => categories.value.length > 0);

const hasUnapprovedBudgets = computed(
  () => budgets.value.some((b) => !b.is_approved)
);

const canLink = computed(
  () =>
    !!selectedBudgetId.value &&
    !!selectedCategoryId.value &&
    (!linked.value || props.allowRelink)
);

const formatKes = (n) => {
  const v = Number(n || 0);
  return Number.isNaN(v)
    ? "0.00"
    : v.toLocaleString("en-KE", { minimumFractionDigits: 2 });
};

const categoryLabel = (c) =>
  c.planned_capacity != null
    ? `${c.name} · ${c.planned_capacity} slots`
    : c.name;

watch(
  () => props.visible,
  (open) => {
    if (open && (!linked.value || props.allowRelink)) loadBudgets();
  }
);

const loadBudgets = async () => {
  budgetsLoading.value = true;
  try {
    budgets.value = await fetchApprovedBudgets();
  } catch (e) {
    budgets.value = [];
    notification.error({
      message: "Error",
      description:
        e?.response?.data?.message ||
        "Could not load approved campaign budgets.",
    });
  } finally {
    budgetsLoading.value = false;
  }
};

const onBudgetChange = async (budgetId) => {
  selectedCategoryId.value = null;
  categories.value = [];
  if (!budgetId) return;

  categoriesLoading.value = true;
  try {
    categories.value = await fetchBudgetCategories(budgetId, props.targetType);
  } catch (e) {
    categories.value = [];
    notification.error({
      message: "Error",
      description:
        e?.response?.data?.message ||
        "Could not load budget templates for this budget.",
    });
  } finally {
    categoriesLoading.value = false;
  }
};

const submit = async () => {
  if (!canLink.value || !props.targetId) return;
  linking.value = true;
  try {
    const data = await linkTarget(
      props.targetType,
      props.targetId,
      selectedBudgetId.value,
      selectedCategoryId.value
    );
    notification.success({
      message: linked.value
        ? "Budget template re-linked"
        : "Budget template linked",
      description: `This ${targetLabel.value.toLowerCase()} is now budgeted against the selected template.`,
    });
    close();
    emit("linked", data?.data || {});
  } catch (e) {
    notification.error({
      message: "Could not link budget template",
      description:
        e?.response?.data?.message ||
        "Please try again, or contact support if the problem persists.",
    });
  } finally {
    linking.value = false;
  }
};

const close = () => {
  emit("update:visible", false);
};
</script>

<style scoped>
.btl-modal { padding-top: 4px; }
.btl-loading { display: flex; align-items: center; gap: 10px; color: #666; }
.btl-alert { margin-bottom: 12px; }
.btl-status-tag { margin-left: 6px; font-size: 11px; line-height: 1; }
.btl-intro { color: #555; margin-bottom: 12px; line-height: 1.5; }
.btl-capacity { color: #555; }
.btl-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
</style>