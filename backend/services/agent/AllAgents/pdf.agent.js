import { GetModels } from "../config/aimodels.js";
import generatePdf from "../utlis/GeneratePdf.js";
import { uploadToCloudinary } from "../utlis/UploadFile.js";
import { safeParseJSON } from "../utlis/jsonParser.js";

// ============================================
// CLEAN TOPIC (remove "create a", "pdf", etc.)
// ============================================
function cleanTopic(prompt) {
  return String(prompt || "Document")
    .replace(/^create\s+(a\s+)?/i, "")
    .replace(/^make\s+(a\s+)?/i, "")
    .replace(/^generate\s+(a\s+)?/i, "")
    .replace(/\s+pdf$/i, "")
    .replace(/\s+document$/i, "")
    .trim() || "Document";
}

// ============================================
// FALLBACK DOCUMENT (topic-specific)
// ============================================
function createFallbackDocument(prompt) {
  const topic = cleanTopic(prompt);
  const Title = topic.charAt(0).toUpperCase() + topic.slice(1);

  return {
    title: Title,
    subtitle: `A comprehensive guide to ${topic}`,
    sections: [
      {
        heading: `Introduction to ${Title}`,
        content: `${Title} is a subject of significant importance that has shaped history, culture, and society in profound ways. Understanding ${topic} requires examining multiple dimensions including its origins, key developments, major contributions, and lasting impact. This document provides a structured exploration of ${topic}, covering the essential aspects that every reader should know.`,
        points: [
          `An overview of ${topic} and why it matters today.`,
          `The historical and cultural background of ${topic}.`,
          `Key events, milestones, and turning points related to ${topic}.`,
          `The main principles and ideas associated with ${topic}.`,
        ],
      },
      {
        heading: `Background and Early Life`,
        content: `The foundations of ${topic} can be traced through its early developments and the conditions that shaped it. Examining the background helps clarify why ${topic} emerged the way it did and what factors influenced its evolution over time.`,
        points: [
          `Early influences and formative experiences related to ${topic}.`,
          `The social, political, and cultural context surrounding ${topic}.`,
          `Key individuals and groups connected to ${topic}.`,
          `The early milestones that defined the direction of ${topic}.`,
        ],
      },
      {
        heading: `Major Achievements and Contributions`,
        content: `${Title} is recognized for a series of remarkable achievements that have left a lasting mark. These accomplishments span multiple areas and continue to influence how ${topic} is understood and valued today.`,
        points: [
          `Significant achievements that defined ${topic}.`,
          `Areas where ${topic} made the greatest impact.`,
          `Recognition and honors associated with ${topic}.`,
          `Long-term contributions to society, culture, and future generations.`,
        ],
      },
      {
        heading: `Challenges and Criticisms`,
        content: `Like any significant subject, ${topic} has faced challenges, controversies, and criticisms. Examining these honestly provides a balanced understanding and helps distinguish between different perspectives.`,
        points: [
          `Major challenges encountered throughout the history of ${topic}.`,
          `Common criticisms and the debates they have sparked.`,
          `Different perspectives from historians, scholars, and the public.`,
          `How these challenges shaped the legacy of ${topic}.`,
        ],
      },
      {
        heading: `Legacy and Impact`,
        content: `The legacy of ${topic} continues to influence the present day. Its impact can be seen across multiple fields and continues to inspire new generations of thinkers, leaders, and innovators.`,
        points: [
          `The lasting legacy of ${topic} in modern times.`,
          `How ${topic} continues to influence contemporary society.`,
          `Symbolic and cultural significance of ${topic}.`,
          `What future generations can learn from ${topic}.`,
        ],
      },
      {
        heading: `Conclusion`,
        content: `${Title} remains one of the most important subjects of our time. By studying ${topic} in depth, readers gain valuable insight into broader themes of leadership, vision, perseverance, and impact. This document has provided a comprehensive overview designed to inform, educate, and inspire further exploration.`,
        points: [
          `Key takeaways from this document on ${topic}.`,
          `Why ${topic} remains relevant today.`,
          `Suggestions for further reading and exploration.`,
          `Final reflections on the importance of ${topic}.`,
        ],
      },
    ],
  };
}

// ============================================
// NORMALIZE
// ============================================
function normalizeDocument(doc, prompt) {
  if (!doc || typeof doc !== "object") doc = {};

  if (!doc.title || !String(doc.title).trim()) {
    const t = cleanTopic(prompt);
    doc.title = t.charAt(0).toUpperCase() + t.slice(1);
  } else {
    doc.title = String(doc.title).trim();
  }

  if (!doc.subtitle || !String(doc.subtitle).trim()) {
    doc.subtitle = `A comprehensive guide to ${cleanTopic(prompt)}`;
  } else {
    doc.subtitle = String(doc.subtitle).trim();
  }

  if (!Array.isArray(doc.sections) || doc.sections.length === 0) {
    return createFallbackDocument(prompt);
  }

  doc.sections = doc.sections
    .map((s, i) => {
      const heading =
        s?.heading && String(s.heading).trim()
          ? String(s.heading).trim()
          : `Section ${i + 1}`;

      const content =
        s?.content && String(s.content).trim()
          ? String(s.content).trim()
          : "";

      let points = Array.isArray(s?.points)
        ? s.points.map((p) => String(p).trim()).filter(Boolean)
        : [];

      return { heading, content, points };
    })
    .filter(Boolean);

  return doc;
}

// ============================================
// FORMAT AS TEXT (for chat display)
// ============================================
function formatAsText(doc) {
  let text = `# ${doc.title}\n\n`;
  if (doc.subtitle) text += `${doc.subtitle}\n\n`;
  doc.sections.forEach((s) => {
    text += `## ${s.heading}\n\n`;
    if (s.content) text += `${s.content}\n\n`;
    (s.points || []).forEach((p) => (text += `• ${p}\n`));
    text += "\n";
  });
  return text;
}

// ============================================
// AI CALL WITH RETRY
// ============================================
async function callAIWithRetry(llm, prompt, maxRetries = 4) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await llm.invoke(prompt);
      let content = response?.content;

      if (Array.isArray(content)) {
        content = content
          .map((i) => (typeof i === "string" ? i : i?.text || ""))
          .join("");
      }

      if (!content || !String(content).trim()) {
        throw new Error("AI returned empty content");
      }

      return { success: true, content: String(content).trim() };
    } catch (error) {
      lastError = error;
      const msg = error?.message || String(error);

      const isRateLimit =
        msg.includes("429") ||
        msg.toLowerCase().includes("rate limit") ||
        msg.toLowerCase().includes("quota");

      if (attempt >= maxRetries) break;

      let delay = 3000;
      const match = msg.match(/try again in\s+([\d.]+)s/i);
      if (match) delay = Math.ceil(parseFloat(match[1]) * 1000) + 2000;
      else if (isRateLimit) delay = 20000;
      else delay = Math.pow(2, attempt) * 1500;

      console.log(`⏳ Retry ${attempt}/${maxRetries} in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return { success: false, error: lastError };
}

// ============================================
// PDF AGENT
// ============================================
export const PdfAgent = async (state) => {
  try {
    const llm = await GetModels("pdf");
    const rawPrompt = state?.prompt?.trim() || "technology";
    const userTopic = cleanTopic(rawPrompt);

    console.log("📄 PDF Agent — topic:", userTopic);

    // ----------------------------------------
    // STEP 1: Build structure (8 sections)
    // ----------------------------------------
    const structurePrompt = `You are an expert document planner.

USER TOPIC: "${userTopic}"

Create a structured document outline for this topic.

Return ONLY valid JSON (no markdown, no code fences, no explanation):

{
  "title": "Specific document title for ${userTopic}",
  "subtitle": "Informative subtitle",
  "sections": [
    { "heading": "Section heading" }
  ]
}

RULES:
1. Create EXACTLY 8 sections.
2. Sections must be SPECIFIC to "${userTopic}" — not generic.
3. For a biography (person): early life, education, career, achievements, ideology, struggles, legacy, conclusion.
4. For technology: concepts, architecture, applications, benefits, challenges, future, conclusion.
5. Order logically.
6. No duplicate sections.
7. Return ONLY the JSON object.`;

    const structureRes = await callAIWithRetry(llm, structurePrompt, 3);

    let structure = structureRes.success
      ? safeParseJSON(structureRes.content)
      : null;

    // Validate structure
    if (
      !structure ||
      !Array.isArray(structure.sections) ||
      structure.sections.length === 0
    ) {
      console.log("⚠️ Structure failed, using fallback outline");
      structure = {
        title: userTopic.charAt(0).toUpperCase() + userTopic.slice(1),
        subtitle: `A comprehensive guide to ${userTopic}`,
        sections: [
          { heading: `Introduction to ${userTopic}` },
          { heading: `Background and Early History` },
          { heading: `Core Concepts and Principles` },
          { heading: `Major Developments and Milestones` },
          { heading: `Achievements and Contributions` },
          { heading: `Challenges and Criticisms` },
          { heading: `Legacy and Lasting Impact` },
          { heading: `Conclusion` },
        ],
      };
    }

    const sectionsPlan = structure.sections.slice(0, 8);
    console.log(`📋 Structure has ${sectionsPlan.length} sections`);

    // ----------------------------------------
    // STEP 2: Generate sections ONE BY ONE
    // (smaller batches → higher success rate)
    // ----------------------------------------
    const generatedSections = [];

    for (let i = 0; i < sectionsPlan.length; i++) {
      const section = sectionsPlan[i];
      const heading = section?.heading || `Section ${i + 1}`;

      const sectionPrompt = `You are an expert document writer.

TOPIC: "${userTopic}"
DOCUMENT TITLE: "${structure.title}"
SECTION: "${heading}"

Write detailed content for THIS section only.

Return ONLY valid JSON (no markdown, no code fences):

{
  "heading": "${heading}",
  "content": "A detailed 100-150 word paragraph about this section.",
  "points": [
    "Detailed point about this section (15-30 words).",
    "Detailed point about this section (15-30 words).",
    "Detailed point about this section (15-30 words).",
    "Detailed point about this section (15-30 words)."
  ]
}

RULES:
1. Content must be SPECIFIC to "${userTopic}" — mention real facts, names, dates, events.
2. Content must be 100-150 words.
3. Exactly 4 points, each 15-30 words.
4. No generic filler text.
5. Return ONLY the JSON object.`;

      const res = await callAIWithRetry(llm, sectionPrompt, 3);

      if (res.success) {
        const parsed = safeParseJSON(res.content);
        if (parsed && parsed.heading) {
          generatedSections.push({
            heading: parsed.heading,
            content: parsed.content || "",
            points: Array.isArray(parsed.points)
              ? parsed.points.map(String)
              : [],
          });
          console.log(`✅ Section ${i + 1}/${sectionsPlan.length} done: ${heading}`);
        } else {
          console.log(`⚠️ Section ${i + 1} JSON parse failed`);
        }
      } else {
        console.log(`❌ Section ${i + 1} AI call failed: ${heading}`);
      }

      // Small delay between sections to avoid rate limit
      if (i < sectionsPlan.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    // ----------------------------------------
    // STEP 3: Build document
    // ----------------------------------------
    let document = {
      title: structure.title || userTopic,
      subtitle: structure.subtitle || `A comprehensive guide to ${userTopic}`,
      sections: generatedSections,
    };

    // If all sections failed → fallback
    if (document.sections.length === 0) {
      console.log("⚠️ All sections failed, using fallback document");
      document = createFallbackDocument(userTopic);
    }

    document = normalizeDocument(document, userTopic);

    // ----------------------------------------
    // STEP 4: Generate PDF
    // ----------------------------------------
    const pdfBuffer = await generatePdf(document);
    if (!pdfBuffer) throw new Error("Failed to generate PDF");

    const aiResponseText = formatAsText(document);

    // ----------------------------------------
    // STEP 5: Upload to Cloudinary
    // ----------------------------------------
    let pdfUrl = null;
    let pdfBase64 = null;

    try {
      const buffer = Buffer.isBuffer(pdfBuffer)
        ? pdfBuffer
        : Buffer.from(pdfBuffer);

      const uploadResult = await uploadToCloudinary(
        buffer,
        "pdf",
        `pdf_${Date.now()}`
      );

      if (uploadResult.success) {
        pdfUrl = uploadResult.url;
        pdfBase64 = buffer.toString("base64");
        console.log("✅ PDF uploaded:", pdfUrl);
      }
    } catch (uploadError) {
      console.error("❌ Cloudinary failed:", uploadError);
      pdfBase64 = Buffer.isBuffer(pdfBuffer)
        ? pdfBuffer.toString("base64")
        : Buffer.from(pdfBuffer).toString("base64");
    }

    return {
      ...state,
      document,
      pdfBuffer,
      pdfGenerated: true,
      pdfUrl,
      pdfBase64,
      isPartialData: false,
      aiResponse: aiResponseText,
      error: null,
    };
  } catch (error) {
    console.error("❌ PdfAgent error:", error);

    try {
      const fallbackDoc = normalizeDocument(
        createFallbackDocument(state?.prompt),
        state?.prompt
      );
      const pdfBuffer = await generatePdf(fallbackDoc);

      if (pdfBuffer) {
        const buffer = Buffer.isBuffer(pdfBuffer)
          ? pdfBuffer
          : Buffer.from(pdfBuffer);

        let pdfUrl = null;
        let pdfBase64 = buffer.toString("base64");

        try {
          const up = await uploadToCloudinary(
            buffer,
            "pdf",
            `pdf_fb_${Date.now()}`
          );
          if (up.success) pdfUrl = up.url;
        } catch {}

        return {
          ...state,
          document: fallbackDoc,
          pdfBuffer,
          pdfGenerated: true,
          pdfUrl,
          pdfBase64,
          isPartialData: true,
          aiResponse: formatAsText(fallbackDoc),
          error: "Using fallback data",
        };
      }
    } catch (fbErr) {
      console.error("Fallback failed:", fbErr);
    }

    return {
      ...state,
      document: null,
      pdfBuffer: null,
      pdfGenerated: false,
      pdfUrl: null,
      pdfBase64: null,
      isPartialData: true,
      aiResponse: `# ${state?.prompt || "Document"}\n\nCould not generate PDF. Please try again.`,
      error: error?.message || "PDF generation failed",
    };
  }
};

export default PdfAgent;