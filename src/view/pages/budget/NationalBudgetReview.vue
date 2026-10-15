<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard nbr-review-page">
        <!-- Slim top bar -->
        <div class="tool-bar">
          <span class="tool-bar-title">Budget Preparation Tool</span>
        </div>

        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Budget Review &amp; Approval
            </h3>
          </div>
          <div class="ph-actions">
            <a-breadcrumb separator=">" class="review-crumbs">
              <a-breadcrumb-item>
                <a href="javascript:;" @click="goCounties">Counties</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedCounty">
                <a href="javascript:;" @click="goCountyBudgets">{{ selectedCounty.name }}</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedBudget">
                {{ selectedBudget.label }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </div>

        <!-- Filter panel — visible on Levels 1 & 2 (hidden on single-budget detail) -->
        <section v-if="!selectedBudget" class="panel nbr-filter-panel">
          <div class="filter-grid">
            <a-select
              v-model:value="filterCountyId"
              show-search
              allow-clear
              option-filter-prop="label"
              placeholder="Filter by County"
              @change="onCountyFilterChange"
            >
              <a-select-option
                v-for="c in counties"
                :key="c.id"
                :value="c.id"
                :label="c.name"
              >
                {{ c.name }}
              </a-select-option>
            </a-select>
            <a-select
              v-model:value="filterSubCountyId"
              show-search
              allow-clear
              option-filter-prop="label"
              placeholder="Filter by Sub-County"
              :disabled="!filterCountyId && subCountyOptions.length === 0"
            >
              <a-select-option
                v-for="sc in subCountyOptions"
                :key="sc.id"
                :value="sc.id"
                :label="sc.label"
              >
                {{ sc.label }}
              </a-select-option>
            </a-select>
            <a-select
              v-model:value="filterStage"
              allow-clear
              placeholder="Approval Stage"
            >
              <a-select-option
                v-for="opt in stageOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </a-select-option>
            </a-select>
            <div class="nbr-filter-actions">
              <sdButton
                size="small"
                class="nbr-action-btn"
                type="light"
                @click="resetFilters"
                :disabled="!hasActiveFilters"
              >
                Reset
              </sdButton>
              <span v-if="hasActiveFilters" class="nbr-fb-count">
                {{ filteredCountResult }}
              </span>
            </div>
          </div>
        </section>

        <!-- ════════ LEVEL 1 · County grid ════════ -->
        <template v-if="!selectedCounty">
          <!-- Where every county & sub-county budget sits right now.
               The pipeline is ordered 1→6 and each stage splits the count into
               STANDARD vs SAC budgets, so it is obvious which type is where. -->
          <section v-if="stageSummaryTotal" class="stage-summary">
            <div class="ss-title">
              <span class="ss-icon">⌛</span>
              <span class="ss-heading">Budget pipeline — where the county &amp; sub-county budgets are</span>
              <span class="ss-legend">
                <span class="ss-key ss-key--std">
                  <i class="ss-dot"></i>Standard <b>{{ stageSummaryByType.standard }}</b>
                </span>
                <span class="ss-key ss-key--sac">
                  <i class="ss-dot"></i>SAC <b>{{ stageSummaryByType.sac }}</b>
                </span>
              </span>
            </div>
            <div class="ss-track">
              <!-- Hovering a stage lists the counties / sub-counties whose
                   budgets currently sit in that stage (standard + SAC), so a
                   reviewer can see exactly what is queued where. -->
              <a-tooltip
                v-for="b in stageSummary"
                :key="b.label"
                placement="top"
              >
                <template #title>
                  <div style="max-width: 360px">
                    <div style="font-weight: 600; margin-bottom: 4px">{{ b.hint }}</div>
                    <div v-if="!b.entries.length" style="opacity: 0.75">
                      No budget is currently in this stage.
                    </div>
                    <template v-if="b.standardItems.length">
                      <div
                        style="
                          margin-top: 6px;
                          font-size: 11px;
                          font-weight: 700;
                          letter-spacing: 0.4px;
                          opacity: 0.85;
                        "
                      >
                        STANDARD BUDGETS ({{ b.standard }})
                      </div>
                      <ul style="margin: 2px 0 0; padding-left: 16px">
                        <li v-for="name in b.standardItems" :key="name">{{ name }}</li>
                      </ul>
                    </template>
                    <template v-if="b.sacItems.length">
                      <div
                        style="
                          margin-top: 6px;
                          font-size: 11px;
                          font-weight: 700;
                          letter-spacing: 0.4px;
                          opacity: 0.85;
                        "
                      >
                        SPECIAL AREA COST BUDGETS ({{ b.sac }})
                      </div>
                      <ul style="margin: 2px 0 0; padding-left: 16px">
                        <li v-for="name in b.sacItems" :key="name">{{ name }}</li>
                      </ul>
                    </template>
                  </div>
                </template>
                <div
                  class="ss-bucket"
                  :class="{
                    'is-mine': myActionStages.includes(b.label),
                    'is-editable': myEditableStages.includes(b.label),
                    'is-empty': !b.count,
                  }"
                >
                  <div class="ss-step">
                    <span class="ss-step-no">{{ b.order }}</span>
                    <span class="ss-step-name">{{ b.short }}</span>
                  </div>
                  <div class="ss-split">
                    <span class="ss-type ss-type--std">
                      <i class="ss-dot"></i>Standard
                      <b>{{ b.standard }}</b>
                    </span>
                    <!-- SAC only where a SAC budget can actually be: it skips the
                         county tier, so stages ②/③ stay Standard-only. -->
                    <span v-if="b.showSac" class="ss-type ss-type--sac">
                      <i class="ss-dot"></i>SAC
                      <b>{{ b.sac }}</b>
                    </span>
                  </div>
                  <div v-if="myActionStages.includes(b.label)" class="ss-you">Awaiting you</div>
                  <div v-else-if="myEditableStages.includes(b.label)" class="ss-you ss-you--editable">
                    Editable
                  </div>
                </div>
              </a-tooltip>
            </div>
          </section>

          <a-spin :spinning="loadingCounties">
            <div class="card-grid four-col">
              <div
                v-for="c in filteredCounties"
                :key="c.id"
                class="drill-card"
                @click="openCounty(c)"
              >
                <div class="dc-head">
                  <span class="dc-title">
                    <span class="dc-icon">◎</span> {{ c.name }}
                  </span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">{{ (c.sub_counties || []).length }} sub-counties</div>
                <BudgetStagePipeline
                  v-if="c.county_budget"
                  class="dc-pipeline"
                  compact
                  :status="c.county_budget.status"
                  :is-sub-county="false"
                  :is-special-area="false"
                  :action-status="myActionStatus(false, false)"
                />
                <a-tag v-if="c.stage" class="dc-stage">{{ c.stage }}</a-tag>
              </div>
              <div v-if="!loadingCounties && filteredCounties.length === 0" class="empty-hint">
                {{ hasActiveFilters ? 'No counties match the current filters.' : 'No counties available.' }}
              </div>
            </div>
          </a-spin>
        </template>

        <!-- ════════ LEVEL 2 · Budgets for the selected county ════════ -->
        <template v-else-if="selectedCounty && !selectedBudget">
          <div class="level-title">
            <sdButton size="small" class="back-btn" @click="goCounties">
              ← Back to Counties
            </sdButton>
            <span class="lt-icon">◉</span>
            {{ selectedCounty.name }} — Budgets for Review
          </div>
          <a-spin :spinning="loadingDetail">
            <div class="card-grid four-col">
              <div
                v-if="countyBudgetTileVisible"
                class="drill-card"
                :class="{ 'is-empty': !selectedCounty.county_budget }"
                @click="openCountyBudget()"
              >
                <div class="dc-head">
                  <span class="dc-title">
                    <span class="dc-icon">▤</span> County Budget
                  </span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  <span class="dc-meta-label">Standard:</span>
                  {{ selectedCounty.county_budget ? selectedCounty.county_budget.stage : 'No budget' }}
                </div>
                <BudgetStagePipeline
                  v-if="selectedCounty.county_budget"
                  class="dc-pipeline"
                  compact
                  :status="selectedCounty.county_budget.status"
                  :is-sub-county="false"
                  :is-special-area="false"
                  :action-status="myActionStatus(false, false)"
                />
                <span
                  v-if="selectedCounty.county_budget && selectedCounty.county_budget.special_area_cost"
                  class="dc-flag"
                >
                  ✦ Special Area Cost applicable
                </span>
              </div>
              <!-- The county's SEPARATE Special Area Cost budget: submitted
                   straight to National (no county approval). -->
              <div
                v-if="countySacTileVisible"
                class="drill-card"
                :class="{ 'is-empty': !selectedCounty.sac_budget }"
                @click="openSacBudget(selectedCounty)"
              >
                <div class="dc-head">
                  <span class="dc-title">
                    <span class="dc-icon">✦</span> County SAC Budget
                  </span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  {{ selectedCounty.sac_budget ? selectedCounty.sac_budget.stage : 'No budget' }}
                </div>
                <BudgetStagePipeline
                  v-if="selectedCounty.sac_budget"
                  class="dc-pipeline"
                  compact
                  :status="selectedCounty.sac_budget.status"
                  :is-sub-county="false"
                  :is-special-area="true"
                  :action-status="myActionStatus(false, true)"
                />
              </div>
              <div
                v-for="sc in filteredSubCounties"
                :key="sc.id"
                class="drill-card"
                :class="{ 'is-empty': !sc.budget && !sc.sac_budget }"
                @click="openSubCountyBudget(sc)"
              >
                <div class="dc-head">
                  <span class="dc-title">{{ sc.name }}</span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  <span class="dc-meta-label">Standard:</span>
                  {{ sc.budget ? sc.budget.stage : 'No budget' }}
                </div>
                <BudgetStagePipeline
                  v-if="sc.budget"
                  class="dc-pipeline"
                  compact
                  :status="sc.budget.status"
                  :is-sub-county="true"
                  :is-special-area="false"
                  :action-status="myActionStatus(true, false)"
                />
                <span v-if="sc.budget && sc.budget.special_area_cost" class="dc-flag">
                  ✦ Special Area Cost applicable
                </span>

                <!-- The SEPARATE Special Area Cost budget: submitted straight
                     to National (no county approval). -->
                <div
                  v-if="sc.sac_budget"
                  class="dc-sac-row"
                  @click.stop="openSacBudget(sc)"
                >
                  <span class="dc-sac-label">✦ SAC Budget</span>
                  <a-tag class="dc-sac-stage">{{ sc.sac_budget.stage }}</a-tag>
                  <span class="dc-chevron">›</span>
                </div>
              </div>
              <div
                v-if="!loadingDetail && !countyBudgetTileVisible && filteredSubCounties.length === 0"
                class="empty-hint"
              >
                No budgets match the current filters.
              </div>
            </div>
          </a-spin>
        </template>

        <!-- ════════ LEVEL 3 · Single budget detail ════════ -->
        <template v-else>
          <div class="level-title">
            <sdButton size="small" class="back-btn" @click="goCountyBudgets">
              ← Back to {{ selectedCounty.name }}
            </sdButton>
            <span class="lt-icon">▦</span>
            {{ selectedCounty.name }} — {{ selectedBudget.label }}
          </div>
          <div class="detail-stage-head">
            <a-tag class="ph-stage-tag">{{ selectedBudget.stage }}</a-tag>
            <!-- Maintenance action: re-run recompute_county_profile_budgets/{id}
                 for this budget's county profile (refreshes the profile's
                 computed fields, every standard line item's session multiplier
                 and the budget grand total). Works for both county-level and
                 sub-county-level budgets. Hidden while editing so unsaved unit
                 edits are not clobbered by the refresh. -->
            <sdButton
              v-if="canRecomputeProfile && selectedBudget.county_profile_id && !editing"
              type="light"
              class="nbr-action-btn"
              :loading="recomputing"
              @click="recomputeProfileBudgets"
            >
              ↻ Recompute Budget
            </sdButton>
          </div>
          <BudgetStagePipeline
            class="detail-pipeline"
            :status="selectedBudget.status"
            :is-sub-county="selectedBudget.is_sub_county"
            :is-special-area="selectedBudget.is_special_area"
            :action-status="myActionStatus(selectedBudget.is_sub_county, selectedBudget.is_special_area)"
          />

          <!-- stats row -->
          <div class="stat-row">
            <div class="stat-chip">
              <span class="sc-label">Population:</span>
              <strong>{{ fmt(selectedBudget.population) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Households:</span>
              <strong>{{ fmt(selectedBudget.households) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Wards:</span>
              <strong>{{ fmt(selectedBudget.wards) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Locations:</span>
              <strong>{{ fmt(selectedBudget.locations) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Sublocations:</span>
              <strong>{{ fmt(selectedBudget.sub_locations) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Villages:</span>
              <strong>{{ fmt(selectedBudget.villages) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Posts:</span>
              <strong>{{ fmt(selectedBudget.posts) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">HCW Class size:</span>
              <strong>{{ fmt(selectedBudget.class_size_hw) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">CHP/VE Class size:</span>
              <strong>{{ fmt(selectedBudget.class_size_chv) }}</strong>
            </div>
          </div>

          <!-- summary tiles -->
          <div class="summary-row">
            <div class="summary-tile">
              <div class="st-label">Nets Required</div>
              <div class="st-value">{{ fmt(selectedBudget.nets_required) }}</div>
            </div>
            <div class="summary-tile">
              <div class="st-label">Nets/Household</div>
              <div class="st-value">{{ selectedBudget.nets_per_hh.toFixed(2) }}</div>
            </div>
            <div class="summary-tile">
              <div class="st-label">Cost/Net (KES)</div>
              <div class="st-value">{{ selectedBudget.cost_per_net.toFixed(2) }}</div>
            </div>
            <div class="summary-tile accent">
              <div class="st-label">Total Budget (KES)</div>
              <div class="st-value">{{ fmt(selectedBudget.total_budget) }}</div>
            </div>
          </div>

          <!-- categories with parameters -->
          <!-- Edit-mode hint (Finance Officer / Program Accountant, pre-approval) -->
          <div v-if="editing" class="nbr-edit-banner">
            Editing mode — adjust <strong>units</strong> per row, then use the
            <strong>Save</strong> button under each category. A
            <strong>comment is required</strong> for every figure you change;
            each edit is recorded in the audit trail. When you have finished all
            categories, press <strong>Recalculate totals</strong> to regenerate
            the budget. This budget locks automatically once approved.
          </div>

          <a-collapse
            v-model:activeKey="openCategoryKeys"
            class="category-collapse"
            expand-icon-position="start"
          >
            <a-collapse-panel
              v-for="cat in selectedBudget.categories"
              :key="cat.id"
            >
              <template #header>
                <div class="cat-header">
                  <span class="cat-name">{{ cat.name }}</span>
                  <a-tag v-if="cat.badge" class="cat-badge">{{ cat.badge }}</a-tag>
                  <!-- Applicable multiplier for this category (profile-derived,
                       e.g. "× 5 Sub-counties") so the reviewer can see how the
                       subtotal was scaled. -->
                  <a-tag
                    v-if="cat.multiplier_display"
                    class="cat-multiplier"
                    :title="`Unit totals are multiplied by ${cat.multiplier_display}`"
                  >
                    {{ cat.multiplier_display }}
                  </a-tag>
                  <!-- Drift: the county profile now holds a different multiplier
                       than the one this budget was costed with. Recalculating
                       re-applies the current profile value. -->
                  <a-tag
                    v-if="isSuperAdmin && cat.multiplier_mismatch"
                    class="cat-drift"
                    :title="`The county profile now says ×${cat.profile_multiplier}. This budget was costed at ${cat.multiplier_display} — recalculate to apply the current profile.`"
                  >
                    ⚠ profile ×{{ cat.profile_multiplier }}
                  </a-tag>
                  <span class="cat-total">KES {{ fmt(cat.total) }}</span>
                </div>
              </template>

              <a-table
                :dataSource="cat.items"
                :columns="tableColumns"
                :pagination="false"
                size="small"
                row-key="id"
                class="category-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'unit_cost'">
                    {{ fmt(record.unit_cost) }}
                  </span>
                  <!-- Days — always read-only for the reviewer -->
                  <span v-else-if="column.key === 'days'">{{ record.days }}</span>
                  <!-- Units — the ONLY editable field for the reviewer -->
                  <template v-else-if="column.key === 'units'">
                    <a-input-number
                      v-if="editing"
                      v-model:value="record.units"
                      :min="record.is_special_cost ? (record.min_units ?? 0) : 0"
                      :max="record.is_special_cost ? (record.max_units ?? sacMaxUnits(record)) : 100000"
                      size="small"
                      class="nbr-edit-input"
                    />
                    <span v-else>{{ record.units }}</span>
                  </template>
                  <!-- Multiplier applied to this parameter's units. Blank when
                       the category carries no multiplier (factor of 1). -->
                  <span v-else-if="column.key === 'multiplier'">
                    <span v-if="record.multiplier" class="row-multiplier">
                      × {{ record.multiplier }}
                    </span>
                  </span>
                  <!-- Reviewer comment — MANDATORY for any row whose figure is
                       changed (enforced again on the server). -->
                  <template v-else-if="column.key === 'comment'">
                    <a-input
                      v-if="editing && isRowDirty(record)"
                      :value="rowComment(record)"
                      size="small"
                      class="nbr-edit-input"
                      placeholder="Reason for change (required)"
                      @update:value="(v) => setRowComment(record, v)"
                    />
                    <span v-else-if="editing" class="nbr-comment-hint">—</span>
                  </template>
                  <template v-else-if="column.key === 'total'">
                    <strong class="cat-item-total">{{ fmt(record.total) }}</strong>
                    <a-tag
                      v-if="editing && isRowDirty(record)"
                      color="orange"
                      class="nbr-dirty-tag"
                    >
                      edited
                    </a-tag>
                  </template>
                </template>
                <template #summary>
                  <a-table-summary fixed>
                    <a-table-summary-row>
                      <a-table-summary-cell
                        :index="0"
                        :col-span="summaryColSpan"
                        align="right"
                      >
                        <strong>Subtotal</strong>
                      </a-table-summary-cell>
                      <a-table-summary-cell :index="summaryColSpan" align="right">
                        <strong>{{ fmt(cat.total) }}</strong>
                      </a-table-summary-cell>
                    </a-table-summary-row>
                  </a-table-summary>
                </template>
              </a-table>

              <!-- Session multiplier (preview) + per-category SAVE.
                   Mirrors the county / sub-county budgeting grid: apply the
                   multiplier to preview the scaled subtotal, then Save to
                   persist the units and recalculate. -->
              <div
                v-if="editing && hasSessionMultiplier(cat)"
                class="act-multiplier"
              >
                <div class="mp-left">
                  <span class="mp-title">Session Multiplier</span>
                  <span class="mp-badge">{{ cat.multiplier_display }}</span>
                </div>
                <div class="mp-mid">
                  <template v-if="cat.multiplierApplied">
                    Subtotal: <strong>KES {{ fmt(categorySubtotal(cat)) }}</strong>
                    <span class="mp-arrow">→</span>
                    Total: <strong class="mp-total">KES {{ fmt(categoryTotal(cat)) }}</strong>
                  </template>
                  <span v-else class="mp-hint">
                    Line totals are subtotals. Apply the session multiplier to
                    preview the budget total.
                  </span>
                </div>
                <div class="mp-right">
                  <sdButton
                    size="small"
                    :class="['pill-btn', 'mp-btn', { applied: cat.multiplierApplied }]"
                    @click="applyMultiplier(cat)"
                  >
                    {{ cat.multiplierApplied ? '✓ Multiplier Applied' : 'Apply Multiplier' }}
                  </sdButton>
                </div>
              </div>

              <div v-if="editing" class="act-foot">
                <sdButton
                  size="small"
                  :class="['pill-btn', 'save-btn', { 'is-dirty': isCategoryDirty(cat) }]"
                  :disabled="!isCategoryDirty(cat)"
                  :loading="savingCategoryId === cat.id"
                  @click="saveCategory(cat)"
                >
                  Save
                </sdButton>
              </div>
            </a-collapse-panel>
          </a-collapse>

          <!-- grand total -->
          <div class="grand-total-bar">
            <span>GRAND TOTAL</span>
            <strong>KES {{ fmt(selectedBudget.total_budget) }}</strong>
          </div>

          <!-- DNMP Accountant review strip -->
          <div
            v-if="selectedBudget.dnmp_review"
            class="dnmp-review-strip"
          >
            <strong>Reviewed by DNMP Accountant</strong>
            <span>
              {{ selectedBudget.dnmp_review.reviewed_by?.name || '—' }}
              · {{ formatReviewDate(selectedBudget.dnmp_review.reviewed_at) }}
            </span>
            <span v-if="selectedBudget.dnmp_review.notes" class="dnmp-notes">
              “{{ selectedBudget.dnmp_review.notes }}”
            </span>
          </div>

          <!-- Reviewer change history (audit trail). Visible to reviewers,
               approvers and the post-review sign-off roles (DNMP Program Head /
               GF Manager). Read-only — records are never edited or deleted. -->
          <div v-if="canViewChanges" class="change-history">
            <div class="ch-head">
              <strong>Reviewer change history</strong>
              <span class="ch-count">
                {{ changeHistory.length }}
                {{ changeHistory.length === 1 ? 'change' : 'changes' }}
              </span>
            </div>
            <p v-if="!changeHistory.length" class="ch-empty">
              No reviewer changes recorded for this budget.
            </p>
            <a-table
              v-else
              :dataSource="changeHistory"
              :columns="changeColumns"
              :pagination="false"
              size="small"
              row-key="id"
              class="ch-table"
            >
              <template #bodyCell="{ column, record }">
                <span v-if="column.key === 'category'" class="ch-category">
                  {{ record.category_label || '—' }}
                </span>
                <span v-else-if="column.key === 'item'">{{ record.item_label }}</span>
                <span v-else-if="column.key === 'field'">{{ record.field_label }}</span>
                <span v-else-if="column.key === 'change'">
                  <span class="ch-orig">{{ record.original_value ?? '—' }}</span>
                  <span class="ch-arrow"> → </span>
                  <span class="ch-upd">{{ record.updated_value ?? '—' }}</span>
                </span>
                <span v-else-if="column.key === 'reviewer'">
                  {{ record.reviewer_name || '—' }}
                  <span v-if="record.reviewer_role" class="ch-role">
                    ({{ record.reviewer_role }})
                  </span>
                </span>
                <span v-else-if="column.key === 'comment'">{{ record.comment || '—' }}</span>
                <span v-else>{{ formatReviewDate(record.at) }}</span>
              </template>
            </a-table>
          </div>

          <!-- actions -->
          <div class="detail-actions">
            <sdButton
              type="light"
              class="nbr-action-btn"
              @click="downloadBudgetPDF"
            >
              Download PDF
            </sdButton>

            <!-- Pre-approval UNIT editing (Accountant / Finance Officer /
                 Program Accountant). Hidden once the budget is approved — it is
                 then locked (selectedBudget.can_edit === false). Units are
                 saved per category with the Save button under each category;
                 this global action regenerates the budget to the actual total. -->
            <sdButton
              v-if="canEditSelected && !editing"
              type="light"
              class="nbr-action-btn"
              @click="beginEdit"
            >
              Edit Budget
            </sdButton>
            <sdButton
              v-if="editing"
              type="primary"
              class="nbr-action-btn"
              :loading="recalculating"
              @click="recalculateTotals"
            >
              Recalculate totals
            </sdButton>
            <sdButton
              v-if="editing"
              type="light"
              class="nbr-action-btn"
              @click="cancelEdit"
            >
              Cancel
            </sdButton>

            <!-- National reviewer review step (DNMP Accountant / Finance
                 Officer / Program Accountant) — before final national approval -->
            <sdButton
              v-if="!editing && selectedBudget.can_review && canReview"
              type="primary"
              class="nbr-action-btn"
              :loading="reviewing"
              @click="openReviewModal"
            >
              Mark as Reviewed
            </sdButton>
            <!-- Final national approval — Finance Officer -->
            <sdButton
              v-if="!editing && selectedBudget.can_approve && canApprove"
              type="success"
              class="nbr-action-btn"
              :loading="approving"
              @click="openApproveModal"
            >
              Approve
            </sdButton>
            <sdButton
              v-if="!editing && canReferBack"
              type="warning"
              class="nbr-action-btn"
              @click="openReferModal(selectedBudget)"
            >
              Refer Back
            </sdButton>
            <sdButton
              type="light"
              class="nbr-action-btn"
              @click="goCountyBudgets"
            >
              Back to {{ selectedCounty.name }}
            </sdButton>
          </div>
        </template>

        <!-- Refer Back Modal — the reviewer chooses WHICH LEVEL the budget is
             sent back to (owner, county, national DNMP review, national
             approvers) as well as why. An approved budget may only be pulled
             back by the Super Admin or a national approver; everyone else sees
             the Refer Back button only while the budget is still in the chain. -->
        <a-modal
          v-model:visible="referModal"
          title="Refer Budget Back"
          @ok="handleRefer"
          ok-text="Send Referral"
          :confirm-loading="referring"
        >
          <p style="color: #6b7a72; margin-bottom: 12px">
            Choose the level to refer this budget back to, then explain what needs to be corrected.
          </p>

          <div style="margin-bottom: 14px">
            <label style="display: block; font-weight: 600; color: #2b3245; margin-bottom: 6px">
              Refer back to <span style="color: #f5222d">*</span>
            </label>
            <a-select
              v-model:value="referTarget"
              style="width: 100%"
              placeholder="Select the level to refer this budget back to"
              :options="referTargetOptions"
            />
            <p v-if="referTargetHint" style="margin: 6px 0 0; font-size: 12px; color: #8b8fa3">
              {{ referTargetHint }}
            </p>
          </div>

          <div>
            <label style="display: block; font-weight: 600; color: #2b3245; margin-bottom: 6px">
              Feedback / reason <span style="color: #f5222d">*</span>
            </label>
            <a-textarea
              v-model:value="referNote"
              :rows="4"
              placeholder="Explain what needs to be corrected..."
            />
          </div>
        </a-modal>

        <!-- DNMP Accountant Review Modal -->
        <a-modal
          v-model:visible="reviewModal"
          title="DNMP Accountant Review"
          @ok="markReviewed"
          ok-text="Mark as Reviewed"
          :confirm-loading="reviewing"
        >
          <p style="color: #6b7a72; margin-bottom: 12px">
            Confirm that you have reviewed this budget. It will then be
            queued for final national approval by the Finance Officer.
          </p>
          <a-textarea
            v-model:value="reviewNote"
            :rows="3"
            placeholder="Optional review notes..."
          />
        </a-modal>

        <!-- Final National Approval confirmation (Finance Officer).
             Surfaces the DNMP Accountant's review comments so the approver can
             see them before signing off — for both standard and SAC budgets. -->
        <a-modal
          v-model:visible="approveModal"
          title="Approve budget at national level?"
          @ok="confirmApprove"
          :ok-text="approving ? 'Approving…' : 'Approve budget'"
          cancel-text="Cancel"
          :confirm-loading="approving"
        >
          <p style="color: #6b7a72; margin-bottom: 12px">
            You are about to give final national approval for
            <strong>{{ selectedBudget?.label }}</strong>
            <span v-if="selectedBudget && selectedBudget.total_budget">
              (KES {{ fmt(selectedBudget.total_budget) }})
            </span>. Please review the DNMP Accountant's comments below before
            approving.
          </p>

          <div
            v-if="selectedBudget && selectedBudget.dnmp_review"
            class="dnmp-review-strip"
            style="margin-top: 0"
          >
            <strong>DNMP Accountant review comments</strong>
            <span>
              {{ selectedBudget.dnmp_review.reviewed_by?.name || '—' }}
              · {{ formatReviewDate(selectedBudget.dnmp_review.reviewed_at) }}
            </span>
            <span v-if="selectedBudget.dnmp_review.notes" class="dnmp-notes">
              “{{ selectedBudget.dnmp_review.notes }}”
            </span>
          </div>
          <p v-else style="color: #6b7a72; margin-bottom: 0">
            No review comments were recorded by the DNMP Accountant.
          </p>
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { notification, message } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { hasRoleByName, hasPermission } from '@/services/user-role';
import { sacMaxUnits } from '@/services/specialAreaCosts';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import BudgetStagePipeline from './BudgetStagePipeline.vue';

/* Human labels for the audited figure columns. */
const CHANGE_FIELD_LABELS = {
  unit_cost: 'Unit cost',
  number_of_days: 'Days',
  unit_count: 'Units',
  override_value: 'Override',
};

/* Full name of the reviewer attached to an audit row. */
const reviewerName = (user) => {
  if (!user) return null;
  const name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || user.email || null;
};

/* Render an audited figure without noise: whole numbers stay whole (no
 * decimals), other numbers are shown with up to two decimals (trailing zeros
 * trimmed). Non-numeric / empty values pass through unchanged.
 * The audit trail stores canonical 6-dp strings (e.g. "6.000000"), so this
 * is what turns unit counts back into "6". */
const formatAuditValue = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  if (Number.isInteger(n)) return String(n);
  return String(parseFloat(n.toFixed(2)));
};

/* ────────── Refer-back destinations ──────────
 * A referral no longer always sends the budget to the owner: the reviewer
 * chooses the level of the chain the budget returns to. These labels mirror the
 * backend constants in CampaignBudgetController (REFERRAL_LEVEL_*), which stay
 * authoritative — the detail payload returns `review.referral_targets`, and this
 * list supplies the labels / descriptions and the local fallback used when the
 * API omits them. */
const REFERRAL_TARGETS = [
  {
    value: 'sub_county',
    label: 'Sub-County level',
    hint: 'The sub-county owner revises the budget and resubmits it through the full chain (County → National DNMP review → Approver).',
  },
  {
    value: 'county',
    label: 'County level',
    hint: 'The county officer re-reviews the sub-county submission. On a county-level budget this sends it back to the county user for revision.',
  },
  {
    value: 'dnmp_review',
    label: 'National DNMP Review level',
    hint: 'The DNMP reviewers must review the budget again before it can be approved (their sign-off is withdrawn).',
  },
  {
    value: 'approver',
    label: 'National Approver level',
    hint: 'The national approvers must sign the budget off again (the final approval is withdrawn).',
  },
];

/* Local fallback mirroring CampaignBudgetController::referralLevelsFor():
 * the owning unit is always available, the county stage only exists for
 * standard sub-county budgets, and the two national stages always apply. */
const defaultReferralTargets = (b) => {
  const isSubCounty = !!(b && b.is_sub_county);
  const levels = [isSubCounty ? 'sub_county' : 'county'];
  if (isSubCounty && !(b && b.is_special_area)) levels.push('county');
  levels.push('dnmp_review', 'approver');
  return levels;
};

/* Map detail API response -> shape consumed by the template */
const mapDetail = (d) => {
  if (!d) return null;
  const demo = d.demographics || {};
  const sum = d.summary || {};
  const review = d.review || {};
  return {
    id: d.id,
    label: d.label || (d.admin_unit && d.admin_unit.name) || '',
    admin_unit: d.admin_unit || null,
    // county_profiles.id this budget was generated from — required by the
    // "Recompute Budget" action (POST recompute_county_profile_budgets/{id}).
    county_profile_id: d.county_profile_id ?? null,
    // Level + budget type drive the stage pipeline (which steps apply).
    budget_type: d.budget_type || 'standard',
    is_sub_county: !!(d.admin_unit && d.admin_unit.type === 'sub_county'),
    is_special_area: (d.budget_type || 'standard') === 'special_area',
    financial_year: d.financial_year,
    status: d.status,
    stage: d.stage,
    // Where this budget was last referred back to (sub_county | county |
    // dnmp_review | approver) — null when it has never been referred.
    referral_level: (d.referral && d.referral.referred_to_level) || null,
    flags: d.flags,
    submitted_at: d.submitted_at,
    submitted_by: d.submitted_by,
    population: demo.population || 0,
    households: demo.households || 0,
    wards: demo.wards || 0,
    locations: demo.locations || 0,
    sub_locations: demo.sub_locations || 0,
    villages: demo.villages || 0,
    posts: demo.posts || 0,
    class_size_hw: demo.class_size_hw || 0,
    class_size_chv: demo.class_size_chv || 0,
    nets_required: sum.nets_required || 0,
    nets_per_hh: sum.nets_per_household || 0,
    cost_per_net: sum.cost_per_net_kes || 0,
    total_budget: sum.total_budget_kes || 0,
    categories: (d.categories || []).map((cat) => ({
      id: cat.id,
      code: cat.code,
      name: cat.name,
      badge: cat.badge,
      multiplier_display: cat.multiplier_display || '',
      session_multiplier: cat.session_multiplier ?? null,
      // Drift: the current county_profile multiplier vs. the value this budget
      // was actually costed with (the profile is the source of truth going
      // forward; a mismatch means a recalculation would change the totals).
      profile_multiplier: cat.profile_multiplier ?? null,
      multiplier_mismatch: !!cat.multiplier_mismatch,
      // Preview toggle — mirrors the county / sub-county session multiplier.
      multiplierApplied: false,
      total: cat.total_kes || 0,
      items: (cat.parameters || []).map((p) => ({
        id: p.id,
        // Real budget_line_items.id — required for the pre-approval edits.
        line_item_id: p.line_item_id ?? null,
        // category_parameters.id — lets a saved unit edit be written back to
        // the shared profile layer (category_parameter_profiles).
        category_parameter_id: p.category_parameter_id ?? null,
        item: p.item,
        unit_cost: p.unit_cost_kes || 0,
        days: p.days || 0,
        units: p.units || 0,
        // Only surface the multiplier when it actually scales the line (> 1).
        multiplier:
          p.session_multiplier && p.session_multiplier > 1
            ? p.session_multiplier
            : null,
        total: p.total_kes || 0,
        source: p.source,
        parameter_id: p.parameter_id,
        // Edit metadata — drives which editor a row shows while the budget
        // is editable (manual units/days vs. an auto-calculated override).
        is_auto_calculated: !!p.is_auto_calculated,
        is_special_cost: !!p.is_special_cost,
        // SAC item code + per-item units bounds — drive the editor's min/max.
        special_type: p.special_type || null,
        min_units: p.min_units == null ? null : Number(p.min_units),
        max_units: p.max_units == null ? null : Number(p.max_units),
        override_value: p.override_value == null ? null : Number(p.override_value),
      })),
    })),
    can_approve: !!review.can_approve,
    can_review: !!review.can_review,
    can_refer_back: !!review.can_refer_back,
    // Levels this budget may be referred back TO — the backend-authoritative
    // list that drives the Refer Back modal's destination selector.
    referral_targets: review.referral_targets || [],
    // Pre-approval editing window (Finance Officer / Program Accountant).
    // False once the budget is approved — the row is then read-only.
    can_edit: !!review.can_edit,
    history: review.history || [],
    dnmp_review: d.dnmp_review || null,
    // Immutable reviewer-change audit trail (list of individual changes).
    line_item_changes: (d.line_item_changes || []).map((c) => ({
      id: c.id,
      // The budget category the edited line belongs to.
      category_label:
        c.line_item && c.line_item.budget_category
          ? c.line_item.budget_category.name
          : '—',
      item_label: c.line_item ? c.line_item.label : `Line #${c.budget_line_item_id}`,
      field_label: CHANGE_FIELD_LABELS[c.field] || c.field,
      // Whole numbers rendered without decimals (e.g. 6.000000 → "6").
      original_value: formatAuditValue(c.original_value),
      updated_value: formatAuditValue(c.updated_value),
      reviewer_name: reviewerName(c.reviewer),
      reviewer_role:
        c.reviewer_role || (c.reviewer && c.reviewer.role ? c.reviewer.role.name : null),
      comment: c.comment,
      at: c.created_at,
    })),
    can_view_changes: !!d.can_view_changes,
  };
};

export default {
  name: 'NationalBudgetReview',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, BudgetStagePipeline },
  setup() {
    const counties = ref([]);
    const selectedCounty = ref(null);
    const selectedBudget = ref(null);

    const loadingCounties = ref(false);
    const loadingDetail = ref(false);

    const openCategoryKeys = ref([]);

    const referModal = ref(false);
    const referring = ref(false);
    const referNote = ref('');
    /* Destination level selected in the Refer Back modal
     * (sub_county | county | dnmp_review | approver). Always chosen explicitly —
     * the modal does not open with a preselected destination. */
    const referTarget = ref(null);

    /* DNMP Accountant review (before Finance Officer approval) */
    const reviewModal = ref(false);
    const reviewing = ref(false);
    const reviewNote = ref('');

    /* Final national approval (Finance Officer). A confirmation modal that
     * surfaces the DNMP Accountant's review comments before signing off —
     * applies to both the standard and Special Area Cost budgets. */
    const approveModal = ref(false);

    /* ────────── Filters ──────────
     * filterCountyId       – restrict to a single county (also auto-drills
     *                        into level 2 when explicitly picked).
     * filterSubCountyId    – restrict to a single sub-county within the
     *                        chosen / drilled-in county.
     * filterStage          – restrict by `stage` label as emitted by the
     *                        backend's statusToStageLabel().
     *
     * All filters are evaluated locally against the counties payload that
     * is already loaded by fetchCounties() — no extra round-trip needed.
     */
    const filterCountyId = ref(null);
    const filterSubCountyId = ref(null);
    const filterStage = ref(null);

    const stageOptions = [
      { value: 'Preparatory Stage',        label: 'Preparatory Stage' },
      { value: 'County Review',            label: 'County Review (sub-county submitted)' },
      { value: 'Pending DNMP Review',      label: 'Pending DNMP Review (county budget submitted)' },
      { value: 'County Approved',          label: 'County Approved (awaiting DNMP review)' },
      { value: 'Pending National Approval', label: 'Pending National Approval (reviewed, awaiting Finance Officer)' },
      { value: 'National Approved',        label: 'National Approved' },
    ];

    const hasActiveFilters = computed(() =>
      !!(filterCountyId.value || filterSubCountyId.value || filterStage.value),
    );

    const resetFilters = () => {
      filterCountyId.value = null;
      filterSubCountyId.value = null;
      filterStage.value = null;
    };

    /* Sub-county options derived from the active county scope. When the
     * user is at level 2, options are drawn from the drilled-in county.
     * When at level 1 with a county filter, options are drawn from that
     * filtered county. Otherwise empty (we don't flatten across counties). */
    const subCountyOptions = computed(() => {
      const sourceCounty =
        selectedCounty.value ||
        (filterCountyId.value
          ? counties.value.find((c) => c.id === filterCountyId.value)
          : null);
      if (!sourceCounty) return [];
      return (sourceCounty.sub_counties || []).map((sc) => ({
        id: sc.id,
        label: sc.name,
      }));
    });

    /* Clear sub-county selection whenever county scope changes. */
    const onCountyFilterChange = () => {
      filterSubCountyId.value = null;
    };

    /* Helpers — does a budget row match the stage filter? */
    const stageMatches = (stage) => {
      if (!filterStage.value) return true;
      return stage === filterStage.value;
    };

    /* A county is included if either:
     *   – its county-level budget matches, OR
     *   – any sub-county budget under it matches.
     * Plus, if a sub-county id filter is set, the county must contain it. */
    const filteredCounties = computed(() => {
      let list = counties.value;

      if (filterCountyId.value) {
        list = list.filter((c) => c.id === filterCountyId.value);
      }

      if (filterSubCountyId.value) {
        list = list.filter((c) =>
          (c.sub_counties || []).some((sc) => sc.id === filterSubCountyId.value),
        );
      }

      if (filterStage.value) {
        list = list.filter((c) => {
          const cbMatch = c.county_budget && stageMatches(c.county_budget.stage);
          // The county's own Special Area Cost budget is a separate record.
          const csacMatch = c.sac_budget && stageMatches(c.sac_budget.stage);
          const scMatch = (c.sub_counties || []).some(
            (sc) =>
              (sc.budget && stageMatches(sc.budget.stage)) ||
              (sc.sac_budget && stageMatches(sc.sac_budget.stage)),
          );
          return cbMatch || csacMatch || scMatch;
        });
      }

      return list;
    });

    /* Within level 2, sub-county cards visible after filters. */
    const filteredSubCounties = computed(() => {
      if (!selectedCounty.value) return [];
      let list = selectedCounty.value.sub_counties || [];
      if (filterSubCountyId.value) {
        list = list.filter((sc) => sc.id === filterSubCountyId.value);
      }
      if (filterStage.value) {
        list = list.filter(
          (sc) =>
            (sc.budget && stageMatches(sc.budget.stage)) ||
            (sc.sac_budget && stageMatches(sc.sac_budget.stage)),
        );
      }
      return list;
    });

    /* County-level budget tile visibility on level 2. Hidden if a
     * sub-county is specifically targeted, or if the stage filter
     * rules it out. */
    const countyBudgetTileVisible = computed(() => {
      if (!selectedCounty.value) return false;
      if (filterSubCountyId.value) return false;
      const cb = selectedCounty.value.county_budget;
      if (filterStage.value) {
        return !!(cb && stageMatches(cb.stage));
      }
      return true;
    });

    /* County-level SPECIAL AREA COST tile visibility on level 2. This is a
     * distinct record from the county standard budget; it is shown whenever a
     * SAC budget exists for the county (subject to the stage filter). */
    const countySacTileVisible = computed(() => {
      if (!selectedCounty.value) return false;
      if (filterSubCountyId.value) return false;
      const sac = selectedCounty.value.sac_budget;
      if (!sac) return false;
      if (filterStage.value) {
        return stageMatches(sac.stage);
      }
      return true;
    });

    /* Compact count message shown beside the Reset button. */
    const filteredCountResult = computed(() => {
      if (selectedCounty.value) {
        const n =
          filteredSubCounties.value.length +
          (countyBudgetTileVisible.value ? 1 : 0) +
          (countySacTileVisible.value ? 1 : 0);
        return `${n} budget${n === 1 ? '' : 's'}`;
      }
      const n = filteredCounties.value.length;
      return `${n} county${n === 1 ? '' : 'ies'}`;
    });

    /* fetch counties list -------------------------------- */
    const fetchCounties = async () => {
      loadingCounties.value = true;
      try {
        const { data } = await axios.get('get_national_budget_review_counties');
        counties.value = (data && data.counties) || [];
      } catch (err) {
        message.error('Failed to load counties');
        // eslint-disable-next-line no-console
        console.error('get_national_budget_review_counties error:', err);
      } finally {
        loadingCounties.value = false;
      }
    };

    /* fetch one budget detail ---------------------------- */
    const fetchBudgetDetail = async (budgetId) => {
      if (!budgetId) return;
      // NB: this deliberately does NOT touch edit mode. It is called both when
      // opening a (different) budget AND to refresh the SAME budget after a
      // per-category Save — the latter must keep edit mode so the reviewer can
      // move straight on to the next category. Opening a different budget
      // resets edit mode via resetEditState() in the navigation helpers below.
      const isSameBudget = !!selectedBudget.value && selectedBudget.value.id === budgetId;
      loadingDetail.value = true;
      try {
        const { data } = await axios.get('get_national_budget_review_detail', {
          params: { budget_id: budgetId },
        });
        const mapped = mapDetail(data);
        selectedBudget.value = mapped;
        // Keep the currently-expanded categories when merely refreshing the same
        // budget (e.g. after a per-category Save) so the reviewer's place isn't
        // lost; only a freshly-opened budget starts on its first category.
        if (!isSameBudget) {
          openCategoryKeys.value = mapped && mapped.categories.length
            ? [mapped.categories[0].id]
            : [];
        }
      } catch (err) {
        message.error('Failed to load budget detail');
        // eslint-disable-next-line no-console
        console.error('get_national_budget_review_detail error:', err);
      } finally {
        loadingDetail.value = false;
      }
    };

    /* navigation ----------------------------------------- */
    const openCounty = (c) => {
      resetEditState();
      selectedCounty.value = c;
      selectedBudget.value = null;
    };
    const openCountyBudget = () => {
      const cb = selectedCounty.value && selectedCounty.value.county_budget;
      if (!cb || !cb.id) return;
      resetEditState();
      fetchBudgetDetail(cb.id);
    };
    const openSubCountyBudget = (sc) => {
      if (!sc || !sc.budget || !sc.budget.id) return;
      resetEditState();
      fetchBudgetDetail(sc.budget.id);
    };
    // The Special Area Cost budget is its own record — open it independently
    // so the Accountant / Finance Officer review and approve it on its own.
    const openSacBudget = (sc) => {
      const sac = sc && sc.sac_budget;
      if (!sac || !sac.id) return;
      resetEditState();
      fetchBudgetDetail(sac.id);
    };
    const goCounties = () => {
      resetEditState();
      selectedCounty.value = null;
      selectedBudget.value = null;
      // Clearing the drill-in also clears the sub-county filter — its
      // options were scoped to the previously-open county.
      filterSubCountyId.value = null;
    };
    const goCountyBudgets = () => {
      resetEditState();
      selectedBudget.value = null;
    };

    /* table columns -------------------------------------- */
    const itemColumns = [
      { title: 'Budget Item', dataIndex: 'item', key: 'item' },
      { title: 'Unit Cost', key: 'unit_cost', align: 'right', width: 140 },
      { title: 'Days', key: 'days', align: 'right', width: 100 },
      { title: 'Units', key: 'units', align: 'right', width: 100 },
      { title: 'Multiplier', key: 'multiplier', align: 'right', width: 120 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 160 },
    ];

    /* Columns for the reviewer change-history table. */
    const changeColumns = [
      { title: 'Budget Category', key: 'category', width: 180 },
      { title: 'Budget Item', key: 'item' },
      { title: 'Field', key: 'field', width: 110 },
      { title: 'Change', key: 'change', width: 180 },
      { title: 'Reviewer', key: 'reviewer', width: 200 },
      { title: 'Comment', key: 'comment' },
      { title: 'When', key: 'at', width: 160 },
    ];

    /* actions -------------------------------------------- */
    /* Button visibility is gated by the EXACT business roles (mirrors the
     * strict backend gate in CampaignBudgetController):
     *   • Accountant (DNMP) | Finance Officer | Program Accountant
     *     | Super Admin                              → Mark as Reviewed
     *   • Program Head | GF Manager (DNMP GF Manager) |
     *     Vector Control (Vector Unit Head) | Super Admin  → Approve
     * The national REVIEWERS (Finance Officer / Program Accountant / DNMP
     * Accountant) may review/edit but can NOT approve.
     * The budget state (server-side can_review / can_approve) must also
     * allow it — e.g. Super Admin sees both buttons, but only when the
     * budget is actually at the right stage. */
    const canReview  = computed(() =>
      hasRoleByName([
        'Super Admin',
        'Accountant',
        'Finance Officer',
        'Program Accountant',
      ]).value,
    );
    const canApprove = computed(() =>
      hasRoleByName([
        'Super Admin',
        'Program head',
        'DNMP Program Head',
        'DNMP GF Manager',
        'Vector Unit Head',
      ]).value,
    );

    const approving = ref(false);
    const openReviewModal = () => {
      reviewNote.value = '';
      reviewModal.value = true;
    };
    const markReviewed = async () => {
      const record = selectedBudget.value;
      if (!record || !record.id) {
        notification.error({ message: 'Cannot review: missing budget id.' });
        return;
      }
      reviewing.value = true;
      try {
        await axios.post(`dnmp_review_campaign_budget/${record.id}`, {
          review_notes: reviewNote.value.trim() || undefined,
        });
        record.status = 'dnmp_reviewed';
        record.can_review = false;
        record.can_approve = true;
        notification.success({
          message: `Budget for ${record.label} marked as reviewed.`,
        });
        reviewModal.value = false;
        // Reload so the review strip shows the reviewer + notes from the server.
        await fetchBudgetDetail(record.id);
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to submit review',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        reviewing.value = false;
      }
    };
    const approveBudget = async (record) => {
      if (!record || !record.id) {
        notification.error({ message: 'Cannot approve: missing budget id.' });
        return;
      }
      approving.value = true;
      try {
        await axios.post(`approve_campaign_budget/${record.id}`);
        record.status = 'approved';
        record.can_approve = false;
        record.can_review = false;
        record.can_refer_back = false;
        notification.success({
          message: `Budget for ${record.label} approved.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to approve budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        approving.value = false;
      }
    };

    /* Open the approval confirmation. Guards against a missing budget id so the
     * modal never opens in an unusable state. */
    const openApproveModal = () => {
      if (!selectedBudget.value || !selectedBudget.value.id) {
        notification.error({ message: 'Cannot approve: missing budget id.' });
        return;
      }
      approveModal.value = true;
    };

    /* Confirm handler — runs the actual approval, keeping the modal open (with
     * its loading state) until the request settles. */
    const confirmApprove = async () => {
      await approveBudget(selectedBudget.value);
      approveModal.value = false;
    };

    /* Roles allowed to refer a budget back WHILE it is still in the chain
     * (submitted / county approved / awaiting national approval). Mirrors the
     * backend gate: the county stage, the national reviewers and the national
     * approvers, plus the Super Admin override. */
    const IN_CHAIN_REFERRAL_ROLES = [
      'Super Admin',
      'Accountant',
      'Finance Officer',
      'Program Accountant',
      'Program head',
      'DNMP Program Head',
      'DNMP GF Manager',
      'Vector Unit Head',
    ];
    /* Roles allowed to pull an ALREADY APPROVED budget back into the chain:
     * the Super Admin (full override) and the national APPROVERS who signed the
     * budget off. The national reviewers can never disturb an approved budget.
     * To restrict post-approval referral to the Super Admin alone, drop the
     * four approver roles below (and the `isDnmpApprover()` clause in
     * CampaignBudgetController::reject). */
    const POST_APPROVAL_REFERRAL_ROLES = [
      'Super Admin',
      'Program head',
      'DNMP Program Head',
      'DNMP GF Manager',
      'Vector Unit Head',
    ];

    const openReferModal = () => {
      referNote.value = '';
      // Force an explicit destination choice — never refer back silently.
      referTarget.value = null;
      referModal.value = true;
    };

    /* Destination options for the Refer Back modal: the backend's
     * `review.referral_targets` when present (authoritative), else the local
     * mirror of CampaignBudgetController::referralLevelsFor(). */
    const referTargetOptions = computed(() => {
      const b = selectedBudget.value;
      if (!b) return [];
      const allowed = b.referral_targets && b.referral_targets.length
        ? b.referral_targets
        : defaultReferralTargets(b);
      return REFERRAL_TARGETS
        .filter((t) => allowed.includes(t.value))
        .map((t) => ({ value: t.value, label: t.label }));
    });

    /* Explanation of the selected destination, shown under the selector. */
    const referTargetHint = computed(() => {
      const hit = REFERRAL_TARGETS.find((t) => t.value === referTarget.value);
      return hit ? hit.hint : '';
    });

    /* Locally-derived eligibility. The backend strictly restricts referrals:
     *   • in-chain stages  → county reviewers / national chain / Super Admin
     *   • approved         → Super Admin or a national APPROVER only
     * and it reports the verdict in `can_refer_back`, which is honoured first. */
    const canReferBack = computed(() => {
      const b = selectedBudget.value;
      if (!b) return false;
      // The BE explicitly says false → respect it (e.g. a national reviewer
      // looking at an approved budget).
      if (b.can_refer_back === false) return false;
      if (b.status === 'approved') {
        return hasRoleByName(POST_APPROVAL_REFERRAL_ROLES).value;
      }
      if (!hasRoleByName(IN_CHAIN_REFERRAL_ROLES).value) return false;
      return ['submitted', 'county_approved', 'dnmp_reviewed'].includes(b.status);
    });
    const handleRefer = async () => {
      const note = referNote.value.trim();
      if (note.length < 10) {
        notification.warning({
          message: 'Please provide feedback (minimum 10 characters).',
        });
        return;
      }
      if (!referTarget.value) {
        notification.warning({
          message: 'Choose the level to refer this budget back to.',
        });
        return;
      }
      if (!selectedBudget.value || !selectedBudget.value.id) {
        referModal.value = false;
        return;
      }
      const level = referTarget.value;
      const target = REFERRAL_TARGETS.find((t) => t.value === level);
      const budgetId = selectedBudget.value.id;
      referring.value = true;
      try {
        await axios.post(`reject_campaign_budget/${budgetId}`, {
          rejection_note: note,
          // The backend rewinds the budget to the chosen level (e.g. `county`
          // re-opens the county review; `approver` withdraws the approval).
          referral_level: level,
        });
        notification.success({
          message: `Budget referred back to the ${target ? target.label : level}.`,
        });
        referModal.value = false;
        // Re-read the budget so the pipeline, stage labels and action buttons
        // reflect where it now sits, then refresh the stage summary strip.
        await fetchBudgetDetail(budgetId);
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to refer budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        referring.value = false;
      }
    };
    /* ────────── Pre-approval line-item editing ──────────
     * The DNMP Accountant, Finance Officer and Program Accountant (plus Super
     * Admin) may correct county & sub-county budget figures at any stage BEFORE
     * final approval. Once approved the backend returns can_edit=false and the
     * table stays read-only. Edits are saved per row via update_budget_line_item,
     * and the backend requires a comment for every changed figure. */
    const canEditBudget = computed(() =>
      hasRoleByName(['Super Admin', 'Accountant', 'Finance Officer', 'Program Accountant']).value,
    );

    /* The profile-multiplier drift indicator is a Super-Admin-only diagnostic —
     * it is a configuration/consistency check, not part of the normal review
     * workflow, so it is hidden from the review / approval roles. */
    const isSuperAdmin = computed(() => hasRoleByName(['Super Admin']).value);

    /* Roles allowed to see the reviewer-change audit history (approver
     * visibility): the post-review sign-off roles plus the editors. */
    const canViewChanges = computed(() =>
      hasRoleByName([
        'Super Admin',
        'Accountant',
        'Finance Officer',
        // Vector Unit Head approves after the reviewers, so it must be able
        // to read the reviewer change history ("update log") before signing off.
        'Vector Unit Head',
        'Program Accountant',
        'DNMP Program Head',
        'Program head',
        'DNMP GF Manager',
      ]).value,
    );
    const canEditSelected = computed(() =>
      !!(selectedBudget.value && selectedBudget.value.can_edit && canEditBudget.value),
    );

    const editing = ref(false);
    // Snapshot of editable values when edit mode opens, so we can detect
    // changed rows and restore them on cancel.
    const editSnapshot = ref({});
    // Per-row mandatory reviewer comment, keyed by line_item_id.
    const editComments = ref({});

    const editableItems = computed(() => {
      const b = selectedBudget.value;
      if (!b) return [];
      return (b.categories || []).flatMap((cat) => cat.items || []);
    });

    /* Reviewer change history for the open budget (from the audit trail). */
    const changeHistory = computed(() =>
      (selectedBudget.value && selectedBudget.value.line_item_changes) || [],
    );

    /* ── Edit-mode lifecycle ──────────────────────────────────────────────
     * Edit mode spans the WHOLE budget so the reviewer can save several
     * categories in one pass. It is only left on Cancel, after the global
     * Recalculate, or when navigating away to another budget. */

    /** Leave edit mode and drop the scratch state. */
    const resetEditState = () => {
      editing.value = false;
      editSnapshot.value = {};
      editComments.value = {};
    };

    /**
     * (Re)seed the edit baseline from the CURRENT items — they are then treated
     * as "saved" (not dirty) while edit mode stays ON. Called when edit mode
     * opens and after each per-category Save so the reviewer can carry straight
     * on to the next category without clicking "Edit Budget" again.
     */
    const seedEditBaseline = () => {
      const snap = {};
      editableItems.value.forEach((it) => {
        snap[it.line_item_id] = { units: it.units };
      });
      editSnapshot.value = snap;
      editComments.value = {};
      (selectedBudget.value?.categories || []).forEach((cat) => {
        cat.multiplierApplied = false;
      });
    };

    const beginEdit = () => {
      seedEditBaseline();
      editing.value = true;
    };

    const cancelEdit = () => {
      editableItems.value.forEach((it) => {
        const s = editSnapshot.value[it.line_item_id];
        if (!s) return;
        it.units = s.units;
      });
      (selectedBudget.value?.categories || []).forEach((cat) => {
        cat.multiplierApplied = false;
      });
      resetEditState();
    };

    /** Per-row comment binding (v-model target for the comment column). */
    const rowComment = (it) => editComments.value[it.line_item_id] || '';
    const setRowComment = (it, value) => {
      editComments.value = { ...editComments.value, [it.line_item_id]: value };
    };

    const norm = (v) => (v == null || v === '' ? null : Number(v));

    // The reviewer edits UNITS ONLY — never days, the override or the subtotal.
    const isRowDirty = (it) => {
      const s = editSnapshot.value[it.line_item_id];
      if (!s) return false;
      return norm(it.units) !== norm(s.units);
    };

    const dirtyEditCount = computed(() => editableItems.value.filter(isRowDirty).length);

    /* ── Session multiplier (preview) ────────────────────────────────────
     * Mirrors the county / sub-county grid: the multiplier itself is read from
     * the profile at generation time; the toggle only previews the scaled
     * subtotal before the reviewer regenerates the budget. */
    const hasSessionMultiplier = (cat) => (Number(cat?.session_multiplier) || 1) > 1;

    /* Base subtotal for a category: Σ unit_cost × days × units (no multiplier). */
    const categorySubtotal = (cat) =>
      (cat.items || []).reduce(
        (s, i) =>
          s + (Number(i.unit_cost) || 0) * (Number(i.days) || 1) * (Number(i.units) || 0),
        0,
      );

    /* Category total shown in the multiplier bar (subtotal × multiplier when on). */
    const categoryTotal = (cat) => {
      const m = cat.multiplierApplied ? Number(cat.session_multiplier) || 1 : 1;
      return categorySubtotal(cat) * m;
    };

    const applyMultiplier = (cat) => {
      cat.multiplierApplied = !cat.multiplierApplied;
    };

    /** True when any row in the category has an unsaved unit change. */
    const isCategoryDirty = (cat) => (cat.items || []).some(isRowDirty);

    /* Per-category SAVE — persists this category's unit edits (audited, with a
     * mandatory comment), writes them to the shared profile layer and
     * regenerates the category so its subtotal + the grand total recompute.
     * Mirrors the county / sub-county grid's per-category Save. */
    const savingCategoryId = ref(null);

    const saveCategory = async (cat) => {
      const b = selectedBudget.value;
      const rid = b && b.id;
      if (!rid || !cat) return;

      const dirty = (cat.items || []).filter(isRowDirty);
      if (!dirty.length) return;

      // Every edited line is saveable: the backend writes mapped rows to the
      // shared profile layer AND all rows directly on the line item; rows with
      // no category_parameter mapping (Special Area Cost / legacy) are saved
      // straight on the line item.
      const savable = dirty.filter((it) => it.line_item_id);

      // Mandatory comment: a reviewer cannot save a changed figure without one.
      const missing = savable.filter((it) => !rowComment(it).trim());
      if (missing.length) {
        notification.error({
          message: 'A comment is required for every changed figure.',
          description: `Add a comment for: ${missing.map((it) => it.item).join(', ')}.`,
        });
        return;
      }

      savingCategoryId.value = cat.id;
      try {
        await axios.post(`save_reviewer_category_units/${rid}`, {
          category_id: cat.id,
          parameters: savable.map((it) => ({
            line_item_id: it.line_item_id,
            // null for unmapped rows (Special Area Cost / legacy) — the
            // backend resolves the mapping server-side and falls back to a
            // direct line-item write when there is none.
            category_parameter_id: it.category_parameter_id ?? null,
            total_units: Number(it.units) || 0,
            comment: rowComment(it).trim(),
          })),
        });
        notification.success({
          message: `${cat.name} saved`,
          description: 'Units saved and subtotal recalculated.',
        });
        // Refresh so the recalculated subtotal + grand total are shown, then
        // re-seed the baseline so edit mode STAYS ON and the reviewer can go
        // straight to the next category — no second "Edit Budget" click.
        await fetchBudgetDetail(rid);
        if (editing.value) seedEditBaseline();
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: `Failed to save ${cat.name}`,
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        savingCategoryId.value = null;
      }
    };

    /* Global RECALCULATE TOTALS — regenerates the whole budget from the saved
     * profile units so the reviewer sees the actual grand total. This replaces
     * the old blanket "Save changes" action. */
    const recalculating = ref(false);

    const recalculateTotals = async () => {
      const b = selectedBudget.value;
      const rid = b && b.id;
      if (!rid) return;

      recalculating.value = true;
      try {
        await axios.post(`recalculate_budget_line_items/${rid}`);
        notification.success({ message: 'Totals recalculated.' });
        resetEditState();
        await fetchBudgetDetail(rid);
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to recalculate totals',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        recalculating.value = false;
      }
    };

    /* ───────── Recompute from the county profile ─────────
     * "↻ Recompute Budget" — for use after the underlying county_profiles row
     * was edited directly in the database. Re-runs
     *   POST recompute_county_profile_budgets/{county_profile_id}
     * which (1) recomputes the profile's auto-calculated fields (+ its category
     * parameter profiles) and (2) re-resolves every standard line item's
     * session multiplier from the profile, recalculating its total and the
     * budget grand total. Unlike `recalculate_budget_line_items`, which works
     * from the (possibly stale) profile snapshot, this refreshes the profile
     * itself first.
     *
     * Available for BOTH county-level and sub-county-level budgets — the
     * endpoint resolves the correct profile for whichever budget is open.
     * Gated by the `recompute_county_profile_budgets` permission (the backend
     * route carries the same `role_permission` middleware and is the final
     * authority).
     */
    const recomputing = ref(false);
    const canRecomputeProfile = hasPermission('recompute_county_profile_budgets');

    const recomputeProfileBudgets = async () => {
      const b = selectedBudget.value;
      const budgetId = b && b.id;
      const profileId = b && b.county_profile_id;

      if (!profileId) {
        notification.warning({
          message: 'County profile not available',
          description:
            'Could not resolve the county profile this budget was generated from, so it cannot be recomputed.',
        });
        return;
      }

      recomputing.value = true;
      try {
        const { data } = await axios.post(
          `recompute_county_profile_budgets/${profileId}`,
        );

        // Re-read the budget so the refreshed multipliers / line totals and
        // grand total are shown, then refresh the grid (per-budget totals).
        if (budgetId) await fetchBudgetDetail(budgetId);
        await fetchCounties();

        const updated = data && data.line_items_updated;
        notification.success({
          message: 'Budget recomputed',
          description:
            (data && data.message) ||
            (typeof updated === 'number'
              ? `Profile recomputed; ${updated} line item(s) updated.`
              : 'Profile recomputed and line items refreshed.'),
        });
      } catch (err) {
        notification.error({
          message: 'Failed to recompute budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        recomputing.value = false;
      }
    };

    /* Columns: add the mandatory reviewer-comment column only while editing so
     * the read-only review view keeps its original six-column layout. The
     * reviewer edits UNITS ONLY — there is no Override column any more. */
    const showEditColumns = computed(() => editing.value && canEditSelected.value);
    const tableColumns = computed(() => {
      const cols = [...itemColumns];
      if (showEditColumns.value) {
        // Mandatory reviewer comment column (one per changed figure).
        cols.splice(cols.length - 1, 0, {
          title: 'Reviewer comment',
          key: 'comment',
          width: 220,
        });
      }
      return cols;
    });

    // Summary row col-span must track the dynamic column count.
    const summaryColSpan = computed(() => tableColumns.value.length - 1);

    /* ────────── Stage pipeline (where each budget sits) ──────────
     * Reviewers need the whole pre-approval journey at a glance, not just the
     * budgets already sitting on their desk. */

    /**
     * The status at which the ACTING user reviews / approves, per budget type.
     * Drives the accented "YOU" step in BudgetStagePipeline.
     *   • Finance Officer / Super Admin → dnmp_reviewed (final approval)
     *   • Accountant / Super Admin      → submitted (county + SAC) or
     *                                     county_approved (sub-county)
     *   • Program Accountant            → null (edits any pre-approval stage)
     */
    const myActionStatus = (isSubCounty, isSpecialArea) => {
      if (canApprove.value) return 'dnmp_reviewed';
      if (canReview.value) {
        return (!isSpecialArea && isSubCounty) ? 'county_approved' : 'submitted';
      }
      return null;
    };

    // Ordered review-pipeline buckets, keyed by the backend's stage label so
    // every budget lands in exactly one bucket regardless of level / SAC type.
    //
    // `showSac` marks the stages a Special Area Cost budget can actually reach.
    // SAC budgets skip the county tier entirely (they go straight to National),
    // so the County Review / County Approved stages are STANDARD-only and must
    // not show a SAC column.
    //
    // Each bucket also carries a `hint` — the plain-language meaning of the
    // stage, surfaced on hover only (no wording is rendered on the cards).
    const STAGE_BUCKETS = [
      {
        label: 'Preparatory Stage',
        short: 'Preparatory',
        showSac: true,
        hint: 'Draft — the county or sub-county is still preparing this budget and has not submitted it yet.',
      },
      {
        label: 'County Review',
        short: 'County Review',
        showSac: false, // SAC budgets never enter the county tier
        hint: 'Sub-county budget submitted — awaiting the county officer’s approval.',
      },
      {
        label: 'County Approved',
        short: 'County Approved',
        showSac: false, // SAC budgets never enter the county tier
        hint: 'County has approved this sub-county budget. It is now queued for the DNMP (national) review before final approval.',
      },
      {
        label: 'Pending DNMP Review',
        short: 'DNMP Review',
        showSac: true,
        hint: 'Awaiting the DNMP Accountant: a submitted county budget, a County-Approved sub-county budget, or a submitted Special Area Cost budget.',
      },
      {
        label: 'Pending National Approval',
        short: 'National Approval',
        showSac: true,
        hint: 'Reviewed by the DNMP Accountant — awaiting final approval by the Finance Officer.',
      },
      {
        label: 'National Approved',
        short: 'Approved',
        showSac: true,
        hint: 'Fully approved at national level. The budget is locked and can no longer be edited.',
      },
    ];

    /**
     * Counts of every budget at each stage, across all counties, split by
     * budget type. The counts payload keeps the two types in separate fields —
     * `county_budget` / `sub_counties[].budget` are STANDARD budgets and
     * `sac_budget` / `sub_counties[].sac_budget` are SAC budgets — so each
     * stage can state exactly how many of each sit there.
     *
     * Each bucket also collects the NAMES of the budgets sitting in it
     * (`standardItems` / `sacItems`) so hovering the stage can list exactly
     * which counties and sub-counties are queued there.
     */
    const stageSummary = computed(() => {
      const rows = {};
      STAGE_BUCKETS.forEach((b) => {
        rows[b.label] = { standard: 0, sac: 0, standardItems: [], sacItems: [] };
      });

      // `name` identifies the budget owner; `kind` picks the type column.
      const bump = (b, kind, name) => {
        if (!b || !b.stage || rows[b.stage] === undefined || !name) return;
        rows[b.stage][kind] += 1;
        if (kind === 'sac') {
          rows[b.stage].sacItems.push(name);
        } else {
          rows[b.stage].standardItems.push(name);
        }
      };

      counties.value.forEach((c) => {
        bump(c.county_budget, 'standard', `${c.name} — County budget`);
        bump(c.sac_budget, 'sac', `${c.name} — County SAC budget`);
        (c.sub_counties || []).forEach((sc) => {
          bump(sc.budget, 'standard', `${sc.name} — Sub-county budget`);
          bump(sc.sac_budget, 'sac', `${sc.name} — Sub-county SAC budget`);
        });
      });

      return STAGE_BUCKETS.map((b, i) => {
        const r = rows[b.label];
        return {
          ...b,
          order: i + 1,               // 1→6 so the stage order is unambiguous
          standard: r.standard,
          sac: r.sac,
          count: r.standard + r.sac,
          // Owner names queued in this stage — listed on hover.
          standardItems: r.standardItems.sort(),
          sacItems: r.sacItems.sort(),
          entries: r.standardItems.concat(r.sacItems),
        };
      });
    });

    const stageSummaryTotal = computed(() =>
      stageSummary.value.reduce((a, b) => a + b.count, 0),
    );

    /** Pipeline totals per budget type — the header legend. */
    const stageSummaryByType = computed(() => ({
      standard: stageSummary.value.reduce((a, b) => a + b.standard, 0),
      sac: stageSummary.value.reduce((a, b) => a + b.sac, 0),
    }));

    /**
     * Stage labels where the acting role must act next — highlighted in the
     * summary strip so a reviewer can see what is queued for them.
     */
    const myActionStages = computed(() => {
      if (canApprove.value) return ['Pending National Approval'];
      if (canReview.value) return ['County Approved', 'Pending DNMP Review'];
      return [];
    });

    /**
     * The Program Accountant neither reviews nor approves — the whole
     * pre-approval window is editable for them. Surfaced separately so it can
     * be styled distinctly from the review/approve "awaiting you" stages.
     */
    const myEditableStages = computed(() => {
      if (canApprove.value || canReview.value) return [];
      if (canEditBudget.value) {
        return STAGE_BUCKETS
          .map((b) => b.label)
          .filter((label) => label !== 'National Approved');
      }
      return [];
    });

    const downloadBudgetPDF = () =>
      notification.info({ message: 'PDF download started (demo).' });

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    const formatReviewDate = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    onMounted(fetchCounties);

    /* kept for backward compat with template refs --------- */
    const countyBudgetRecord = computed(() => null);
    const subCountyRecord = () => null;

    return {
      counties,
      selectedCounty,
      selectedBudget,
      loadingCounties,
      loadingDetail,
      countyBudgetRecord,
      subCountyRecord,
      openCategoryKeys,
      referModal,
      referring,
      referNote,
      /* refer-back destination (level) selector */
      referTarget,
      referTargetOptions,
      referTargetHint,
      reviewModal,
      reviewing,
      reviewNote,
      itemColumns,
      changeColumns,
      tableColumns,
      showEditColumns,
      summaryColSpan,
      canEditSelected,
      canViewChanges,
      isSuperAdmin,
      changeHistory,
      editing,
      dirtyEditCount,
      isRowDirty,
      rowComment,
      setRowComment,
      beginEdit,
      cancelEdit,
      /* units-only editing: per-category save + multiplier + global recalc */
      savingCategoryId,
      saveCategory,
      isCategoryDirty,
      hasSessionMultiplier,
      categorySubtotal,
      categoryTotal,
      applyMultiplier,
      recalculating,
      recalculateTotals,
      /* recompute from the county profile (refreshes profile + line items) */
      recomputing,
      canRecomputeProfile,
      recomputeProfileBudgets,
      /* stage pipeline */
      myActionStatus,
      stageSummary,
      stageSummaryTotal,
      stageSummaryByType,
      myActionStages,
      myEditableStages,
      openCounty,
      openCountyBudget,
      openSubCountyBudget,
      openSacBudget,
      goCounties,
      goCountyBudgets,
      approving,
      approveBudget,
      approveModal,
      openApproveModal,
      confirmApprove,
      canReview,
      canApprove,
      openReviewModal,
      markReviewed,
      openReferModal,
      handleRefer,
      canReferBack,
      downloadBudgetPDF,
      fmt,
      formatReviewDate,
      // SAC per-item units ceiling (Enhanced Transport = 100, else 20).
      sacMaxUnits,
      /* filters */
      filterCountyId,
      filterSubCountyId,
      filterStage,
      stageOptions,
      subCountyOptions,
      hasActiveFilters,
      resetFilters,
      onCountyFilterChange,
      filteredCounties,
      filteredSubCounties,
      countyBudgetTileVisible,
      countySacTileVisible,
      filteredCountResult,
    };
  },
};
</script>

<style lang="less" scoped>
/* ───────── Slim top bar ───────── */
.tool-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f4fbf6;
  border: 1px solid #d9ecdf;
  border-radius: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #2f6746;
  font-weight: 600;
}

/* ───────── Page heading (platform theme) ───────── */
.page-heading {
  .ph-left {
    .ph-title {
      color: #15693c;
    }
    .ph-subtitle {
      font-size: 13px;
      color: #6b7a72;
    }
  }
}

.review-crumbs {
  font-size: 12px;
  :deep(a) {
    color: #2f6746;
    font-weight: 600;
  }
}

/* ───────── Section panel (platform theme) ───────── */
.panel {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
}

/* ───────── Filter panel (Levels 1 & 2) ───────── */
.panel.nbr-filter-panel {
  padding: 12px 16px;
  margin-bottom: 16px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  align-items: center;
  :deep(.ant-select) {
    width: 100%;
  }
}

.nbr-filter-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.nbr-fb-count {
  font-size: 12px;
  color: #2f6746;
  font-weight: 600;
  background: #e9f6ee;
  border-radius: 12px;
  padding: 2px 10px;
}

/* ───────── Card grid for levels 1 & 2 ───────── */
.card-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  margin-bottom: 18px;
}
.card-grid.four-col {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media (max-width: 1100px) {
  .card-grid.four-col {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

.drill-card {
  position: relative;
  background: #fff;
  border: 1px solid #e2ebe5;
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  &:hover {
    border-color: #4d8a63;
    box-shadow: 0 4px 14px rgba(15, 105, 60, 0.08);
    transform: translateY(-1px);
  }
  &.is-active {
    border-color: #15693c;
    background: #f4fbf6;
  }
  &.is-empty {
    opacity: 0.6;
    cursor: default;
    &:hover {
      transform: none;
      box-shadow: none;
    }
    .dc-meta { color: #8a9990; }
  }

  .dc-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .dc-title {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dc-icon {
    color: #4d8a63;
    font-size: 13px;
  }
  .dc-chevron {
    color: #95a59b;
    font-size: 18px;
    line-height: 1;
  }
  .dc-meta {
    font-size: 12px;
    color: #6b7a72;
  }
  .dc-meta-label {
    font-weight: 700;
    color: #4d8a63;
    margin-right: 4px;
  }
  .dc-stage,
  .dc-flag {
    display: inline-block;
    margin-top: 8px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.4;
    padding: 2px 10px;
    border-radius: 10px;
  }
  .dc-stage {
    background: #e9f6ee;
    color: #15693c;
    border: 1px solid #9ad8b4;
  }
  .dc-flag {
    background: #fff4e6;
    color: #b85c00;
    border: 1px solid #f0d3a0;
  }
}

.empty-hint {
  grid-column: 1 / -1;
  text-align: center;
  color: #8a9990;
  padding: 24px 0;
}

/* ───────── Level title (section header for lists) ───────── */
.level-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #15693c;
  margin: 6px 2px 12px;
  .lt-icon { color: #20c997; }
  .back-btn {
    margin-right: 4px;
    background: #fff;
    border: 1px solid #d9f0e2;
    color: #15693c;
    font-weight: 600;
    &:hover,
    &:focus {
      background: #f4fbf6;
      border-color: #9ad8b4;
      color: #15693c;
    }
  }
}

.ph-stage-tag {
  display: inline-block;
  margin-bottom: 14px;
  padding: 3px 12px;
  border-radius: 14px;
  background: #e9f6ee;
  color: #15693c;
  border: 1px solid #9ad8b4;
  font-size: 12px;
  font-weight: 600;
}

/* Detail header row: the stage tag on the left, the maintenance actions
   (e.g. "Recompute Budget") pinned to the right of the page. */
.detail-stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  /* The ROW now owns the bottom spacing (the tag used to). Drop the tag's own
     margin so both items are vertically centred beside each other. */
  .ph-stage-tag { margin-bottom: 0; }
}

/* ───────── Level 3 stats ───────── */
.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  .stat-chip {
    background: #f4fbf6;
    border: 1px solid #d9ecdf;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    color: #4d6357;
    .sc-label { color: #6b7a72; margin-right: 4px; }
    strong { color: #15693c; font-weight: 700; }
  }
}
.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.summary-tile {
  background: #fff;
  border: 1px solid #e2ebe5;
  border-radius: 10px;
  padding: 12px 14px;
  .st-label {
    font-size: 12px;
    color: #6b7a72;
    margin-bottom: 4px;
  }
  .st-value {
    font-size: 18px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.1;
    margin-top: 4px;
  }
  &.accent {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border-color: #c9e6d3;
  }
}

/* ───────── Collapsible categories ───────── */
.category-collapse {
  background: transparent;
  border: none;

  :deep(.ant-collapse-item) {
    background: #fff;
    border: 1px solid #e2ebe5 !important;
    border-radius: 10px !important;
    margin-bottom: 8px;
    overflow: hidden;
  }
  :deep(.ant-collapse-header) {
    align-items: center !important;
    padding: 12px 14px !important;
    background: #f9fcf8;
  }
  :deep(.ant-collapse-content) {
    border-top: 1px solid #eaf2e9;
  }
  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }

  .cat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    .cat-name {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      color: #15693c;
    }
    .cat-badge {
      background: #e9f6ee;
      color: #15693c;
      border: none;
      font-size: 10px;
      border-radius: 10px;
      padding: 1px 8px;
    }
    .cat-multiplier {
      background: #fff4e5;
      color: #b45309;
      border: 1px solid #fcd9a8;
      font-size: 10px;
      border-radius: 10px;
      padding: 1px 8px;
      font-weight: 600;
    }
    .cat-drift {
      background: #fdecea;
      color: #c0392b;
      border: 1px solid #f6c7c0;
      font-size: 10px;
      border-radius: 10px;
      padding: 1px 8px;
      font-weight: 600;
    }
    .cat-total {
      font-size: 13px;
      font-weight: 700;
      color: #15693c;
    }
  }
}

:deep(.category-table) {
  .ant-table { background: transparent; }
  .ant-table-thead > tr > th {
    background: #fff;
    border-bottom: 1px solid #eaf2e9;
    color: #6b7a72;
    font-weight: 600;
    font-size: 11px;
    text-transform: none;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f4f8f5;
    font-size: 12px;
    color: #2f3a35;
  }
  .ant-table-tbody > tr:hover > td { background: #fafcfb; }
  .ant-table-summary {
    background: #f4fbf6;
    .ant-table-cell { border-bottom: none; }
  }
  .cat-item-total { color: #15693c; font-weight: 700; }
  .row-multiplier { color: #b45309; font-weight: 600; }
  /* Pre-approval inline editors (Finance Officer / Program Accountant) */
  .nbr-edit-input { width: 92px; }
  .nbr-dirty-tag { margin-left: 6px; font-size: 10px; line-height: 16px; }
}

/* Reviewer comment column hint (rows with no change) */
.nbr-comment-hint { color: #b7c2bb; }

/* Reviewer change-history (audit trail) panel */
.change-history {
  margin-top: 14px;
  border: 1px solid #d6e5db;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fbfefc;

  .ch-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    strong { color: #15693c; font-size: 13px; }
  }
  .ch-count {
    font-size: 11px;
    color: #6b7a72;
    background: #eef7f1;
    border-radius: 10px;
    padding: 1px 8px;
  }
  .ch-empty { color: #8a9990; font-size: 12px; margin: 0; }
  .ch-table { margin-top: 4px; }
  .ch-orig { color: #b45309; text-decoration: line-through; }
  .ch-upd { color: #15693c; font-weight: 700; }
  .ch-arrow { color: #8a9990; }
  .ch-role { color: #6b7a72; font-size: 11px; }
  .ch-category { color: #15693c; font-weight: 600; font-size: 12px; }
}

/* Per-category session multiplier bar (preview) */
.act-multiplier {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 8px 2px 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f6f9ff;
  border: 1px solid #d6e0f5;

  .mp-left { display: flex; align-items: center; gap: 6px; }
  .mp-title { color: #3b4a6b; font-size: 12px; font-weight: 600; }
  .mp-badge {
    font-size: 11px;
    color: #3b4a6b;
    background: #e6edfb;
    border-radius: 10px;
    padding: 1px 8px;
  }
  .mp-mid { flex: 1 1 260px; font-size: 12px; color: #6b7a72; }
  .mp-arrow { margin: 0 6px; color: #8a9990; }
  .mp-total { color: #15693c; }
  .mp-hint { color: #8a9990; }
  .mp-right { margin-left: auto; }
}

/* Per-category footer holding the Save button */
.act-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

/* Shared pill button styling for the multiplier + save controls */
.pill-btn {
  border-radius: 16px !important;
  border: 1px solid #cfd8d2 !important;
  height: 28px;
  padding: 0 14px;
  font-size: 12px;
}
.mp-btn.applied {
  background: #eafaf0 !important;
  border-color: #9ad8b4 !important;
  color: #15693c !important;
}
.save-btn.is-dirty {
  background: #15693c !important;
  border-color: #15693c !important;
  color: #fff !important;
}

/* Pre-approval edit-mode hint */
.nbr-edit-banner {
  margin: 12px 0 0;
  padding: 8px 14px;
  border-radius: 8px;
  background: #fff8e6;
  border: 1px solid #f0d48a;
  color: #8a6100;
  font-size: 12px;
}

.grand-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #15693c 0%, #1f8b53 100%);
  color: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  margin-top: 14px;
  font-size: 15px;
  letter-spacing: 0.5px;
  strong { font-size: 18px; font-weight: 800; }
}

/* DNMP Accountant review strip */
.dnmp-review-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #9ad8b4;
  border-left: 4px solid #15693c;
  border-radius: 10px;
  padding: 10px 16px;
  margin-top: 14px;
  font-size: 12px;
  color: #2f3a35;
  strong { color: #15693c; font-weight: 700; }
  .dnmp-notes { color: #6b7a72; font-style: italic; }
}

.detail-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
  flex-wrap: wrap;
}

/* ───────── Platform pill buttons (Activities / Events theme) ───────── */
:deep(.nbr-action-btn.ant-btn) {
  border-radius: 22px;
  height: 38px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
}
:deep(.nbr-action-btn.ant-btn-primary) {
  background: #2c99ff;
  border-color: #2c99ff;
  color: #fff;
  &:hover:not([disabled]) {
    background: #1a86ec;
    border-color: #1a86ec;
  }
}
:deep(.nbr-action-btn.ant-btn-success) {
  background: #16a34a;
  border-color: #16a34a;
  color: #fff;
  &:hover:not([disabled]) {
    background: #15803d;
    border-color: #15803d;
  }
}
:deep(.nbr-action-btn.ant-btn-warning) {
  background: #fa8b0c;
  border-color: #fa8b0c;
  color: #fff;
  &:hover:not([disabled]) {
    background: #f07b00;
    border-color: #f07b00;
  }
}
:deep(.nbr-action-btn.ant-btn-light) {
  background: #fff;
  border-color: #d9e0e4;
  color: #2f6746;
  &:hover:not([disabled]) {
    background: #f4fbf7;
    border-color: #9ad8b4;
  }
}
.dc-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding: 1px 8px;
  border-radius: 10px;
  background: #fdeee7;
  color: #b3402a;
  font-size: 10px;
  font-weight: 600;
  align-self: flex-start;
}
/* The SEPARATE Special Area Cost budget row inside a sub-county card. */
.dc-sac-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #fffaf3;
  border: 1px dashed #f0dcbe;
  cursor: pointer;
}
.dc-sac-row:hover {
  background: #fdf3e3;
}
.dc-sac-label {
  font-size: 11px;
  font-weight: 700;
  color: #8a4d1f;
}
.dc-sac-stage {
  margin: 0;
  font-size: 10px;
  border-radius: 10px;
  background: #f1e3cc;
  color: #8a5a2b;
  border: none;
}
/* ───────── Stage pipeline visuals ───────── */

/* At-a-glance bucket strip (Level 1) */
.stage-summary {
  background: #fff;
  border: 1px solid #e6efe9;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 18px;
  box-shadow: 0 2px 10px rgba(21, 105, 60, 0.05);
}
.ss-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #2f3a35;
  margin-bottom: 12px;
}
.ss-icon { color: #15693c; }
.ss-track { display: flex; gap: 8px; overflow-x: auto; }
.ss-bucket {
  flex: 1 1 0;
  min-width: 160px;
  border: 1px solid #e9edf2;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fafbfc;
}
.ss-bucket.is-empty { opacity: 0.5; }
.ss-bucket.is-mine {
  border-color: #2C99FF;
  background: #f2f9ff;
  box-shadow: 0 0 0 3px rgba(44, 153, 255, 0.1);
}
.ss-bucket.is-editable {
  border-color: #f0bb5a;
  background: #fffaf0;
}
.ss-you--editable { color: #8a6100; background: #fdf1d6; }
.ss-step {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #2f3a35;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.ss-bucket.is-mine .ss-step { color: #2C99FF; }
.ss-step-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #eef1f5;
  color: #6b7a86;
  font-size: 10px;
  font-weight: 800;
  flex: 0 0 auto;
}
.ss-bucket.is-mine .ss-step-no { background: #eaf5ff; color: #2C99FF; }

/* Per-stage split: how many STANDARD vs SAC budgets sit in this stage. */
.ss-split {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 8px;
}
.ss-type {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #6b7a86;
  white-space: nowrap;
}
.ss-type b { color: #272B41; font-weight: 800; font-size: 13px; }
.ss-bucket.is-empty .ss-type b { color: #b6bdc7; }
.ss-you {
  margin-top: 6px;
  display: inline-block;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #2C99FF;
  background: #eaf5ff;
  border-radius: 6px;
  padding: 1px 6px;
}

/* Header legend — pipeline totals per budget type. */
.ss-heading { flex: 1 1 auto; }
.ss-legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.ss-key {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7a86;
  background: #f6f8fa;
  border: 1px solid #e9edf2;
  border-radius: 12px;
  padding: 1px 8px;
  white-space: nowrap;
}
.ss-key b { color: #272B41; font-weight: 800; }

/* Type colour dot — green = Standard, brown = SAC (matches the SAC cards). */
.ss-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex: 0 0 auto;
}
.ss-key--std .ss-dot,
.ss-type--std .ss-dot { background: #15693c; }
.ss-key--sac .ss-dot,
.ss-type--sac .ss-dot { background: #8a4d1f; }

/* Pipeline inside a grid tile */
.dc-pipeline {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed #eef1f5;
}

/* Detail-level pipeline */
.detail-stage-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.detail-stage-hint { font-size: 11px; color: #9299b8; }
.detail-pipeline {
  background: #fff;
  border: 1px solid #e6efe9;
  border-radius: 12px;
  padding: 14px 18px;
  margin: 12px 0 18px;
  box-shadow: 0 2px 10px rgba(21, 105, 60, 0.05);
}
</style>
