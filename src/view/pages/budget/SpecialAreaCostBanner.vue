<template>
  <a-alert
    v-if="show"
    type="warning"
    show-icon
    class="special-area-banner"
  >
    <template #icon><span class="sab-icon">✦</span></template>
    <template #message>
      <strong>Special Area Cost{{ activeTypes.length > 1 ? 's' : '' }} Mapped</strong>
      <span class="sab-types">
        <a-tag v-for="t in activeTypes" :key="t" class="sab-type-tag">{{ humanize(t) }}</a-tag>
      </span>
    </template>
    <template #description>
      <p class="sab-desc">
        This {{ isSubCounty ? 'sub-county' : 'county' }} has been flagged for the special cost
        type{{ activeTypes.length > 1 ? 's' : '' }} above. When a budget is generated, the matching
        line item{{ flags.length > 1 ? 's' : '' }} will be added automatically to every eligible activity —
        watch for the <a-tag class="sab-inline-tag">Special Cost</a-tag> label on the generated rows.
      </p>
      <ul v-if="flags.length" class="sab-notes">
        <li v-for="f in flags" :key="f.id">
          <strong>{{ humanize(f.special_type) }}</strong>
          <span v-if="f.notes"> — {{ f.notes }}</span>
          <em v-if="f.sub_county_id == null" class="sab-scope"> (applies county-wide)</em>
        </li>
      </ul>
    </template>
  </a-alert>
</template>

<script>
/* Shown on the County/Sub-County Budgeting pages so officers know — before,
 * during, and immediately after generation — that their area carries one or
 * more special-cost mappings configured in Special Area Costs admin.
 * Data comes from `get_active_special_flags?county_id=&sub_county_id=`,
 * the same endpoint the national review tree uses to badge counties. */
export default {
  name: 'SpecialAreaCostBanner',
  props: {
    flags: { type: Array, default: () => [] },
    isSubCounty: { type: Boolean, default: false },
  },
  computed: {
    show() {
      return this.flags.length > 0;
    },
    activeTypes() {
      return [...new Set(this.flags.map((f) => f.special_type))];
    },
  },
  methods: {
    humanize(type) {
      return {
        boat_hire: 'Boat Hire',
        enhanced_transport: 'Enhanced Transport',
        security: 'Security',
        dsa: 'DSA',
      }[type] || String(type || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    },
  },
};
</script>

<style scoped>
.special-area-banner {
  margin: 12px 0 16px;
  border-color: #f3c97c;
  background: #fff9ec;
}
.sab-icon {
  color: #b85c00;
}
.sab-types {
  margin-left: 10px;
}
.sab-type-tag {
  background: #fff4e6;
  color: #b85c00;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 4px;
}
.sab-inline-tag {
  background: #fff4e6;
  color: #b85c00;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  padding: 0 6px;
  line-height: 16px;
}
.sab-desc {
  margin: 4px 0 6px;
  color: #6b5230;
}
.sab-notes {
  margin: 0;
  padding-left: 18px;
  color: #6b5230;
  font-size: 12px;
}
.sab-notes li {
  margin-bottom: 2px;
}
.sab-scope {
  color: #9a7b47;
}
</style>
