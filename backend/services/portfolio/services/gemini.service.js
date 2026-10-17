
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { portfolioAnalysisPrompt } from "./prompt.service.js";

const MODEL = "gemini-3.8-flash";

const getModel = (temperature = 0.15) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: MODEL,
    temperature,
    maxRetries: 2,
  });
};

const getResponseText = (response) => {
  if (!response) throw new Error("Empty Gemini response");

  if (typeof response.content === "string") return response.content;

  if (Array.isArray(response.content)) {
    return response.content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.text) return item.text;
        return "";
      })
      .join("");
  }

  if (response.content) return String(response.content);

  return JSON.stringify(response);
};

const removeCodeFences = (value = "") => {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/^```(?:html|css|javascript|js|json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const cleanHTML = (code = "") => {
  if (typeof code !== "string") return "";

  let html = removeCodeFences(code);

  html = html
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style\b[^>]*>/gi, "");
  html = html.replace(/<\/style>/gi, "");
  html = html.replace(/<script\b[^>]*>/gi, "");
  html = html.replace(/<\/script>/gi, "");

  return html.trim();
};

const cleanCSS = (code = "") => {
  if (typeof code !== "string") return "";

  let css = removeCodeFences(code);

  css = css
    .replace(/^```css\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  css = css.replace(/<style\b[^>]*>/gi, "");
  css = css.replace(/<\/style>/gi, "");

  return css.trim();
};

const cleanJavaScript = (code = "") => {
  if (typeof code !== "string") return "";

  let js = removeCodeFences(code);

  js = js
    .replace(/^```javascript\s*/i, "")
    .replace(/^```js\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  js = js.replace(/<script\b[^>]*>/gi, "");
  js = js.replace(/<\/script>/gi, "");

  return js.trim();
};


const extractBetweenMarkers = (text, startMarker, endMarker) => {
  if (!text || typeof text !== "string") return "";

  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return "";

  const contentStart = startIndex + startMarker.length;
  const endIndex = text.indexOf(endMarker, contentStart);
  if (endIndex === -1) return "";

  return text.substring(contentStart, endIndex).trim();
};


const parsePortfolioCodeFromMarkers = (responseText) => {
  if (!responseText || typeof responseText !== "string") {
    throw new Error("Empty Gemini response");
  }

  let text = responseText.trim();

  text = text
    .replace(/^```(?:xml|html|json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let html = extractBetweenMarkers(
    text,
    "===HTML_START===",
    "===HTML_END==="
  );


  let css = extractBetweenMarkers(
    text,
    "===CSS_START===",
    "===CSS_END==="
  );

 
  let js = extractBetweenMarkers(
    text,
    "===JS_START===",
    "===JS_END==="
  );

 
 
  if (!html && !css && !js) {
    console.log("Markers not found, trying fallback extraction...");

   
    const htmlMatch = text.match(/```html\s*([\s\S]*?)```/i);
    if (htmlMatch) html = htmlMatch[1].trim();

    const cssMatch = text.match(/```css\s*([\s\S]*?)```/i);
    if (cssMatch) css = cssMatch[1].trim();

    const jsMatch = text.match(/```(?:javascript|js)\s*([\s\S]*?)```/i);
    if (jsMatch) js = jsMatch[1].trim();
  }


  html = cleanHTML(html);
  css = cleanCSS(css);
  js = cleanJavaScript(js);


  if (!html || html.length < 50) {
    console.error(" HTML preview:", html.substring(0, 500));
    throw new Error(
      "Failed to extract valid HTML from Gemini response"
    );
  }

  if (!css || css.length < 20) {
    console.error(" CSS preview:", css.substring(0, 500));
    throw new Error(
      "Failed to extract valid CSS from Gemini response"
    );
  }

  if (!js || js.length < 20) {
    console.warn(" JS seems empty, using minimal fallback");
    js = js || "// No JavaScript provided";
  }

  return { html, css, js };
};

const validatePortfolioCode = (data) => {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new Error("Portfolio code response must be a JSON object");
  }

  const requiredFields = ["html", "css", "js"];

  for (const field of requiredFields) {
    if (typeof data[field] !== "string") {
      throw new Error(
        `Portfolio code field "${field}" must be a string`
      );
    }
  }

  return true;
};

const validateHTML = (html) => {
  if (!html || typeof html !== "string" || !html.trim()) {
    throw new Error("Generated HTML is empty");
  }

  if (/<script\b/i.test(html)) {
    throw new Error("Generated HTML still contains script tag");
  }

  if (/<style\b/i.test(html)) {
    throw new Error("Generated HTML still contains style tag");
  }

  return true;
};

const validateCSS = (css) => {
  if (!css || typeof css !== "string" || !css.trim()) {
    throw new Error("Generated CSS is empty");
  }

  if (/<style\b/i.test(css)) {
    throw new Error("Generated CSS contains style tag");
  }

  if (/<script\b/i.test(css)) {
    throw new Error("Generated CSS contains script tag");
  }

  return true;
};

const validateJavaScript = (js) => {
  if (!js || typeof js !== "string" || !js.trim()) {
    throw new Error("Generated JavaScript is empty");
  }

  if (/<script\b/i.test(js)) {
    throw new Error("Generated JavaScript contains script tag");
  }

  return true;
};


export const analyzeChunk = async (chunk) => {
  try {
    if (!chunk || typeof chunk !== "string") {
      throw new Error("Portfolio chunk must be a non-empty string");
    }

    const model = getModel(0.1);
    const prompt = portfolioAnalysisPrompt(chunk);

    const response = await model.invoke(prompt);

    return getResponseText(response);
  } catch (error) {
    console.error("Portfolio Analysis Error:", error);
    throw new Error(`Portfolio analysis failed: ${error.message}`);
  }
};


const portfolioCodePrompt = (portfolioData) => `
You are a Senior Frontend Engineer and Premium UI/UX Designer.

Generate a complete professional personal portfolio website.

PORTFOLIO DATA:
${JSON.stringify(portfolioData, null, 2)}

============================================================
TECHNOLOGY REQUIREMENTS
============================================================

Use ONLY:
- HTML5
- CSS3
- Vanilla JavaScript

DO NOT USE: React, Next.js, Vue, Angular, Tailwind, Bootstrap, jQuery, TypeScript

============================================================
OUTPUT FORMAT (VERY IMPORTANT)
============================================================

Return EXACTLY THREE sections separated by these exact markers:

===HTML_START===
(your complete HTML markup here)
===HTML_END===

===CSS_START===
(your complete CSS code here)
===CSS_END===

===JS_START===
(your complete JavaScript code here)
===JS_END===

============================================================
CRITICAL RULES
============================================================

1. Use ONLY the three markers shown above — nothing else.
2. Do NOT wrap code in markdown fences (\`\`\`).
3. Do NOT add explanations, comments, or extra text outside markers.
4. HTML section: ONLY HTML markup (no <style>, no <script> tags).
5. CSS section: ONLY CSS (no <style> tags, no HTML).
6. JS section: ONLY browser JavaScript (no <script> tags).
7. The markers must appear EXACTLY as written above.
8. Do NOT escape quotes — write raw HTML/CSS/JS.
9. Do NOT use "\\n" or any escape sequences — write actual newlines.
10. Write complete, working, production-quality code.

============================================================
HTML REQUIREMENTS
============================================================

Semantic HTML5 with these sections (when data exists):
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

Premium modern design:
- CSS variables (--primary, --secondary, --accent, etc.)
- Responsive desktop, tablet, mobile layouts
- Smooth transitions and hover effects
- Professional typography
- Modern project cards
- Responsive navigation
- Hero section styling
- Timeline for experience
- Skill cards
- Project grid
- Contact section
- Footer
- Glassmorphism where appropriate
- Subtle gradients

Use the design recommendation from the portfolio data.

============================================================
JAVASCRIPT REQUIREMENTS
============================================================

Browser JavaScript (vanilla):
- Mobile navigation toggle
- Smooth scrolling
- Active navigation state
- Scroll reveal animations
- Project interactions
- Contact form handling
- Button interactions
- Accessible keyboard interactions

DO NOT use: import, export, require, npm packages, React, TypeScript.

============================================================
DESIGN REQUIREMENTS
============================================================

Premium developer portfolio:
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

============================================================
FINAL REMINDER
============================================================

Output format (exact):
===HTML_START===
<!DOCTYPE html>
<html>
...
</html>
===HTML_END===

===CSS_START===
:root { --primary: ...; }
...
===CSS_END===

===JS_START===
document.addEventListener('DOMContentLoaded', () => {
  ...
});
===JS_END===

Return ONLY these three marker sections. No markdown. No explanations.
`;


const parsePortfolioCode = (responseText) => {
  const parsed = parsePortfolioCodeFromMarkers(responseText);

  validatePortfolioCode(parsed);
  validateHTML(parsed.html);
  validateCSS(parsed.css);
  validateJavaScript(parsed.js);

  return parsed;
};


export const generatePortfolioCode = async (portfolioData) => {
  try {
    if (!portfolioData || typeof portfolioData !== "object") {
      throw new Error("Portfolio data is required");
    }

    const model = getModel(0.2);
    const prompt = portfolioCodePrompt(portfolioData);

   
    const response = await model.invoke(prompt);
    const responseText = getResponseText(response);

    console.log("Gemini response length:", responseText.length);

    if (!responseText.trim()) {
      throw new Error("Gemini returned an empty portfolio code response");
    }

    
    console.log(
      "Response preview (first 500):",
      responseText.substring(0, 500)
    );

    const parsed = parsePortfolioCode(responseText);

    console.log(" Portfolio code generated successfully");
   

    return parsed;
  } catch (error) {
   
    console.error("PORTFOLIO CODE GENERATION ERROR");
   
    console.error(error.message);
    

    throw new Error(
      `Portfolio code generation failed: ${error.message}`
    );
  }
};

export default {
  analyzeChunk,
  generatePortfolioCode,
};