<template>
  <section v-if="categories.length" class="panel sac-panel">
    <div class="sac-panel-head">
      <h4 class="sac-panel-title">✦ Special Area Costs</h4>
      <p class="sac-panel-sub">
        Enter special area costs per category. No. of Days is entered by you for each item.
        Default amounts (Security 2,500 / DSA 14,000) are fixed and cannot be edited.
        Edits are staged per item — press Save under a category to persist it.
      </p>
    </div>

    <div
      v-for="cat in categories"
      :key="cat.id"
      class="sac-cat"
      :class="{ 'sac-cat-dirty': isDirty(cat.id) }"
    >
      <div
        class="sac-cat-head"
        role="button"
        tabindex="0"
        @click="toggle(cat.id)"
        @keydown.enter.prevent="toggle(cat.id)"
        @keydown.space.prevent="toggle(cat.id)"
      >
        <div class="sac-cat-title">
          <span :class="['caret', { open: isOpen(cat.id) }]" aria-hidden="true">▸</span>
          <span class="sac-cat-name">{{ cat.order }}. {{ cat.name }}</span>
          <a-tag v-if="isDirty(cat.id)" class="dirty-tag">Unsaved</a-tag>
        </div>
        <div class="sac-cat-tools">
          <span class="sac-cat-total">KES {{ fmt(catTotal(cat)) }}</span>
          <sdButton
            v-if="editable && isDirty(cat.id)"
            size="small"
            class="pill-btn sac-save-btn"
            :loading="savingCat === cat.id"
            @click.stop="saveCategory(cat)"
          >
            Save
          </sdButton>
        </div>
      </div>

      <div v-show="isOpen(cat.id)" class="sac-cat-body">
        <a-table
          :dataSource="rowsFor(cat)"
          :columns="columns"
          :pagination="false"
          row-key="type"
          size="small"
          class="minimal-table sac-table"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.key === 'label'" class="sac-item-label">
              {{ record.label }}
              <a-tag v-if="record.locked" class="lc-tag">Fixed</a-tag>
            </span>
            <span v-else-if="column.key === 'amount'">
              <a-input-number
                v-if="record.editableAmount"
                v-model:value="record._d.amount"
                :min="0"
                :max="record.max_amount"
                :precision="2"
                size="small"
                class="sac-amount-input"
              />
              <span v-else class="sac-fixed-amount">{{ fmt(record.amount) }}</span>
            </span>
            <span v-else-if="column.key === 'units'">
              <a-input-number
                v-if="editable && !record.units_locked"
                v-model:value="record._d.units"
                :min="0"
                :max="20"
                :precision="0"
                size="small"
                class="sac-units-input"
              />
              <span v-else class="sac-units-fixed">
                {{ fmt(record.units) }}
                <a-tag v-if="record.units_locked" class="lc-tag">Default</a-tag>
              </span>
            </span>
            <span v-else-if="column.key === 'days'">
              <a-input-number
                v-if="editable"
                v-model:value="record._d.days"
                :min="1"
                :max="365"
                :precision="0"
                size="small"
                class="sac-days-input"
              />
              <span v-else class="sac-days">{{ record.days }}</span>
            </span>
            <span v-else-if="column.key === 'comment'">
              <a-input
                v-if="editable && Number(record.units) > 0"
                v-model:value="record._d.comment"
                size="small"
                class="sac-comment-input"
                placeholder="Note (optional)…"
                :maxlength="500"
                allow-clear
              />
              <span v-else-if="Number(record.units) > 0" class="sac-comment-text">{{ record.comment || '—' }}</span>
              <span v-else class="sac-comment-empty">—</span>
            </span>
            <span v-else-if="column.key === 'total'" class="sac-total">{{ fmt(rowTotal(record)) }}</span>
          </template>
        </a-table>
      </div>
    </div>
  </section>
</template>
<script>
import { SAC_ITEMS } from '@/services/specialAreaCosts';

/*
 * Special Area Cost section shown on the County / Sub-County budgeting pages.
 *
 * - Rendered only when the unit's profile has is_special_area_cost = true.
 * - Repeats the standard budget category list; each category is an
 *   expandable / collapsible panel listing the SAC line items from the
 *   admin-managed catalogue (DSA, Boat, Enhanced Transport, Security, …)
 *   passed in via the `items` prop. Falls back to the built-in SAC_ITEMS
 *   when the parent has not loaded the catalogue.
 * - Per item: a fixed (locked) amount cannot be edited; an item whose
 *   `units_mode` is 'default' shows its configured unit count read-only,
 *   while a 'dynamic' item lets the officer enter units per row.
 * - A comment field sits after No. of Days and appears only when units are
 *   entered for the row (units > 0).
 * - Each row is tracked independently (keyed by category + item) so editing
 *   one item never affects another. Edits are staged locally; a per-category
 *   Save button persists them via `saveEntries` — mirroring the standard
 *   budget grid.
 * - In generated mode the section is read-only, fed by `getGeneratedRow`.
 *
 * Draft state lives here; every change is reported to the parent via the
 * `sync` event so grand totals / the generate payload stay in sync.
 */
export default {
  name: 'SpecialAreaCostsSection',
  props: {
    categories: { type: Array, default: () => [] },
    viewMode: { type: String, default: 'profile' },
    readOnly: { type: Boolean, default: false },
    // Saved pre-generation entries (from get_special_area_cost_entries).
    entries: { type: Array, default: () => [] },
    // Admin-managed SAC catalogue (get_special_area_cost_items). Falls back to
    // the built-in SAC_ITEMS when the parent has not loaded it (or the
    // request failed), so the grid always renders.
    items: { type: Array, default: () => [] },
    // Generated-mode row resolver: (category, item) => {amount, units, comment, total}
    getGeneratedRow: { type: Function, default: () => ({}) },
    // Per-category persistence: (categoryId, rows) => Promise
    saveEntries: { type: Function, default: () => Promise.resolve() },
    fmt: { type: Function, required: true },
  },
  emits: ['sync'],
  data() {
    return {
      drafts: {},   // key `${catId}:${type}` → { amount, units, comment }
      seeded: {},   // baseline last written from entries (pristine check)
      dirty: {},    // catId → boolean
      expanded: {}, // catId → boolean (open panels)
      savingCat: null,
    };
  },
  computed: {
    editable() {
      return this.viewMode === 'profile' && !this.readOnly;
    },
    /**
     * The catalogue to render. Items loaded from the backend win; otherwise
     * the built-in SAC_ITEMS fallback keeps the section usable offline.
     */
    sacItems() {
      return Array.isArray(this.items) && this.items.length
        ? this.items
        : SAC_ITEMS;
    },
    columns() {
      return [
        { title: 'Special Cost Item', key: 'label', dataIndex: 'label' },
        { title: 'Unit Cost / Amount (KES)', key: 'amount', align: 'right', width: 170 },
        { title: 'Units', key: 'units', align: 'right', width: 100 },
        { title: 'No. of Days', key: 'days', align: 'right', width: 90 },
        { title: 'Comment', key: 'comment', align: 'left', width: 220 },
        { title: 'Total (KES)', key: 'total', align: 'right', width: 140 },
      ];
    },
  },
  watch: {
    categories: {
      handler() {
        this.seedPanels();
        this.seedDrafts();
      },
      immediate: true,
    },
    entries: {
      handler() {
        this.seedDrafts();
        // Recompute the dirty state too: entries arrive asynchronously and
        // change after a Save, so the Save button must re-evaluate against the
        // new baseline (otherwise it can stay hidden or stay stuck on).
        this.refreshDirty();
      },
      deep: true,
    },
    items: {
      // The catalogue loads asynchronously (and may change after an admin
      // edits it) — re-seed so new/removed items appear immediately.
      handler() {
        this.seedDrafts();
        this.refreshDirty();
      },
      deep: true,
    },
    drafts: {
      handler() {
        this.refreshDirty();
        if (this.viewMode === 'profile') {
          this.$emit('sync', this.snapshot());
        }
      },
      deep: true,
    },
  },
methods: {
    key(catId, type) {
      return `${catId}:${type}`;
    },
    daysOf(cat) {
      const d = Number(cat?.default_days || 0);
      return d > 0 ? d : 1;
    },
    seedPanels() {
      this.categories.forEach((cat) => {
        if (!(cat.id in this.expanded)) this.expanded[cat.id] = true;
      });
    },
    // Seeds drafts from entries/defaults. A draft is only overwritten when it
    // is still pristine (equals its last seeded baseline) so user edits are
    // never clobbered when entries load asynchronously or refresh after Save.
    seedDrafts() {
      this.categories.forEach((cat) => {
        this.sacItems.forEach((item) => {
          const k = this.key(cat.id, item.type);
          const entry = this.entryFor(cat.id, item.type);
          // Default-units items are system-driven: the unit count always comes
          // from the catalogue and is never user-editable.
          const isDefaultUnits = item.units_mode === 'default';
          const categoryDays = this.daysOf(cat);
          const next = {
            amount: entry ? Number(entry.amount) || 0 : item.default_amount ?? 0,
            units: isDefaultUnits
              ? Number(item.default_units) || 0
              : entry
                ? Number(entry.units) || 0
                : 0,
            // No. of Days is officer-entered. Seed from the saved entry when
            // present, otherwise from the category default.
            days:
              entry && entry.days !== undefined && entry.days !== null
                ? Math.max(1, Number(entry.days) || categoryDays)
                : categoryDays,
            comment: entry?.comment || '',
          };
          const cur = this.drafts[k];
          const prev = this.seeded[k];
          const pristine = !cur || JSON.stringify(cur) === JSON.stringify(prev);
          if (pristine) {
            this.drafts[k] = { ...next };
            this.seeded[k] = { ...next };
          } else if (!prev) {
            // First user edit — record the current values as the baseline so
            // subsequent entry refreshes don't clobber them.
            this.seeded[k] = { ...cur };
          }
        });
      });
    },
    entryFor(catId, type) {
      return this.entries.find(
        (e) => e.budget_category_id === catId && e.special_type === type,
      );
    },
    rowFor(cat, item) {
      const unitsLocked = item.units_mode === 'default';
      if (this.viewMode !== 'profile') {
        const g = this.getGeneratedRow(cat, item) || {};
        return {
          ...item,
          amount: Number(g.amount) || 0,
          units: Number(g.units) || 0,
          comment: g.comment || '',
          days: Number(g.days) || this.daysOf(cat),
          total: Number(g.total) || 0,
          locked: !!item.locked,
          units_locked: unitsLocked,
          editableAmount: false,
          _d: null,
        };
      }
      const d = this.drafts[this.key(cat.id, item.type)];
      const amount = item.locked
        ? item.default_amount ?? 0
        : Number(d?.amount ?? item.default_amount ?? 0);
      // Default-units items: the catalogue owns the unit count.
      const units = unitsLocked
        ? Number(item.default_units) || 0
        : Number(d?.units ?? 0) || 0;
      return {
        ...item,
        amount,
        units,
        comment: d?.comment || '',
        days: Number(d?.days) || this.daysOf(cat),
        total: 0,
        locked: !!item.locked,
        units_locked: unitsLocked,
        editableAmount: !item.locked && this.editable,
        _d: d,
      };
    },
    rowsFor(cat) {
      return this.sacItems.map((item) => {
        const k = this.key(cat.id, item.type);
        // Safety net: guarantee a draft exists before an input binds to
        // `record._d.*`. Binding to an undefined draft throws during render,
        // which silently freezes the panel (the Save button never appears).
        if (!this.drafts[k]) {
          const seed = {
            amount: item.default_amount ?? 0,
            units: item.units_mode === 'default' ? Number(item.default_units) || 0 : 0,
            days: this.daysOf(cat),
            comment: '',
          };
          this.drafts[k] = { ...seed };
          this.seeded[k] = { ...seed };
        }
        return this.rowFor(cat, item);
      });
    },
    catTotal(cat) {
      return this.sacItems.reduce(
        (sum, item) => sum + this.rowTotal(this.rowFor(cat, item)),
        0,
      );
    },
    rowTotal(row) {
      if (!row) return 0;
      return (
        (Number(row.amount) || 0)
        * (Number(row.units) || 0)
        * (Number(row.days) || 1)
      );
    },
    isOpen(catId) {
      return !!this.expanded[catId];
    },
    toggle(catId) {
      this.expanded[catId] = !this.expanded[catId];
    },
    isDirty(catId) {
      return !!this.dirty[catId];
    },
    refreshDirty() {
      this.categories.forEach((cat) => {
        const dirtyNow = this.sacItems.some((item) => {
          const d = this.drafts[this.key(cat.id, item.type)];
          if (!d) return false;
          const entry = this.entryFor(cat.id, item.type);
          const unitsLocked = item.units_mode === 'default';
          const baseDays =
            entry && entry.days !== undefined && entry.days !== null
              ? Math.max(1, Number(entry.days) || this.daysOf(cat))
              : this.daysOf(cat);
          return (
            (Number(d.amount) || 0) !== (entry ? Number(entry.amount) || 0 : item.default_amount ?? 0)
            || (!unitsLocked && (Number(d.units) || 0) !== (entry ? Number(entry.units) || 0 : 0))
            || (Number(d.days) || this.daysOf(cat)) !== baseDays
            || (d.comment || '') !== (entry?.comment || '')
          );
        });
        this.dirty[cat.id] = dirtyNow;
      });
    },
    snapshot() {
      if (this.viewMode !== 'profile') return [];
      const rows = [];
      this.categories.forEach((cat) => {
        this.sacItems.forEach((item) => {
          const d = this.drafts[this.key(cat.id, item.type)] || {};
          const units = item.units_mode === 'default'
            ? Number(item.default_units) || 0
            : Number(d.units) || 0;
          rows.push({
            budget_category_id: cat.id,
            special_type: item.type,
            amount: item.locked ? item.default_amount ?? 0 : Number(d.amount) || 0,
            units,
            number_of_days: Number(d.days) || this.daysOf(cat),
            comment: units > 0 ? (d.comment || null) : null,
          });
        });
      });
      return rows;
    },
    async saveCategory(cat) {
      if (!this.saveEntries) return;
      this.savingCat = cat.id;
      try {
        const rows = this.sacItems.map((item) => {
          const d = this.drafts[this.key(cat.id, item.type)] || {};
          const units = item.units_mode === 'default'
            ? Number(item.default_units) || 0
            : Number(d.units) || 0;
          return {
            special_type: item.type,
            amount: item.locked ? item.default_amount ?? 0 : Number(d.amount) || 0,
            units,
            days: Number(d.days) || this.daysOf(cat),
            comment: units > 0 ? (d.comment || null) : null,
          };
        });
        await this.saveEntries(cat.id, rows);
      } catch (err) {
        // The parent surfaces backend errors via a notification; keep the
        // drafts staged so the user can retry after fixing the problem.
      } finally {
        this.savingCat = null;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.sac-panel {
  border: 1px solid #f3dfc8;
  background: #fffaf3;
  border-radius: 10px;
  margin-top: 16px;
  .sac-panel-head {
    padding: 12px 16px;
    .sac-panel-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #8a4d1f;
    }
    .sac-panel-sub {
      margin: 4px 0 0;
      font-size: 12px;
      color: #9a7b47;
    }
  }
  .sac-cat {
    border: 1px solid #eeddc2;
    border-radius: 8px;
    margin: 8px 12px 4px;
    overflow: visible;
    background: #fffdf8;
    .sac-cat-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 14px;
      background: #fdf3e3;
      cursor: pointer;
      .sac-cat-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        .caret {
          color: #b9853c;
          font-size: 12px;
          transition: transform 0.15s ease;
          &.open {
            transform: rotate(90deg);
          }
        }
        .sac-cat-name {
          font-weight: 700;
          font-size: 13px;
          color: #6b4a2a;
        }
      }
      .sac-cat-tools {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        .sac-cat-total {
          font-size: 13px;
          font-weight: 600;
          color: #8a4d1f;
        }
      }
    }
    &.sac-cat-dirty .sac-cat-head {
      background: #fbeedd;
    }
    .sac-cat-body {
      padding: 4px 0;
      .sac-table {
        margin-top: 0;
        .sac-item-label {
          font-weight: 600;
          color: #5a3d23;
        }
        .sac-fixed-amount {
          color: #8a4d1f;
          font-weight: 600;
        }
        .sac-days {
          color: #7a6142;
        }
        .sac-total {
          font-weight: 600;
          color: #8a4d1f;
        }
        .sac-comment-text {
          color: #5a3d23;
          font-size: 12px;
        }
        .sac-comment-empty {
          color: #c3b39e;
        }
        .lc-tag {
          background: #f1e3cc;
          color: #8a5a2b;
          border: none;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 6px;
        }
      }
    }
  }
  .sac-amount-input { width: 140px; }
  .sac-units-input { width: 90px; }
  .sac-days-input { width: 90px; }
  .sac-units-fixed {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #8a4d1f;
  }
  .sac-comment-input { width: 100%; }
  .sac-save-btn {
    background: #8a4d1f;
    color: #fff;
    border: none;
    font-weight: 600;
  }
  .dirty-tag {
    background: #fde7e0;
    color: #c0392b;
    border: none;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
  }
}
</style>