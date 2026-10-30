/**
 * Labels and small helpers for the M&E module.
 *
 * Mirror the backend enums:
 *   App\Models\MeChecklist::USE_CASES / LEVEL_FLAGS
 *   App\Models\MeChecklistQuestion::ANSWERS
 */

export const ME_USE_CASES = Object.freeze([
  { value: 'stakeholder_meeting', label: 'Stakeholder Meeting' },
  { value: 'training', label: 'Training' },
  { value: 'household_registration', label: 'Household Registration' },
  { value: 'distribution', label: 'Distribution' },
]);

export const ME_LEVELS = Object.freeze([
  { key: 'applies_national', level: 1, label: 'National' },
  { key: 'applies_county', level: 2, label: 'County' },
  { key: 'applies_sub_county', level: 3, label: 'Sub-County' },
]);

export const ME_ANSWERS = Object.freeze([
  { value: 'yes', label: 'Yes', color: 'green' },
  { value: 'no', label: 'No', color: 'red' },
  { value: 'na', label: 'N/A', color: 'default' },
]);

const LEVEL_LABELS = Object.freeze({ 1: 'National', 2: 'County', 3: 'Sub-County' });

export const useCaseLabel = (value) =>
  (ME_USE_CASES.find((item) => item.value === value) || {}).label || value || '—';

export const levelLabel = (levelId) => LEVEL_LABELS[Number(levelId)] || `Level ${levelId}`;

/** Enabled level ids of a checklist (`{ applies_national, ... }`). */
export const enabledLevels = (checklist) =>
  ME_LEVELS.filter((level) => Boolean(checklist?.[level.key])).map((level) => level.level);

/** Answer tally used by the submission summaries. */
export const answerCounts = (answers = []) =>
  (Array.isArray(answers) ? answers : []).reduce(
    (counts, answer) => {
      if (counts[answer.answer] !== undefined) counts[answer.answer] += 1;
      counts.total += 1;
      return counts;
    },
    { yes: 0, no: 0, na: 0, total: 0 },
  );

/** "3 Yes · 1 No" style summary for tables. */
export const answerSummary = (answers = []) => {
  const counts = answerCounts(answers);
  const parts = [];
  if (counts.yes) parts.push(`${counts.yes} Yes`);
  if (counts.no) parts.push(`${counts.no} No`);
  if (counts.na) parts.push(`${counts.na} N/A`);
  return parts.length ? parts.join(' · ') : `${counts.total} answered`;
};

/** Human-readable percentages; null means "nothing expected". */
export const percentLabel = (value) =>
  value === null || value === undefined ? '—' : `${value}%`;
