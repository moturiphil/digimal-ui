<template>
  <!-- Voided budgets have dropped out of the pipeline entirely. -->
  <div v-if="isVoided" class="bsp bsp--voided" :class="{ 'bsp--compact': compact }">
    <span class="bsp-voided">Voided — no longer in the review pipeline</span>
  </div>

  <div
    v-else
    class="bsp"
    :class="{ 'bsp--compact': compact }"
    role="list"
    :aria-label="`Budget progress: ${activeLabel}`"
  >
    <div
      v-for="(step, i) in steps"
      :key="step.status"
      role="listitem"
      class="bsp-step"
      :class="[stepState(step, i), { 'is-mine': isMine(step) }]"
      :title="nodeTitle(step, i)"
    >
      <div class="bsp-node">
        <span class="bsp-node-icon">{{ nodeIcon(step, i) }}</span>
      </div>
      <div class="bsp-label">{{ step.label }}</div>
      <div v-if="isMine(step)" class="bsp-you">YOU</div>
    </div>
  </div>
</template>

<script>
/**
 * Horizontal stage pipeline for a single campaign budget.
 *
 * Shows exactly where a county / sub-county budget sits in its lifecycle and
 * which stages still lie ahead — the primary need of the DNMP Accountant,
 * Finance Officer and Program Accountant on the review page.
 *
 *   Sub-county standard:  Preparatory → County Review → County Approved → National Approval → Approved
 *   County standard:      Preparatory → DNMP Review   → National Approval → Approved
 *   Special Area Cost:    Preparatory → DNMP Review   → National Approval → Approved
 *
 * The `actionStatus` prop marks the step at which the acting role reviews or
 * approves (accented + a small "YOU" flag) so a reviewer can see what still has
 * to happen BEFORE a budget reaches them.
 *
 * Labels mirror CampaignBudgetController::statusToStageLabel() so the frontend
 * and backend describe the same stage with the same words.
 */
const SUB_COUNTY_STEPS = [
  { status: 'draft',           label: 'Preparatory',       icon: '✎' },
  { status: 'submitted',       label: 'County Review',     icon: '◔' },
  { status: 'county_approved', label: 'County Approved',   icon: '◑' },
  { status: 'dnmp_reviewed',   label: 'National Approval', icon: '⌛' },
  { status: 'approved',        label: 'Approved',          icon: '★' },
];

const COUNTY_STEPS = [
  { status: 'draft',         label: 'Preparatory',       icon: '✎' },
  { status: 'submitted',     label: 'DNMP Review',       icon: '◔' },
  { status: 'dnmp_reviewed', label: 'National Approval', icon: '⌛' },
  { status: 'approved',      label: 'Approved',          icon: '★' },
];

export default {
  name: 'BudgetStagePipeline',
  props: {
    /** Raw budget status: draft | submitted | county_approved | dnmp_reviewed | approved | voided */
    status: { type: String, default: null },
    /** True for a sub-county-level budget; false for county-level. */
    isSubCounty: { type: Boolean, default: true },
    /** True for a Special Area Cost budget (it skips the county stage). */
    isSpecialArea: { type: Boolean, default: false },
    /** Status at which the acting role reviews/approves — accented when set. */
    actionStatus: { type: String, default: null },
    /** Smaller variant for grid tiles. */
    compact: { type: Boolean, default: false },
  },
  computed: {
    isVoided() {
      return this.status === 'voided';
    },
    /** SAC budgets never enter the county stage, so they use the county pipeline. */
    steps() {
      return !this.isSpecialArea && this.isSubCounty ? SUB_COUNTY_STEPS : COUNTY_STEPS;
    },
    /** Index of the step matching the current status (-1 when unknown). */
    currentIndex() {
      return this.steps.findIndex((s) => s.status === this.status);
    },
    activeLabel() {
      const step = this.steps[this.currentIndex];
      return step ? step.label : (this.status || 'Unknown');
    },
  },
  methods: {
    /** done | active | upcoming — drives node/connector styling. */
    stepState(step, i) {
      const cur = this.currentIndex;
      if (cur < 0) return 'upcoming';
      if (i < cur) return 'done';
      if (i === cur) return 'active';
      return 'upcoming';
    },
    /** Does this step belong to the acting role's review/approve window? */
    isMine(step) {
      return !!this.actionStatus && step.status === this.actionStatus;
    },
    nodeIcon(step, i) {
      return this.stepState(step, i) === 'done' ? '✓' : step.icon;
    },
    nodeTitle(step, i) {
      const state = this.stepState(step, i);
      const where = { done: 'completed', active: 'current stage', upcoming: 'upcoming' }[state];
      const mine = this.isMine(step) ? ' — your review/approval stage' : '';
      return `${step.label} (${where})${mine}`;
    },
  },
};
</script>

<style scoped>
.bsp {
  display: flex;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  overflow-x: auto;
  padding: 4px 0;
}

.bsp-step {
  position: relative;
  flex: 1 1 0;
  min-width: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 2px;
}

/* Connector between consecutive nodes */
.bsp-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  left: calc(50% + 14px);
  right: calc(-50% + 14px);
  height: 2px;
  background: #e3e6ef;
  z-index: 0;
}
.bsp-step.done:not(:last-child)::after { background: #15693c; }
.bsp-step.active:not(:last-child)::after { background: linear-gradient(90deg, #15693c, #e3e6ef); }

.bsp-node {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f0f2f5;
  border: 2px solid #e3e6ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #9299b8;
  position: relative;
  z-index: 1;
  transition: all 0.2s;
}
.bsp-step.done .bsp-node { background: #15693c; border-color: #15693c; color: #fff; }
.bsp-step.active .bsp-node {
  background: #fff;
  border-color: #15693c;
  color: #15693c;
  box-shadow: 0 0 0 4px rgba(21, 105, 60, 0.15);
}
.bsp-step.upcoming .bsp-node { background: #fafbfc; border-color: #e9ecf2; color: #c3c8d4; }

/* The stage at which the acting role reviews/approves */
.bsp-step.is-mine .bsp-node { border-color: #2C99FF; color: #2C99FF; }
.bsp-step.is-mine.done .bsp-node { background: #2C99FF; border-color: #2C99FF; color: #fff; }
.bsp-step.is-mine.active .bsp-node { box-shadow: 0 0 0 4px rgba(44, 153, 255, 0.18); }

.bsp-label {
  margin-top: 6px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.2px;
  color: #adb5c9;
}
.bsp-step.done .bsp-label { color: #15693c; }
.bsp-step.active .bsp-label { color: #272B41; }
.bsp-step.is-mine .bsp-label { color: #2C99FF; }

.bsp-you {
  margin-top: 3px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #2C99FF;
  background: #eaf5ff;
  border-radius: 6px;
  padding: 0 5px;
}

.bsp-voided {
  font-size: 11px;
  font-weight: 600;
  color: #9299b8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* ── Compact variant (grid tiles) ── */
.bsp--compact { padding: 2px 0 0; }
.bsp--compact .bsp-step { min-width: 42px; }
.bsp--compact .bsp-node { width: 18px; height: 18px; font-size: 9px; border-width: 1.5px; }
.bsp--compact .bsp-step:not(:last-child)::after {
  top: 8px;
  left: calc(50% + 10px);
  right: calc(-50% + 10px);
}
.bsp--compact .bsp-label { margin-top: 4px; font-size: 8px; letter-spacing: 0; }
.bsp--compact .bsp-you { display: none; }
</style>
