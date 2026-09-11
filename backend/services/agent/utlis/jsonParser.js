// backend/services/agent/utlis/jsonParser.js

export const safeParseJSON = (text) => {
  if (!text) return null;

  let cleaned = String(text)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // Try 1: direct parse
  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  // Try 2: extract first {...}
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart !== -1 && objEnd > objStart) {
    try {
      return JSON.parse(cleaned.substring(objStart, objEnd + 1));
    } catch (e) {}
  }

  // Try 3: extract first [...]
  const arrStart = cleaned.indexOf("[");
  const arrEnd = cleaned.lastIndexOf("]");
  if (arrStart !== -1 && arrEnd > arrStart) {
    try {
      return JSON.parse(cleaned.substring(arrStart, arrEnd + 1));
    } catch (e) {}
  }

  // Try 4: fix trailing commas + retry
  try {
    const fixed = cleaned
      .replace(/,(\s*[}\]])/g, "$1")  // remove trailing commas
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":'); // quote bare keys
    return JSON.parse(fixed);
  } catch (e) {}

  console.warn("⚠️ safeParseJSON failed for text:", cleaned.slice(0, 200));
  return null;
};