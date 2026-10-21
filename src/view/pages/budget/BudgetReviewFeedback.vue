<template>
  <section v-if="visible" class="panel review-feedback">
    <header class="rf-head">
      <strong>National review feedback</strong>
      <span v-if="changes.length" class="rf-count">
        {{ changes.length }} {{ changes.length === 1 ? 'change' : 'changes' }}
      </span>
    </header>

    <p class="rf-intro">
      What the national team did to this budget after you submitted it. Every
      changed figure keeps the reviewer's comment, their role and the time it was
      made — the audit trail cannot be edited or deleted.
    </p>

    <a-spin :spinning="loading">
      <!-- ── DNMP review (who reviewed + their notes) ─────────────────── -->
      <div v-if="dnmpReview" class="rf-stage">
        <span class="rf-stage-label">DNMP Review</span>
        <span class="rf-actor">
          {{ dnmpReview.reviewed_by?.name || 'National reviewer' }}
          <span v-if="dnmpReview.reviewed_by?.role" class="rf-role">
            ({{ dnmpReview.reviewed_by.role }})
          </span>
        </span>
        <span v-if="dnmpReview.reviewed_at" class="rf-at">
          · {{ formatDate(dnmpReview.reviewed_at) }}
        </span>
        <p v-if="dnmpReview.notes" class="rf-notes">“{{ dnmpReview.notes }}”</p>
      </div>

      <!-- ── The changes themselves ────────────────────────────────────── -->
      <div v-if="changes.length" class="rf-changes">
        <p class="rf-changes-label">
          Figures changed during the national review:
        </p>
        <a-table
          :data-source="changes"
          :columns="columns"
          :pagination="false"
          size="small"
          row-key="id"
          class="rf-table"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.key === 'category'" class="rf-category">
              {{ record.category_label || '—' }}
            </span>
            <span v-else-if="column.key === 'item'">{{ record.item_label }}</span>
            <span v-else-if="column.key === 'field'">{{ record.field_label }}</span>
            <span v-else-if="column.key === 'change'">
              <span class="rf-orig">{{ displayValue(record.original_value) }}</span>
              <span class="rf-arrow"> → </span>
              <span class="rf-upd">{{ displayValue(record.updated_value) }}</span>
            </span>
            <span v-else-if="column.key === 'reviewer'">
              {{ record.reviewer_name || '—' }}
              <span v-if="record.reviewer_role" class="rf-role">
                ({{ record.reviewer_role }})
              </span>
            </span>
            <span v-else-if="column.key === 'comment'">{{ record.comment || '—' }}</span>
            <span v-else>{{ formatDate(record.at) }}</span>
          </template>
        </a-table>
      </div>

      <!-- ── Sign-offs ─────────────────────────────────────────────────── -->
      <div class="rf-signoffs">
        <div v-if="countyApproval" class="rf-signoff">
          <span class="rf-stage-label">County approval</span>
          <span class="rf-actor">
            {{ countyApproval.approved_by?.name || 'County approver' }}
            <span v-if="countyApproval.approved_by?.role" class="rf-role">
              ({{ countyApproval.approved_by.role }})
            </span>
          </span>
          <span v-if="countyApproval.approved_at" class="rf-at">
            · {{ formatDate(countyApproval.approved_at) }}
          </span>
        </div>

        <div v-if="nationalApproval" class="rf-signoff rf-signoff--approved">
          <span class="rf-stage-label">National approval</span>
          <span class="rf-actor">
            {{ nationalApproval.approved_by?.name || 'National approver' }}
            <span v-if="nationalApproval.approved_by?.role" class="rf-role">
              ({{ nationalApproval.approved_by.role }})
            </span>
          </span>
          <span v-if="nationalApproval.approved_at" class="rf-at">
            · {{ formatDate(nationalApproval.approved_at) }}
          </span>
        </div>
      </div>
    </a-spin>
  </section>
</template>

<script>
/**
 * Owner-facing review feedback for a county / sub-county budget.
 *
 * Shows the county / sub-county user what the NATIONAL team did to their budget
 * after it was submitted:
 *
 *   • every figure a reviewer changed during the DNMP Review stage — the
 *     mandatory comment, who made the change, their role and the timestamp,
 *   • the DNMP reviewer's overall notes,
 *   • the county sign-off (sub-county budgets only), and
 *   • who approved the budget at NATIONAL level, with their role and the time.
 *
 * Data comes from the read-only, ownership-scoped endpoint
 * `get_budget_review_feedback/{campaign_budget_id}` — the backend only returns
 * feedback for budgets belonging to the signed-in user's own county /
 * sub-county, so this component never needs to filter anything itself.
 *
 * The component is self-fetching: give it a `budgetId` and it renders nothing
 * until the budget actually has review feedback to show.
 */
import axios from '@/Axiosconfig';

export default {
  name: 'BudgetReviewFeedback',
  props: {
    /** campaign_budgets.id of the budget whose feedback should be shown. */
    budgetId: { type: [Number, String], default: null },
    /**
     * Raw budget status. A `draft` has never left the owner and a `voided`
     * budget is out of the chain, so neither can carry review feedback — the
     * component skips the request for those.
     */
    status: { type: String, default: null },
    /** False hides the panel entirely (e.g. the caller lacks the permission). */
    canView: { type: Boolean, default: true },
  },
  data() {
    return {
      loading: false,
      feedback: null,
      // Reviewer change-history columns (same shape as the national review
      // pane, so both audiences read the trail identically).
      columns: [
        { title: 'Budget Category', key: 'category', width: 180 },
        { title: 'Budget Item', key: 'item' },
        { title: 'Field', key: 'field', width: 110 },
        { title: 'Change', key: 'change', width: 160 },
        { title: 'Changed by', key: 'reviewer', width: 220 },
        { title: 'Comment', key: 'comment' },
        { title: 'When', key: 'at', width: 150 },
      ],
    };
  },
  computed: {
    changes() {
      return (this.feedback && this.feedback.changes) || [];
    },
    dnmpReview() {
      return (this.feedback && this.feedback.dnmp_review) || null;
    },
    countyApproval() {
      return (this.feedback && this.feedback.county_approval) || null;
    },
    nationalApproval() {
      return (this.feedback && this.feedback.national_approval) || null;
    },
    /**
     * A budget only carries review feedback once it has left the owner — a
     * `draft` has never been submitted and a `voided` budget is out of the
     * chain, so neither is worth a request.
     */
    canHaveFeedback() {
      return !!this.status && this.status !== 'draft' && this.status !== 'voided';
    },
    /**
     * Render only when there is something to report: a review, an approval or
     * at least one changed figure. A draft / freshly submitted budget shows
     * nothing.
     */
    visible() {
      return (
        this.canView
        && this.canHaveFeedback
        && !!this.budgetId
        && !!(this.dnmpReview || this.countyApproval || this.nationalApproval || this.changes.length)
      );
    },
  },
  watch: {
    budgetId: {
      immediate: true,
      handler() {
        this.fetchFeedback();
      },
    },
    status() {
      this.fetchFeedback();
    },
  },
  methods: {
    async fetchFeedback() {
      if (!this.canView || !this.canHaveFeedback || !this.budgetId) {
        this.feedback = null;
        return;
      }
      this.loading = true;
      try {
        const { data } = await axios.get(`get_budget_review_feedback/${this.budgetId}`);
        this.feedback = data || null;
      } catch (e) {
        // Non-fatal: the panel simply stays hidden. A 403 here means the budget
        // belongs to another unit (or the role lost the permission), so there is
        // nothing to show the user.
        this.feedback = null;
      } finally {
        this.loading = false;
      }
    },
    /**
     * The audit trail stores canonical 6-dp strings (e.g. "6.000000"), so whole
     * numbers render whole ("6") and other numbers lose trailing zeros.
     */
    displayValue(value) {
      if (value === null || value === undefined || value === '') return '—';
      const n = Number(value);
      if (!Number.isFinite(n)) return String(value);
      if (Number.isInteger(n)) return String(n);
      return String(parseFloat(n.toFixed(2)));
    },
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
.review-feedback {
  margin: 12px 0 16px;
  border-left: 4px solid #2f54eb;
}
.rf-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.rf-head strong {
  font-size: 15px;
  color: #2b3245;
}
.rf-count {
  font-size: 12px;
  font-weight: 600;
  color: #2f54eb;
  background: #f0f5ff;
  border-radius: 10px;
  padding: 1px 8px;
}
.rf-intro {
  margin: 0 0 12px;
  font-size: 12px;
  color: #8b8fa3;
}

/* DNMP review / sign-off strips */
.rf-stage,
.rf-signoff {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f7f8fc;
  margin-bottom: 8px;
  font-size: 13px;
  color: #2b3245;
}
.rf-signoff--approved {
  background: #f6ffed;
  border-left: 3px solid #52c41a;
}
.rf-stage-label {
  font-weight: 600;
  color: #5a5f7d;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.04em;
}
.rf-actor {
  font-weight: 600;
}
.rf-role {
  font-weight: 400;
  color: #5a5f7d;
}
.rf-at {
  color: #8b8fa3;
}
.rf-notes {
  flex-basis: 100%;
  margin: 4px 0 0;
  white-space: pre-wrap;
  color: #2b3245;
}

/* Change table */
.rf-changes-label {
  margin: 4px 0 6px;
  font-weight: 600;
  color: #5a5f7d;
  font-size: 13px;
}
.rf-table {
  margin-bottom: 12px;
}
.rf-category {
  color: #5a5f7d;
}
.rf-orig {
  color: #8b8fa3;
  text-decoration: line-through;
}
.rf-arrow {
  color: #8b8fa3;
}
.rf-upd {
  font-weight: 600;
  color: #2b3245;
}
.rf-signoffs {
  margin-top: 4px;
}
</style>
