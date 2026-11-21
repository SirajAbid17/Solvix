const repairTruncatedJson = (input = "") => {
  if (typeof input !== "string" || !input.trim()) return "";

  const stack = []; 
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{" || ch === "[") {
      stack.push(ch);
    } else if (ch === "}" || ch === "]") {
      stack.pop();
    }
  }

 
  let repaired = input;
  if (inString) {
    
    if (repaired.endsWith("\\")) {
      repaired = repaired.slice(0, -1);
    }
    repaired += '"';
  }

 
  const closing = [];
  for (let i = stack.length - 1; i >= 0; i--) {
    closing.push(stack[i] === "{" ? "}" : "]");
  }
  repaired += closing.join("");

  
  repaired = repaired.replace(/,\s*([}\]])/g, "$1");

 
  repaired = repaired.replace(/:\s*([}\]])/g, ": null$1");

  return repaired;
};


const extractAndParseJson = (cleaned) => {
  
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { parsed, repaired: false };
    }
  } catch (_) {
   
  }

  const startIndex = cleaned.indexOf("{");
  if (startIndex === -1) {
    throw new Error("No JSON object found in Groq response");
  }


  let depth = 0;
  let insideString = false;
  let escaped = false;
  let endIndex = -1;

  for (let i = startIndex; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (insideString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') insideString = false;
      continue;
    }

    if (ch === '"') insideString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }


  if (endIndex !== -1) {
    const candidate = cleaned.slice(startIndex, endIndex + 1);
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return { parsed, repaired: false };
      }
    } catch (_) {
     
    }
  }

  
  const tail = cleaned.slice(startIndex);
  const repaired = repairTruncatedJson(tail);

  try {
    const parsed = JSON.parse(repaired);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      console.warn("Groq JSON was repaired from a truncated response");
      return { parsed, repaired: true };
    }
  } catch (error) {
    console.error("Groq JSON repair failed:", {
      error: error.message,
      repairedPreview: repaired.slice(0, 500),
      repairedTail: repaired.slice(-300),
    });
  }

  throw new Error("Groq returned incomplete JSON");
};


export const parseGroqResponse = (response) => {
  if (typeof response !== "string" || !response.trim()) {
    throw new Error("Groq returned an empty analysis response");
  }

  let cleaned = response.replace(/^\uFEFF/, "").trim();


  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const { parsed } = extractAndParseJson(cleaned);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Groq JSON must be an object");
  }

  return parsed;
};

export const parseGeminiResponse = parseGroqResponse;