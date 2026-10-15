<template>
  <a-alert
    v-if="show"
    type="warning"
    show-icon
    class="budget-referral-banner"
  >
    <template #message>
      <strong>Budget Referred Back</strong>
      <span class="brb-meta">
        <span v-if="destinationLabel" class="brb-dest">To the {{ destinationLabel }}</span>
        <span v-if="referrerName">By {{ referrerName }}</span>
        <span v-if="formattedAt"> &middot; {{ formattedAt }}</span>
      </span>
    </template>
    <template #description>
      <p class="brb-desc-label">Reviewer feedback:</p>
      <p class="brb-message">{{ message || 'No message provided.' }}</p>
    </template>
  </a-alert>
</template>

<script>
/* Warning banner shown above the categories/parameters in the budget
 * detail view when the budget was referred back by a reviewer. Displays
 * the referrer's name, the timestamp, and the feedback message captured
 * by `reject_campaign_budget`. */
export default {
  name: 'BudgetReferralBanner',
  props: {
    isReferred: { type: Boolean, default: false },
    referrer: { type: Object, default: null },
    referredAt: { type: String, default: null },
    message: { type: String, default: '' },
    /* Destination of the referral (sub_county | county | dnmp_review |
     * approver). Null for legacy referrals — those always landed with the
     * owner, so the line is simply omitted. */
    referredTo: { type: String, default: null },
  },
  computed: {
    show() {
      return !!this.isReferred;
    },
    /** "Sub-County level" / "County level" / … — where the budget was sent. */
    destinationLabel() {
      return {
        sub_county: 'Sub-County level',
        county: 'County level',
        dnmp_review: 'National DNMP Review level',
        approver: 'National Approver level',
      }[this.referredTo] || '';
    },
    referrerName() {
      const u = this.referrer;
      if (!u) return '';
      if (u.name) return u.name;
      const parts = [u.first_name, u.middle_name, u.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
      return parts || u.email || '';
    },
    formattedAt() {
      if (!this.referredAt) return '';
      const d = new Date(this.referredAt);
      if (Number.isNaN(d.getTime())) return this.referredAt;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
  },
};
</script>

<style scoped>
.budget-referral-banner {
  margin: 12px 0 16px;
}
.brb-meta {
  margin-left: 8px;
  font-weight: 400;
  color: #5a5f7d;
  font-size: 13px;
}
/* Destination of the referral (e.g. "To the County level") — emphasised. */
.brb-dest {
  font-weight: 600;
}
.brb-desc-label {
  margin: 4px 0 4px;
  font-weight: 600;
  color: #5a5f7d;
}
.brb-message {
  margin: 0;
  white-space: pre-wrap;
  color: #2b3245;
}
</style>
