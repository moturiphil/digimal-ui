<template>
  <div
    class="budget-status-card"
    :class="[`status-${kind}`, { clickable: !!$attrs.onClick }]"
    role="button"
    tabindex="0"
    @click="$emit('click', $event)"
    @keydown.enter="$emit('click', $event)"
    @keydown.space.prevent="$emit('click', $event)"
  >
    <div class="bsc-row">
      <div class="bsc-title">
        <span class="bsc-icon">▦</span>
        <span>{{ title }}</span>
      </div>
      <a-tag :color="tagColor" class="bsc-status">{{ label }}</a-tag>
    </div>

    <div class="bsc-meta">
      <span v-if="financialYear"><strong>FY:</strong> {{ financialYear }}</span>
      <span v-if="grandTotal != null"><strong>Total:</strong> KES {{ formattedTotal }}</span>
      <span v-if="submittedAt"><strong>Submitted:</strong> {{ formatDate(submittedAt) }}</span>
    </div>

    <div v-if="isReferred" class="bsc-hint">
      Click to open the budget and view the reviewer's feedback.
    </div>
    <div v-else class="bsc-hint">
      Click to view the budget details.
    </div>
  </div>
</template>

<script>
/* Status card shown to the budget owner (County / Sub-County user) when
 * a budget has already been submitted (or referred back). The card is the
 * entry point — clicking it opens the existing detail / parameter view. */
export default {
  name: 'BudgetStatusCard',
  inheritAttrs: false,
  emits: ['click'],
  props: {
    title: { type: String, required: true },
    /** Raw budget status: draft | submitted | county_approved | approved | voided */
    status: { type: String, required: true },
    /** True when the budget was referred back by a reviewer */
    isReferred: { type: Boolean, default: false },
    /** True when this is a sub-county budget; false for county-level */
    isSubCounty: { type: Boolean, default: false },
    financialYear: { type: [String, Number], default: null },
    grandTotal: { type: [String, Number], default: null },
    submittedAt: { type: String, default: null },
  },
  computed: {
    /**
     * Derives the user-facing stage label per the lifecycle:
     *   Sub-county: submitted → County Review,
     *               county_approved → County Approved,
     *               dnmp_reviewed → National Review (awaiting Finance Officer),
     *               approved → National Approved
     *   County:     submitted → DNMP Review,
     *               dnmp_reviewed → National Review (awaiting Finance Officer),
     *               approved → National Approved
     *   is_referred=true overrides any of the above with "Referred".
     */
    label() {
      if (this.isReferred) return 'Referred';
      if (this.status === 'approved') return 'National Approved';
      if (this.status === 'dnmp_reviewed') return 'National Review';
      if (this.status === 'county_approved') return 'County Approved';
      if (this.status === 'submitted') {
        return this.isSubCounty ? 'County Review' : 'DNMP Review';
      }
      if (this.status === 'draft') return 'Draft';
      if (this.status === 'voided') return 'Voided';
      return this.status;
    },
    /** Coarse category used for styling. */
    kind() {
      if (this.isReferred) return 'referred';
      if (this.status === 'approved') return 'national-approved';
      if (this.status === 'dnmp_reviewed') return 'national-review';
      if (this.status === 'county_approved') return 'county-approved';
      if (this.status === 'submitted') {
        return this.isSubCounty ? 'county-review' : 'national-review';
      }
      return 'draft';
    },
    tagColor() {
      return {
        'referred': 'red',
        'national-approved': 'green',
        'county-approved': 'blue',
        'county-review': 'orange',
        'national-review': 'geekblue',
        'draft': 'default',
      }[this.kind] || 'default';
    },
    formattedTotal() {
      const n = Number(this.grandTotal);
      return Number.isFinite(n) ? n.toLocaleString() : '0';
    },
  },
  methods: {
    formatDate(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
  },
};
</script>

<style scoped>
.budget-status-card {
  border: 1px solid #e6e8ef;
  border-left: 4px solid #c8cdd8;
  border-radius: 8px;
  padding: 16px 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.budget-status-card.clickable {
  cursor: pointer;
}
.budget-status-card.clickable:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.bsc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.bsc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: #2b3245;
}
.bsc-icon {
  color: #8b8fa3;
}
.bsc-status {
  margin: 0;
  font-weight: 600;
}
.bsc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 13px;
  color: #5a5f7d;
}
.bsc-hint {
  font-size: 12px;
  color: #8b8fa3;
}

/* status-tinted left border */
.status-referred           { border-left-color: #f5222d; }
.status-national-approved  { border-left-color: #52c41a; }
.status-county-approved    { border-left-color: #1677ff; }
.status-county-review      { border-left-color: #fa8c16; }
.status-national-review    { border-left-color: #2f54eb; }
.status-draft              { border-left-color: #c8cdd8; }
</style>
