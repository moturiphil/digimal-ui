/**
 * Special Area Cost (SAC) configuration — single source of truth for the four
 * fixed SAC cost items shown under every budget category in the County /
 * Sub-County budgeting workflow.
 *
 * Mirrors the backend rules in `BudgetCalculationService`:
 *   - max_amount   per-type amount cap (non-negative, required)
 *   - default_amount  pre-filled amount
 *   - locked       when true the amount is FIXED and cannot be edited
 *                  (Security = 2,500, DSA = 14,000); null default + locked
 *                  false means the amount is user-entered.
 *
 * The DSA default (14,000) exceeds the standard 10,000 cap, so DSA's cap is
 * raised to 15,000 — its default stays valid and unchanged.
 */
export const SAC_ITEMS = [
  { type: 'enhanced_transport', label: 'Enhanced Transport', default_amount: null, max_amount: 10000, locked: false },
  { type: 'security', label: 'Security', default_amount: 2500, max_amount: 10000, locked: true },
  { type: 'dsa', label: 'DSA', default_amount: 14000, max_amount: 15000, locked: true },
  { type: 'boat_hire', label: 'Boat', default_amount: null, max_amount: 10000, locked: false },
];

/** Maps a special_type enum value → display label. */
export const SAC_TYPE_LABEL = Object.fromEntries(
  SAC_ITEMS.map((i) => [i.type, i.label]),
);

/** Returns the fixed item definition for a special_type. */
export const sacItem = (type) => SAC_ITEMS.find((i) => i.type === type) || SAC_ITEMS[0];