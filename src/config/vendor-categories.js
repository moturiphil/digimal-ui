/**
 * Vendor categories.
 *
 * Mirrors `App\Models\Vendor::CATEGORIES` on the API. RFQ vendors are always
 * registered as `private`; every other category is only offered when the
 * vendor is registered through Direct procurement.
 */

export const VENDOR_CATEGORIES = Object.freeze({
  PRIVATE: 'private',
  PUBLIC: 'public',
  FBO: 'fbo',
  CBO: 'cbo',
  NGO: 'ngo',
});

/** Every category, with the label shown in filters and selects. */
export const VENDOR_CATEGORY_OPTIONS = Object.freeze([
  { value: VENDOR_CATEGORIES.PRIVATE, label: 'Private' },
  { value: VENDOR_CATEGORIES.PUBLIC, label: 'Public Institute' },
  { value: VENDOR_CATEGORIES.FBO, label: 'Faith-Based Organization (FBO)' },
  { value: VENDOR_CATEGORIES.CBO, label: 'Community-Based Organization (CBO)' },
  { value: VENDOR_CATEGORIES.NGO, label: 'Non-Governmental Organization (NGO)' },
]);

/** Categories selectable for Direct procurement (RFQ → private). */
export const DIRECT_VENDOR_CATEGORY_OPTIONS = Object.freeze(
  VENDOR_CATEGORY_OPTIONS.filter(
    (option) => option.value !== VENDOR_CATEGORIES.PRIVATE,
  ),
);

const SHORT_LABELS = Object.freeze({
  [VENDOR_CATEGORIES.PRIVATE]: 'Private',
  [VENDOR_CATEGORIES.PUBLIC]: 'Public',
  [VENDOR_CATEGORIES.FBO]: 'FBO',
  [VENDOR_CATEGORIES.CBO]: 'CBO',
  [VENDOR_CATEGORIES.NGO]: 'NGO',
});

/** Colour modifier applied to `.v-chip` category badges. */
const CHIP_CLASSES = Object.freeze({
  [VENDOR_CATEGORIES.PUBLIC]: 'purple',
  [VENDOR_CATEGORIES.FBO]: 'teal',
  [VENDOR_CATEGORIES.CBO]: 'amber',
  [VENDOR_CATEGORIES.NGO]: 'rose',
});

/** Full label, e.g. "Faith-Based Organization (FBO)". */
export const vendorCategoryLabel = (category) =>
  VENDOR_CATEGORY_OPTIONS.find((option) => option.value === category)?.label
  || (category ? String(category).toUpperCase() : '—');

/** Compact label for table/card badges, e.g. "FBO". */
export const vendorCategoryShortLabel = (category) =>
  SHORT_LABELS[category] || (category ? String(category).toUpperCase() : '—');

/** Extra class for the VendorsList category badge. */
export const vendorCategoryChipClass = (category) => CHIP_CLASSES[category] || '';
