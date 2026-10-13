import axios from '@/Axiosconfig';

/**
 * Special Area Cost (SAC) configuration.
 *
 * The catalogue is now admin-managed in the backend
 * (`special_area_cost_items`) and served by `get_special_area_cost_items`.
 * The National Accountant / Super Admin add or remove items and decide, per
 * item, whether its units are:
 *   • 'default' — a fixed number of units (default_units) applied
 *                 automatically and read-only in the budgeting grid, or
 *   • 'dynamic' — entered by the budgeting officer on each row.
 *
 * `SAC_ITEMS` below is the built-in FALLBACK, used only when the catalogue
 * request fails (offline / not migrated). It mirrors the backend seeder
 * `SpecialAreaCostItemSeeder` so the grid never renders empty.
 *
 * Shape consumed by the grid (see SpecialAreaCostsSection.vue):
 *   type            slug stored as `special_type`
 *   label           display name
 *   default_amount  pre-filled amount (null = officer-entered)
 *   max_amount      hard ceiling
 *   locked          true = the amount is fixed and cannot be edited
 *   units_mode      'default' | 'dynamic'
 *   default_units   unit count used when units_mode = 'default'
 *   min_units       lower bound for officer-entered units (dynamic)
 *   max_units       upper bound for officer-entered units (dynamic)
 */

/**
 * Fallback units bounds, used only when an item carries none (i.e. before the
 * catalogue has been migrated / seeded). Mirrors
 * App\Models\SpecialAreaCostItem::DEFAULT_MIN_UNITS / DEFAULT_MAX_UNITS.
 */
export const SAC_DEFAULT_MIN_UNITS = 0;
export const SAC_DEFAULT_MAX_UNITS = 20;

/**
 * Lower / upper bounds for a SAC item's officer-entered units.
 *
 * Both are configured per Cost Item in the admin UI (Special Area Costs →
 * Cost Items) and served on the item as `min_units` / `max_units`. When absent
 * (legacy / offline fallback) they default to 0 and 20.
 */
export const sacMinUnits = (item) =>
  Number(item?.min_units ?? SAC_DEFAULT_MIN_UNITS);

export const sacMaxUnits = (item) =>
  Number(item?.max_units ?? SAC_DEFAULT_MAX_UNITS);

export const SAC_ITEMS = [
  { type: 'enhanced_transport', label: 'Enhanced Transport', default_amount: null, max_amount: 10000, locked: false, units_mode: 'dynamic', default_units: 0, min_units: 0, max_units: 100, sort_order: 1 },
  { type: 'security', label: 'Security', default_amount: 2500, max_amount: 10000, locked: true, units_mode: 'dynamic', default_units: 0, min_units: 0, max_units: 20, sort_order: 2 },
  { type: 'dsa', label: 'DSA', default_amount: 14000, max_amount: 15000, locked: true, units_mode: 'dynamic', default_units: 0, min_units: 0, max_units: 20, sort_order: 3 },
  { type: 'boat_hire', label: 'Boat', default_amount: null, max_amount: 10000, locked: false, units_mode: 'dynamic', default_units: 0, min_units: 0, max_units: 20, sort_order: 4 },
];

/** Maps a special_type enum value → display label (built-in fallback only). */
export const SAC_TYPE_LABEL = Object.fromEntries(
  SAC_ITEMS.map((i) => [i.type, i.label]),
);

/** Returns the fixed fallback item definition for a special_type. */
export const sacItem = (type) => SAC_ITEMS.find((i) => i.type === type) || SAC_ITEMS[0];

/** Normalises one API catalogue row into the grid shape above. */
export const normalizeSacItem = (row) => {
  const type = row?.code || row?.type || '';
  const unitsMode = row?.units_mode === 'default' ? 'default' : 'dynamic';
  const isFixed = Boolean(row?.is_amount_fixed ?? row?.locked);

  return {
    id: row?.id ?? null,
    type,
    code: type,
    label: row?.label || type,
    default_amount:
      row?.default_amount === null || row?.default_amount === undefined
        ? null
        : Number(row.default_amount),
    max_amount: Number(row?.max_amount ?? 10000),
    locked: isFixed,
    is_amount_fixed: isFixed,
    units_mode: unitsMode,
    default_units: Number(row?.default_units || 0),
    // Officer-entered units bounds, configured per Cost Item.
    min_units: Number(row?.min_units ?? SAC_DEFAULT_MIN_UNITS),
    max_units: Number(row?.max_units ?? SAC_DEFAULT_MAX_UNITS),
    sort_order: Number(row?.sort_order || 0),
    is_active: row?.is_active === undefined ? true : Boolean(row.is_active),
  };
};

/**
 * Loads the admin-managed catalogue.
 *
 * Resolves to an ordered array of normalised items, or `[]` on failure so the
 * caller can fall back to `SAC_ITEMS`. Pass `{ includeInactive: true }` from
 * the management screen to also receive removed (deactivated) items.
 */
export const fetchSacItems = async ({ includeInactive = false } = {}) => {
  try {
    const { data } = await axios.get('get_special_area_cost_items', {
      params: includeInactive ? { include_inactive: 1 } : {},
    });

    const payload = data?.data || data || {};
    const rows = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];

    return rows
      .map(normalizeSacItem)
      .filter((i) => i.type)
      .sort((a, b) => {
        const byOrder = (a.sort_order || 0) - (b.sort_order || 0);
        return byOrder !== 0 ? byOrder : a.label.localeCompare(b.label);
      });
  } catch (err) {
    return [];
  }
};

/** The built-in fallback list, cloned so callers never mutate the constant. */
export const fallbackSacItems = () => SAC_ITEMS.map((i) => ({ ...i }));
