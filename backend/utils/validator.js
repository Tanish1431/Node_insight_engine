/**
 * Validation pipeline for node relationship inputs.
 * Trims whitespace, validates format, detects duplicates.
 */

// Strict format: alphabetic node names separated by "->"
const EDGE_REGEX = /^([A-Za-z]+)\s*->\s*([A-Za-z]+)$/;

/**
 * Validates a single input entry and extracts the edge if valid.
 * @param {string} raw - Raw input string
 * @returns {{ valid: boolean, from?: string, to?: string, reason?: string }}
 */
export function validateEntry(raw) {
  // Trim whitespace from both ends
  const trimmed = (raw ?? '').trim();

  // Reject empty strings
  if (trimmed.length === 0) {
    return { valid: false, reason: 'Empty entry' };
  }

  // Test against the edge format regex
  const match = trimmed.match(EDGE_REGEX);
  if (!match) {
    return { valid: false, reason: 'Invalid format — expected "X->Y"' };
  }

  const [, from, to] = match;

  // Self-loops are invalid
  if (from === to) {
    return { valid: false, reason: `Self-loop detected: ${from}->${to}` };
  }

  return { valid: true, from, to };
}

/**
 * Processes an array of raw input strings through the full validation pipeline.
 * Returns categorized results: valid edges, invalid entries, and duplicates.
 *
 * @param {string[]} data - Array of raw input strings
 * @returns {{
 *   validEdges: Array<[string, string]>,
 *   invalidEntries: Array<string>,
 *   duplicateEdges: Array<string>
 * }}
 */
export function validateAll(data) {
  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];

  // Hash-based duplicate detection using a Set
  const seen = new Set();

  for (const raw of data) {
    const result = validateEntry(raw);

    if (!result.valid) {
      invalidEntries.push(String(raw).trim());
      continue;
    }

    // Build a unique key for duplicate detection
    const edgeKey = `${result.from}->${result.to}`;

    if (seen.has(edgeKey)) {
      duplicateEdges.push(edgeKey);
      continue;
    }

    seen.add(edgeKey);
    validEdges.push([result.from, result.to]);
  }

  return { validEdges, invalidEntries, duplicateEdges };
}
