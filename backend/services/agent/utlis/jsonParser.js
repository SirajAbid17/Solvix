export const safeParseJSON = (text) => {
  if (!text) return null;

  let cleaned = String(text)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();


  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart !== -1 && objEnd > objStart) {
    try {
      return JSON.parse(cleaned.substring(objStart, objEnd + 1));
    } catch (e) {}
  }

  const arrStart = cleaned.indexOf("[");
  const arrEnd = cleaned.lastIndexOf("]");
  if (arrStart !== -1 && arrEnd > arrStart) {
    try {
      return JSON.parse(cleaned.substring(arrStart, arrEnd + 1));
    } catch (e) {}
  }

  
  try {
    const fixed = cleaned
      .replace(/,(\s*[}\]])/g, "$1")  
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":'); 
    return JSON.parse(fixed);
  } catch (e) {}

  console.warn(" safeParseJSON failed for text:", cleaned.slice(0, 200));
  return null;
};