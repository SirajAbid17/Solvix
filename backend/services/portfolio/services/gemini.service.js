import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatOpenAI } from "@langchain/openai";
import { portfolioAnalysisPrompt } from "./prompt.service.js";
import { parseGroqResponse } from "./parser.service.js";


const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";


const ANALYSIS_MAX_TOKENS = 8192;
const CODE_MAX_TOKENS = 32768;
const OPENROUTER_ANALYSIS_MAX_TOKENS = 8192;
const OPENROUTER_CODE_MAX_TOKENS = 16000;


const getGeminiModel = ({
  temperature = 0.15,
  maxTokens = 8192,
  model = GEMINI_MODEL,
} = {}) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY / GOOGLE_API_KEY is missing in .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const gm = genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  return {
    invoke: async (prompt) => {
      const result = await gm.generateContent(prompt);
      const r = result.response;
      const cand = r.candidates?.[0];

      let text = "";
      try {
        text = r.text();
      } catch (_) {
        text = (cand?.content?.parts || []).map((p) => p.text || "").join("");
      }

      return {
        content: text,
        response_metadata: {
          finish_reason: cand?.finishReason || "unknown",
          model_name: model,
        },
        usage_metadata: r.usageMetadata,
      };
    },
  };
};

const getOpenRouterModel = ({ temperature = 0.2, maxTokens = 8192 } = {}) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing in .env");
  }

  return new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    modelName: OPENROUTER_MODEL,
    temperature,
    maxTokens,
    maxRetries: 0,
    
    modelKwargs: { reasoning: { enabled: false, exclude: true } },
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost",
        "X-Title": "Solvix Portfolio Generator",
      },
    },
  });
};

const getResponseText = (response, provider) => {
  if (!response) throw new Error(`${provider} returned an empty response object`);

  const content = response.content;
  let text = "";

  if (typeof content === "string") {
    text = content;
  } else if (Array.isArray(content)) {
    text = content
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item?.text === "string") return item.text;
        return "";
      })
      .join("");
  } else if (content != null) {
    text = String(content);
  }

  text = text.trim();

  if (!text) {
    const err = new Error(
      `${provider} returned empty content. Finish reason: ${
        response.response_metadata?.finish_reason ||
        response.response_metadata?.finishReason ||
        "unknown"
      }`
    );
    err.isEmpty = true;
    throw err;
  }

  return text;
};

const getFinishReason = (response) =>
  String(
    response?.response_metadata?.finish_reason ||
      response?.response_metadata?.finishReason ||
      "unknown"
  );

const isLengthReason = (reason) => /^(length|max_tokens)$/i.test(reason);

const getErrorStatus = (error) => {
  const direct =
    error?.status ||
    error?.response?.status ||
    error?.cause?.status ||
    error?.error?.status;
  if (direct) return Number(direct);

  const m = String(error?.message || "").match(/\b(429|500|502|503|504)\b/);
  return m ? Number(m[1]) : undefined;
};

const extractRetryAfterMs = (error, fallbackMs = 8000) => {
  const headers =
    error?.response?.headers ||
    error?.headers ||
    error?.cause?.headers ||
    error?.error?.headers;

  let retryAfter;
  if (typeof headers?.get === "function") retryAfter = headers.get("retry-after");
  else if (headers) retryAfter = headers["retry-after"] || headers["Retry-After"];

  if (retryAfter != null) {
    const seconds = parseFloat(retryAfter);
    if (!Number.isNaN(seconds) && seconds > 0) {
      return Math.min(seconds * 1000 + Math.random() * 500, 30000);
    }
  }

  const match = String(error?.message || "").match(
    /(?:try again in|retry in|retryDelay"?:?\s*"?)\s*([\d.]+)\s*s/i
  );
  if (match) return Math.min(parseFloat(match[1]) * 1000 + 1000, 30000);

  return fallbackMs;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const removeCodeFences = (value = "") => {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/^```(?:html|css|javascript|js|json|xml)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const extractBetweenMarkers = (text, startMarker, endMarker) => {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return "";

  const contentStart = startIndex + startMarker.length;
  const endIndex = text.indexOf(endMarker, contentStart);
  if (endIndex === -1) return "";

  return text.substring(contentStart, endIndex).trim();
};

const cleanHTML = (code = "") => {
  let html = removeCodeFences(code)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .trim();

 
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (body) html = body[1].trim();

  return html
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<\/?(html|head|body)\b[^>]*>/gi, "")
    .replace(/<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "")
    .trim();
};

const cleanCSS = (code = "") =>
  removeCodeFences(code)
    .replace(/^<style\b[^>]*>/i, "")
    .replace(/<\/style>$/i, "")
    .trim();

const cleanJavaScript = (code = "") =>
  removeCodeFences(code)
    .replace(/^<script\b[^>]*>/i, "")
    .replace(/<\/script>$/i, "")
    .trim();

const parsePortfolioCode = (responseText) => {
  if (!responseText || typeof responseText !== "string") {
    throw new Error("Empty portfolio response");
  }

  const text = responseText.trim();

  let html = extractBetweenMarkers(text, "===HTML_START===", "===HTML_END===");
  let css = extractBetweenMarkers(text, "===CSS_START===", "===CSS_END===");
  let js = extractBetweenMarkers(text, "===JS_START===", "===JS_END===");


  if (!html || !css || !js) {
    const htmlMatch = text.match(/```html\s*([\s\S]*?)```/i);
    const cssMatch = text.match(/```css\s*([\s\S]*?)```/i);
    const jsMatch = text.match(/```(?:javascript|js)\s*([\s\S]*?)```/i);

    if (!html && htmlMatch) html = htmlMatch[1];
    if (!css && cssMatch) css = cssMatch[1];
    if (!js && jsMatch) js = jsMatch[1];
  }

  html = cleanHTML(html);
  css = cleanCSS(css);
  js = cleanJavaScript(js);

  if (!html || html.length < 200) {
    throw new Error("Failed to extract valid HTML from response");
  }
  if (!css || css.length < 200) {
    throw new Error("Failed to extract valid CSS from response");
  }
  if (!js || js.length < 20) {
    console.warn("JavaScript output is empty; using fallback");
    js = "// No JavaScript provided";
  }

  return { html, css, js };
};

const validatePortfolioCode = ({ html, css, js }) => {
  if (!html?.trim()) throw new Error("Generated HTML is empty");
  if (/<script\b/i.test(html) || /<style\b/i.test(html)) {
    throw new Error("Generated HTML contains script or style tags");
  }
  if (!css?.trim()) throw new Error("Generated CSS is empty");
  if (/<style\b|<script\b/i.test(css)) {
    throw new Error("Generated CSS contains HTML tags");
  }
  if (!js?.trim()) throw new Error("Generated JavaScript is empty");
  if (/<script\b/i.test(js)) {
    throw new Error("Generated JavaScript contains script tags");
  }
};


const invokeWithRetry = async ({ provider, getModelFn, prompt, maxAttempts }) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `[${provider}] Request attempt ${attempt}/${maxAttempts}: ${prompt.length} chars`
      );

      const model = getModelFn();
      const response = await model.invoke(prompt);
      const finishReason = getFinishReason(response);

      console.log(`[${provider}] Response meta:`, {
        attempt,
        finishReason,
        usage: response.usage_metadata,
      });

      
      let responseText;
      try {
        responseText = getResponseText(response, provider);
      } catch (e) {
        if (isLengthReason(finishReason)) e.isTruncation = true;
        throw e;
      }

      if (isLengthReason(finishReason)) {
        const e = new Error(`[${provider}] Response truncated (${finishReason})`);
        e.isTruncation = true;
        throw e;
      }

      return responseText;
    } catch (error) {
      lastError = error;
      const status = getErrorStatus(error);
      const retryable =
        [429, 500, 502, 503, 504].includes(status) ||
        error.isTruncation ||
        error.isEmpty;

      console.error(`[${provider}] Attempt ${attempt}/${maxAttempts} failed:`, {
        message: error?.message?.slice(0, 300),
        status,
      });

      if (!retryable || attempt === maxAttempts) {
        if (!retryable) throw error;
        break;
      }

      
      const waitMs = status
        ? extractRetryAfterMs(error, 5000 * 2 ** (attempt - 1))
        : 1500;
      console.warn(`[${provider}] Waiting ${(waitMs / 1000).toFixed(1)}s before retry...`);
      await sleep(waitMs);
    }
  }

  throw new Error(
    `[${provider}] Failed after ${maxAttempts} attempts: ${
      lastError?.message || "Unknown error"
    }`
  );
};

const runWithProviders = async ({ label, prompt, temperature, geminiTokens, openRouterTokens, parse }) => {
  const providers = [
    {
      name: `Gemini(${GEMINI_MODEL})`,
      attempts: 3,
      getModelFn: () =>
        getGeminiModel({ temperature, maxTokens: geminiTokens, model: GEMINI_MODEL }),
    },
    {
      name: `Gemini(${GEMINI_FALLBACK_MODEL})`,
      attempts: 2,
      getModelFn: () =>
        getGeminiModel({
          temperature,
          maxTokens: geminiTokens,
          model: GEMINI_FALLBACK_MODEL,
        }),
    },
    {
      name: `OpenRouter(${OPENROUTER_MODEL})`,
      attempts: 2,
      getModelFn: () => getOpenRouterModel({ temperature, maxTokens: openRouterTokens }),
    },
  ];

  const errors = [];

  for (const p of providers) {
    try {
      const text = await invokeWithRetry({
        provider: p.name,
        getModelFn: p.getModelFn,
        prompt,
        maxAttempts: p.attempts,
      });

      const result = parse(text);
      console.log(`${label} completed using ${p.name}`);
      return result;
    } catch (err) {
      errors.push(`${p.name}: ${err?.message}`);
      console.error(`${label} failed with ${p.name}: ${err?.message}`);
    }
  }

  throw new Error(`All providers failed. ${errors.join(" | ")}`);
};


export const analyzeChunk = async (chunk) => {
  if (!chunk || typeof chunk !== "string" || !chunk.trim()) {
    throw new Error("Portfolio chunk must be a non-empty string");
  }

  const prompt = portfolioAnalysisPrompt(chunk);

  return runWithProviders({
    label: "Portfolio chunk analysis",
    prompt,
    temperature: 0.1,
    geminiTokens: ANALYSIS_MAX_TOKENS,
    openRouterTokens: OPENROUTER_ANALYSIS_MAX_TOKENS,
    parse: (text) => JSON.stringify(parseGroqResponse(text)),
  });
};

const compact = (value) => {
  if (Array.isArray(value)) {
    const arr = value.map(compact).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const c = compact(v);
      if (c !== undefined) out[k] = c;
    }
    return Object.keys(out).length ? out : undefined;
  }
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && !value.trim()) return undefined;
  return value;
};

const portfolioCodePrompt = (portfolioData) => `
You are a senior frontend engineer and award-winning UI/UX designer.

Build a complete, polished, modern, responsive personal portfolio website for the person described in the data below.

PORTFOLIO DATA (JSON):
${JSON.stringify(compact(portfolioData) || {})}

TECHNOLOGY:
- HTML5, CSS3 and vanilla JavaScript only.
- No frameworks, libraries, npm packages, imports, exports or require statements.
- No external JavaScript. CSS may use one Google Fonts @import at the top.
- No external images. For the profile use a styled initials avatar. Use CSS gradients, shapes or inline SVG icons for visuals.

OUTPUT FORMAT (return EXACTLY these three sections, nothing before, between or after):

===HTML_START===
(markup that goes INSIDE the body: header, main, sections, footer. No doctype, html, head, body, style, script or link tags)
===HTML_END===

===CSS_START===
(complete CSS)
===CSS_END===

===JS_START===
(complete browser JavaScript)
===JS_END===

STRICT RULES:
- Do not use Markdown code fences. Do not write explanations.
- Never put CSS or JS inside the HTML. Never put HTML tags inside CSS or JS.
- Use real data from the JSON only. Never invent employers, dates, skills, projects, links, emails or numbers.
- If a data field is missing, skip that item and skip any section that has no data at all (but keep Hero, About, Contact and Footer).
- Keep it compact: HTML under 350 lines, CSS under 600 lines, JS under 150 lines. No placeholders, no TODOs, no lorem ipsum.

SECTIONS (each with a unique id and nav links pointing to them):
Navbar (sticky, glass effect, mobile hamburger), Hero (name, title, tagline, CTA buttons, social links, initials avatar), About, Skills (grouped by category as cards or chips), Experience (vertical timeline), Projects (card grid with technologies), Education, Certifications and Achievements (only if data exists), Contact (mailto/tel links from data plus a validated form), Footer.

DESIGN:
- Follow designRecommendation (colors, theme, font, layout) when present; otherwise choose a modern dark theme with one strong accent.
- CSS variables on :root for colors, spacing, radius, shadows, fonts. Also support prefers-color-scheme fallback only if no theme is given.
- Strong typography hierarchy, generous spacing, subtle gradients, soft shadows, hover and focus micro-interactions, smooth transitions.
- Fully responsive: mobile first, breakpoints around 768px and 1024px, no horizontal scroll.
- Accessible: semantic tags, aria-labels, visible focus styles, sufficient contrast, prefers-reduced-motion respected.

JAVASCRIPT:
- Mobile nav toggle (aria-expanded), close on link click.
- Smooth scrolling and active nav link highlighting via IntersectionObserver.
- Scroll reveal animation for elements with a "reveal" class.
- Contact form validation with inline messages and a success message (no network request).
- Update footer year automatically.
- Wrap in DOMContentLoaded and guard against missing elements.

FINAL CHECK: all three sections complete and closed with their END markers, valid code, nothing else in the reply.
`;

export const generatePortfolioCode = async (portfolioData) => {
  if (!portfolioData || typeof portfolioData !== "object") {
    throw new Error("Portfolio data is required");
  }

  const prompt = portfolioCodePrompt(portfolioData);

  return runWithProviders({
    label: "Portfolio code generation",
    prompt,
    temperature: 0.3,
    geminiTokens: CODE_MAX_TOKENS,
    openRouterTokens: OPENROUTER_CODE_MAX_TOKENS,
    parse: (text) => {
      const parsed = parsePortfolioCode(text);
      validatePortfolioCode(parsed);
      return parsed;
    },
  });
};

export default {
  analyzeChunk,
  generatePortfolioCode,
};