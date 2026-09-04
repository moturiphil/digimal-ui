/**
 * Budget ↔ Event/Activity linking — shared confirmation error mapping.
 *
 * The backend (BudgetCapacityService) rejects a participant confirmation against a
 * budget-LINKED event/activity with a standardized payload:
 *
 *   { "success": false, "message": "...", "reason": "ineligible_org_type" | "capacity_reached" }
 *
 * This helper centralizes the human-readable copy so every confirmation screen
 * (event host, activity confirm, etc.) surfaces the same message. See the feature
 * doc's "Confirm errors" table for the source wording.
 */

const DEFAULT_MESSAGE =
  "Participant Registration Failed, Registration Code does not exist";

const REASON_COPY = {
  capacity_reached: "This budget template has no participant slots left.",
  ineligible_org_type: (noun) =>
    `This person's organization type is not allowed for this ${noun}.`,
};

/**
 * Map an axios error (or raw response body) to a user-facing confirmation message.
 *
 * @param {object} error       axios error (error.response.data) OR a raw { message, reason } body
 * @param {string} [noun]      "event" | "activity" | "participant" — used in the ineligible message
 * @returns {string} the message to display
 */
export function confirmErrorMessage(error, noun = "participant") {
  // Support both axios errors and raw response payloads.
  const body = error?.response?.data || error;

  if (!body) return DEFAULT_MESSAGE;

  const reasonCopy = REASON_COPY[body.reason];
  if (typeof reasonCopy === "function") return reasonCopy(noun);
  if (typeof reasonCopy === "string") return reasonCopy;

  // Fall back to the backend's own message when present.
  if (body.message && String(body.message).trim()) return body.message;

  return DEFAULT_MESSAGE;
}

export default confirmErrorMessage;