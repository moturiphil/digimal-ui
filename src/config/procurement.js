/**
 * Procurement upload limits.
 *
 * Keep in sync with DigiMalBackend/config/procurement.php — the API rejects
 * anything above these limits, so the UI must not offer a bigger file.
 */

/** Maximum size of a scanned LSO / LPO document, in megabytes. */
export const LSO_MAX_FILE_MB = 10;

/** Same limit expressed in bytes, for `File.size` comparisons. */
export const LSO_MAX_FILE_BYTES = LSO_MAX_FILE_MB * 1024 * 1024;

/** MIME types accepted for LSO/LPO scans and the other procurement documents. */
export const PROCUREMENT_DOCUMENT_MIME_TYPES = Object.freeze([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]);

/** `accept` attribute shared by the procurement upload inputs. */
export const PROCUREMENT_DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png';

/** Hint shown under / next to LSO/LPO upload inputs. */
export const LSO_FILE_HINT = `PDF, JPG, JPEG or PNG · max ${LSO_MAX_FILE_MB} MB`;
