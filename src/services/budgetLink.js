/**
 * Budget ↔ Event/Activity linking — backend client.
 *
 * Wraps the three endpoints a host needs to link an event/activity to a budget
 * template (a budget category inside an approved campaign budget):
 *
 *   GET   get_campaign_budgets                → approved campaign budgets
 *   GET   get_budget_line_items/{budget_id}   → a budget's categories (line items)
 *   POST  link_event_budget_line_item/{id}    → link an event
 *   PATCH link_activity_budget_line_item/{id} → link an activity
 *
 * See the feature doc for the server-side rules the backend enforces
 * (approved budget, category type match, area match, capacity, no re-link).
 */
import axios from "@/Axiosconfig";

// Mirrors BudgetLineItem::HEADCOUNT_UNIT_DEFINITIONS on the backend. Used to
// determine each category's primary participant-cost line item (the one that
// sets the participant slot cap and per-person charge).
const HEADCOUNT_UNIT_DEFINITIONS = [
  "Per Officer",
  "Per participant",
  "Per person",
  "Per security officer",
  "Per driver",
  "Per facilitator",
  "Per Person Per Day",
];

export const isHeadcountUnit = (unitDefinition) =>
  HEADCOUNT_UNIT_DEFINITIONS.includes(String(unitDefinition || ""));

function budgetLabel(b) {
  const county = b?.county?.name || b?.county_name;
  const sub = b?.sub_county?.name || b?.sub_county_name;
  const area = sub || county || "Budget";
  const fy = b?.financial_year ? ` • ${b.financial_year}` : "";
  const scope = b?.sub_county_id ? "" : " (County)";
  return `${area}${scope}${fy}`;
}

/**
 * Campaign budgets for the current user's jurisdiction, newest budget cycle
 * first. Scoped to the current user's own county / sub-county:
 *   - County-level user (level_id == 2)  → their county budget (county_id)
 *   - Sub-county-level user (level_id == 3) → their sub-county budget (sub_county_id)
 *   - National / super-admin             → all budgets
 *
 * Returns ALL non-voided statuses (draft / submitted / county_approved /
 * approved) so the link picker can surface unapproved budgets as informational
 * (disabled) options — the user should know a budget template exists even if
 * it is not yet approved and therefore cannot be linked.
 */
export async function fetchApprovedBudgets() {
  // Omit the `status` filter so unapproved budgets are returned too; the
  // picker disables / tags them. (Voided budgets are excluded.)
  const params = { page: 1 };

  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"))?.user;
    } catch (e) {
      return null;
    }
  })();
  const levelId = Number(user?.level_id);
  const locationId = user?.location_id;

  if (levelId === 2 && locationId != null) {
    params.county_id = locationId;
  } else if (levelId === 3 && locationId != null) {
    params.sub_county_id = locationId;
  }

  const STATUS_LABELS = {
    approved: "Approved",
    county_approved: "County Approved",
    submitted: "Submitted (unapproved)",
    draft: "Draft (unapproved)",
  };

  const budgets = [];
  let page = 1;
  let lastPage = 1;
  const MAX_PAGES = 12; // cap to avoid hammering the API

  do {
    params.page = page;
    const res = await axios.get("get_campaign_budgets", { params });
    const json = res.data || {};
    const rows = Array.isArray(json.data) ? json.data : [];
    budgets.push(
      ...rows
        .filter((b) => String(b.status) !== "voided")
        .map((b) => {
          const status = String(b.status || "draft");
          return {
            id: b.id,
            county_id: b.county_id,
            sub_county_id: b.sub_county_id,
            county: b.county,
            sub_county: b.sub_county,
            financial_year: b.financial_year,
            grand_total: b.grand_total,
            status,
            is_approved: status === "approved",
            status_label: STATUS_LABELS[status] ?? status,
            label: budgetLabel(b),
          };
        })
    );
    lastPage = json.last_page ?? page;
    if (!rows.length) break;
    page++;
  } while (page <= lastPage && page <= MAX_PAGES);

  return budgets;
}

/**
 * A budget's categories/templates. Each category entry carries the primary
 * headcount line item (planned participant capacity) when one exists.
 *
 * @param {number} budgetId
 * @param {"event"|"activity"} [type] filter categories by their `type`
 */
export async function fetchBudgetCategories(budgetId, type = null) {
  const res = await axios.get(`get_budget_line_items/${budgetId}`);
  const grouped = res.data?.line_items || {};
  const categories = [];

  Object.entries(grouped).forEach(([catKey, items]) => {
    items = items || [];
    if (!items.length) return;

    const cat = items[0]?.budget_category || {};
    if (type && cat.type && cat.type !== type) return;

    const headcountItems = items
      .filter(
        (it) =>
          isHeadcountUnit(it.budget_parameter?.unit_definition) &&
          Number(it.unit_count || 0) > 0
      )
      .sort((a, b) => Number(b.unit_count || 0) - Number(a.unit_count || 0));

    const primary = headcountItems[0] || null;

    categories.push({
      category_id: Number(catKey),
      name: cat.name || `Category ${catKey}`,
      type: cat.type,
      stage: cat.stage,
      scope: cat.scope,
      planned_capacity: primary ? Number(primary.unit_count) : null,
      headcount_item: primary
        ? {
            id: primary.id,
            label: primary.label,
            unit_count: Number(primary.unit_count),
          }
        : null,
      item_count: items.length,
      total_cost: items.reduce(
        (sum, it) => sum + Number(it.total_cost || 0),
        0
      ),
    });
  });

  categories.sort((a, b) => {
    if (String(a.stage) !== String(b.stage)) {
      return String(a.stage).localeCompare(String(b.stage));
    }
    return String(a.name).localeCompare(String(b.name));
  });

  return categories;
}

/**
 * Link an event/activity to a budget template (category).
 */
export async function linkTarget(type, id, campaignBudgetId, categoryId) {
  const isActivity = type === "activity";
  const url = isActivity
    ? `link_activity_budget_line_item/${id}`
    : `link_event_budget_line_item/${id}`;
  const res = await axios[isActivity ? "patch" : "post"](url, {
    campaign_budget_id: campaignBudgetId,
    budget_category_id: categoryId,
  });
  return res.data;
}

/**
 * Fetch a single budget category's line items (parameters applicable to an
 * event/activity linked to that template). Mirrors the backend response of
 * GET /get_budget_line_items/{budget_id}?category_id={category_id}.
 *
 * @returns {object} { meta, budget_id, grand_total, headcount_actual_total,
 *                      non_headcount_actual_total, total_actual_spend, items }
 */
/**
 * Fetch a single budget category's line items (parameters applicable to an
 * event/activity linked to that template). The API groups items by
 * `budget_category_id`, so we resolve the requested category's group by
 * matching BOTH the group key AND each item's direct `budget_category_id`
 * column (robust to key/relation shape differences).
 *
 * @returns {object} { meta, items }
 *   meta.budget_id        – the campaign budget id
 *   meta.grand_total      – the WHOLE budget grand total (not category scoped)
 *   meta.category_total   – the linked category's own planned total (allocated
 *                           to this budget template)
 *   meta.total_actual_spend – budget-wide actual spend (not category scoped)
 */
export async function fetchCategoryLineItems(budgetId, categoryId) {
  const res = await axios.get(`get_budget_line_items/${budgetId}`);
  const json = res.data || {};
  const grouped = json.line_items || {};

  const catId = Number(categoryId);

  // Handle both shapes:
  //  - object keyed by category id: { "45": [ ... ] }
  //  - flat array of line items:    [ { ... }, { ... } ]
  let allGroups;
  if (Array.isArray(grouped)) {
    allGroups = [{ items: grouped }];
  } else {
    allGroups = Object.values(grouped).map((arr) => ({ items: Array.isArray(arr) ? arr : [] }));
  }

  const matches = allGroups.flatMap((g) =>
    g.items.filter(
      (it) =>
        Number(it?.budget_category_id) === catId ||
        Number(it?.budget_category?.id) === catId ||
        (Array.isArray(grouped) && g === allGroups[0]) // flat array → all belong to the one budget (no category filter available)
    )
  );

  // De-duplicate by line-item id (a flat-array fallback could double-include).
  const seen = new Set();
  const items = matches.filter((it) => {
    if (!it?.id || seen.has(it.id)) return false;
    seen.add(it.id);
    return true;
  });

  // Category-scoped planned total = sum of this category's line items
  // (override_value ?? total_cost). This is the "allocated budget" for the
  // event/activity linked to this template.
  const categoryTotal = items.reduce(
    (sum, it) => sum + Number(it?.override_value ?? it?.total_cost ?? 0),
    0
  );

  return {
    meta: {
      budget_id: json.budget_id ?? budgetId,
      grand_total: json.grand_total ?? null,
      category_total: categoryTotal,
      headcount_actual_total: json.headcount_actual_total ?? null,
      non_headcount_actual_total: json.non_headcount_actual_total ?? null,
      total_actual_spend: json.total_actual_spend ?? null,
    },
    items,
  };
}

export default {
  isHeadcountUnit,
  fetchApprovedBudgets,
  fetchBudgetCategories,
  fetchCategoryLineItems,
  linkTarget,
};