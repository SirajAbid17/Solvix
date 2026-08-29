
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { portfolioAnalysisPrompt } from "./prompt.service.js";



const MODEL = "gemini-3.6-flash";
 
const getModel = (temperature = 0.15) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing in .env"
    );
  }

  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: MODEL,
    temperature,
    maxRetries: 2,
  });
};

// ============================================================
// GET RESPONSE TEXT
// ============================================================

const getResponseText = (response) => {
  if (!response) {
    throw new Error("Empty Gemini response");
  }

  if (typeof response.content === "string") {
    return response.content;
  }

  if (Array.isArray(response.content)) {
    return response.content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item?.text) {
          return item.text;
        }

        return "";
      })
      .join("");
  }

  if (response.content) {
    return String(response.content);
  }

  return JSON.stringify(response);
};

// ============================================================
// REMOVE MARKDOWN CODE FENCES
// ============================================================

const removeCodeFences = (value = "") => {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(
      /^```(?:html|css|javascript|js|json)?\s*/i,
      ""
    )
    .replace(/\s*```$/i, "")
    .trim();
};

// ============================================================
// CLEAN HTML
// ============================================================

const cleanHTML = (code = "") => {
  if (typeof code !== "string") {
    return "";
  }

  let html = removeCodeFences(code);

  // Remove accidental markdown fences
  html = html
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Remove style blocks
  html = html.replace(
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,
    ""
  );

  // Remove script blocks
  html = html.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    ""
  );

  // Remove standalone tags
  html = html.replace(
    /<style\b[^>]*>/gi,
    ""
  );

  html = html.replace(
    /<\/style>/gi,
    ""
  );

  html = html.replace(
    /<script\b[^>]*>/gi,
    ""
  );

  html = html.replace(
    /<\/script>/gi,
    ""
  );

  return html.trim();
};

// ============================================================
// CLEAN CSS
// ============================================================

const cleanCSS = (code = "") => {
  if (typeof code !== "string") {
    return "";
  }

  let css = removeCodeFences(code);

  css = css
    .replace(/^```css\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Remove style tags
  css = css.replace(
    /<style\b[^>]*>/gi,
    ""
  );

  css = css.replace(
    /<\/style>/gi,
    ""
  );

  return css.trim();
};

// ============================================================
// CLEAN JAVASCRIPT
// ============================================================

const cleanJavaScript = (code = "") => {
  if (typeof code !== "string") {
    return "";
  }

  let js = removeCodeFences(code);

  js = js
    .replace(/^```javascript\s*/i, "")
    .replace(/^```js\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Remove accidental script tags
  js = js.replace(
    /<script\b[^>]*>/gi,
    ""
  );

  js = js.replace(
    /<\/script>/gi,
    ""
  );

  return js.trim();
};

// ============================================================
// EXTRACT JSON SAFELY
// ============================================================

const extractJSON = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error(
      "Empty Gemini response"
    );
  }

  let cleaned = text.trim();

  // ----------------------------------------------------------
  // Remove markdown code fences
  // ----------------------------------------------------------

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // ----------------------------------------------------------
  // Find first JSON object
  // ----------------------------------------------------------

  const firstBrace =
    cleaned.indexOf("{");

  if (firstBrace === -1) {
    throw new Error(
      "No JSON object found in Gemini response"
    );
  }

  // ----------------------------------------------------------
  // Find matching closing brace
  // ----------------------------------------------------------

  let depth = 0;
  let inString = false;
  let escaped = false;
  let endIndex = -1;

  for (
    let i = firstBrace;
    i < cleaned.length;
    i++
  ) {
    const char = cleaned[i];

    // Handle escaped character
    if (inString && escaped) {
      escaped = false;
      continue;
    }

    // Backslash inside string
    if (
      inString &&
      char === "\\"
    ) {
      escaped = true;
      continue;
    }

    // Toggle JSON string
    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Ignore braces inside strings
    if (inString) {
      continue;
    }

    if (char === "{") {
      depth++;
    }

    if (char === "}") {
      depth--;

      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error(
      "Could not find complete JSON object in Gemini response"
    );
  }

  cleaned = cleaned.substring(
    firstBrace,
    endIndex + 1
  );

  // ----------------------------------------------------------
  // Parse JSON
  // ----------------------------------------------------------

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "\n===================================="
    );

    console.error(
      "GEMINI JSON PARSE ERROR"
    );

    console.error(
      "===================================="
    );

    console.error(
      "Error:",
      error.message
    );

    console.error(
      "JSON Length:",
      cleaned.length
    );

    // --------------------------------------------------------
    // Try to show exact error position
    // --------------------------------------------------------

    const positionMatch =
      error.message.match(
        /position (\d+)/
      );

    if (positionMatch) {
      const position =
        Number(positionMatch[1]);

      const start =
        Math.max(
          0,
          position - 500
        );

      const end =
        Math.min(
          cleaned.length,
          position + 500
        );

      console.error(
        "\nJSON around error:\n"
      );

      console.error(
        cleaned.substring(
          start,
          end
        )
      );
    } else {
      console.error(
        "\nJSON Preview:\n"
      );

      console.error(
        cleaned.substring(
          0,
          5000
        )
      );
    }

    console.error(
      "\n====================================\n"
    );

    throw new Error(
      `Gemini returned invalid JSON: ${error.message}`
    );
  }
};

// ============================================================
// VALIDATE PORTFOLIO CODE RESPONSE
// ============================================================

const validatePortfolioCode = (
  data
) => {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new Error(
      "Portfolio code response must be a JSON object"
    );
  }

  const requiredFields = [
    "html",
    "css",
    "js",
  ];

  for (
    const field of requiredFields
  ) {
    if (
      typeof data[field] !== "string"
    ) {
      throw new Error(
        `Portfolio code field "${field}" must be a string`
      );
    }
  }

  return true;
};

// ============================================================
// VALIDATE HTML
// ============================================================

const validateHTML = (html) => {
  if (
    !html ||
    typeof html !== "string" ||
    !html.trim()
  ) {
    throw new Error(
      "Generated HTML is empty"
    );
  }

  if (
    /<script\b/i.test(html)
  ) {
    throw new Error(
      "Generated HTML still contains script tag"
    );
  }

  if (
    /<style\b/i.test(html)
  ) {
    throw new Error(
      "Generated HTML still contains style tag"
    );
  }

  const openingSections =
    (
      html.match(
        /<section\b/gi
      ) || []
    ).length;

  const closingSections =
    (
      html.match(
        /<\/section>/gi
      ) || []
    ).length;

  if (
    openingSections !==
    closingSections
  ) {
    console.warn(
      "Warning: section tags may not be balanced"
    );
  }

  return true;
};

// ============================================================
// VALIDATE CSS
// ============================================================

const validateCSS = (css) => {
  if (
    !css ||
    typeof css !== "string" ||
    !css.trim()
  ) {
    throw new Error(
      "Generated CSS is empty"
    );
  }

  if (
    /<style\b/i.test(css)
  ) {
    throw new Error(
      "Generated CSS contains style tag"
    );
  }

  if (
    /<script\b/i.test(css)
  ) {
    throw new Error(
      "Generated CSS contains script tag"
    );
  }

  return true;
};

// ============================================================
// VALIDATE JAVASCRIPT
// ============================================================

const validateJavaScript = (js) => {
  if (
    !js ||
    typeof js !== "string" ||
    !js.trim()
  ) {
    throw new Error(
      "Generated JavaScript is empty"
    );
  }

  if (
    /<script\b/i.test(js)
  ) {
    throw new Error(
      "Generated JavaScript contains script tag"
    );
  }

  return true;
};

// ============================================================
// PORTFOLIO ANALYSIS
// ============================================================

export const analyzeChunk = async (
  chunk
) => {
  try {
    if (
      !chunk ||
      typeof chunk !== "string"
    ) {
      throw new Error(
        "Portfolio chunk must be a non-empty string"
      );
    }

    const model =
      getModel(0.1);

    const prompt =
      portfolioAnalysisPrompt(
        chunk
      );

    const response =
      await model.invoke(
        prompt
      );

    return getResponseText(
      response
    );
  } catch (error) {
    console.error(
      "Portfolio Analysis Error:",
      error
    );

    throw new Error(
      `Portfolio analysis failed: ${error.message}`
    );
  }
};

// ============================================================
// PORTFOLIO CODE GENERATION PROMPT
// ============================================================

const portfolioCodePrompt = (
  portfolioData
) => `
You are a Senior Frontend Engineer and Premium UI/UX Designer.

Generate a complete professional personal portfolio website.

PORTFOLIO DATA:

${JSON.stringify(
  portfolioData,
  null,
  2
)}

============================================================
TECHNOLOGY REQUIREMENTS
============================================================

Use ONLY:

- HTML5
- CSS3
- Vanilla JavaScript

DO NOT USE:

- React
- Next.js
- Vue
- Angular
- Tailwind CSS
- Bootstrap
- jQuery
- TypeScript
- Any frontend framework

============================================================
OUTPUT FORMAT
============================================================

Return ONLY ONE valid JSON object.

The JSON object MUST contain exactly:

{
  "html": "...",
  "css": "...",
  "js": "..."
}

All three values MUST be strings.

============================================================
CRITICAL JSON RULES
============================================================

The response MUST be directly compatible with:

JSON.parse(response)

Rules:

1. html MUST be a JSON string.
2. css MUST be a JSON string.
3. js MUST be a JSON string.
4. Escape every double quote inside html.
5. Escape every double quote inside css.
6. Escape every double quote inside js.
7. Escape backslashes correctly.
8. Escape newline characters correctly.
9. Never use trailing commas.
10. Never use markdown code fences.
11. Never return \`\`\`json.
12. Never add explanation.
13. Never add text before the JSON object.
14. Never add text after the JSON object.
15. Never return an array.
16. Never return multiple JSON objects.
17. The final output MUST successfully pass JSON.parse().

============================================================
HTML REQUIREMENTS
============================================================

HTML markup ONLY.

Do NOT include:

<style>
<script>
markdown
code fences
explanations

Use semantic HTML5.

Include these sections when data exists:

- Navbar
- Hero
- About
- Skills
- Experience
- Education
- Projects
- Certifications
- Achievements
- Services
- Contact
- Footer

Every section must have a unique ID.

Navigation links must point to the correct section IDs.

============================================================
CSS REQUIREMENTS
============================================================

CSS ONLY.

Do NOT include:

<style>
<script>
HTML
markdown
code fences
explanations

Create:

- Premium modern design
- Responsive desktop layout
- Responsive tablet layout
- Responsive mobile layout
- CSS variables
- Smooth transitions
- Hover effects
- Accessible contrast
- Professional typography
- Modern project cards
- Responsive navigation
- Hero section
- Timeline for experience
- Skill cards
- Project grid
- Contact section
- Footer

Use the portfolio design recommendation provided in the data.

============================================================
JAVASCRIPT REQUIREMENTS
============================================================

Browser JavaScript ONLY.

Do NOT include:

<script>
</script>
HTML
CSS
markdown
code fences
explanations

Implement:

- Mobile navigation
- Smooth scrolling
- Active navigation state
- Scroll reveal animations
- Project interactions
- Contact form handling
- Button interactions
- Accessible keyboard interactions
- Safe DOM manipulation

Do NOT use:

- Node.js
- require()
- import
- export
- npm packages
- React
- TypeScript

============================================================
DESIGN REQUIREMENTS
============================================================

Create a premium developer portfolio.

Use:

- Modern dark theme if recommended
- Accent colors from portfolio data
- Glassmorphism where appropriate
- Subtle gradients
- Professional spacing
- Responsive cards
- Clean typography
- Micro-interactions
- Smooth animations
- Strong visual hierarchy

The website must look like a professional developer portfolio rather than a generic template.

============================================================
FINAL REQUIREMENT
============================================================

Return ONLY valid JSON.

No markdown.

No code fences.

No explanation.

No extra properties.

The final response must successfully execute:

JSON.parse(response)
`;

// ============================================================
// PARSE PORTFOLIO CODE
// ============================================================

const parsePortfolioCode = (
  responseText
) => {
  const parsed =
    extractJSON(
      responseText
    );

  validatePortfolioCode(
    parsed
  );

  const html =
    cleanHTML(
      parsed.html
    );

  const css =
    cleanCSS(
      parsed.css
    );

  const js =
    cleanJavaScript(
      parsed.js
    );

  validateHTML(
    html
  );

  validateCSS(
    css
  );

  validateJavaScript(
    js
  );

  return {
    html,
    css,
    js,
  };
};

// ============================================================
// GENERATE PORTFOLIO CODE
// ============================================================

export const generatePortfolioCode =
  async (
    portfolioData
  ) => {
    try {
      if (
        !portfolioData ||
        typeof portfolioData !== "object"
      ) {
        throw new Error(
          "Portfolio data is required"
        );
      }

      const model =
        getModel(0.2);

      const prompt =
        portfolioCodePrompt(
          portfolioData
        );

      console.log(
        "\n===================================="
      );

      console.log(
        "GENERATING PORTFOLIO WEBSITE CODE"
      );

      console.log(
        "===================================="
      );

      const response =
        await model.invoke(
          prompt
        );

      const responseText =
        getResponseText(
          response
        );

      console.log(
        "Gemini response length:",
        responseText.length
      );

      if (
        !responseText.trim()
      ) {
        throw new Error(
          "Gemini returned an empty portfolio code response"
        );
      }

      const parsed =
        parsePortfolioCode(
          responseText
        );

      console.log(
        "Portfolio code generated successfully"
      );

      console.log(
        "HTML length:",
        parsed.html.length
      );

      console.log(
        "CSS length:",
        parsed.css.length
      );

      console.log(
        "JS length:",
        parsed.js.length
      );

      return parsed;
    } catch (error) {
      console.error(
        "\n===================================="
      );

      console.error(
        "PORTFOLIO CODE GENERATION ERROR"
      );

      console.error(
        "===================================="
      );

      console.error(
        error
      );

      console.error(
        "====================================\n"
      );

      throw new Error(
        `Portfolio code generation failed: ${error.message}`
      );
    }
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  analyzeChunk,
  generatePortfolioCode,
};

