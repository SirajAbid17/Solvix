import { GetModels } from "../config/aimodels.js";
import generatePdf from "../utlis/GeneratePdf.js";
import { uploadToCloudinary } from "../utlis/UploadFile.js";

function createFallbackDocument(prompt) {
  const topic = prompt || "Document";
  const title = topic.length > 50 ? topic.substring(0, 50) + "..." : topic;
  
  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    subtitle: "Comprehensive guide and reference",
    sections: [
      { 
        heading: "Overview", 
        points: [
          `This document provides comprehensive information about ${topic}.`,
          "Key concepts and principles are explained in detail.",
          "Practical examples demonstrate real-world applications.",
          "Best practices and guidelines are included for reference."
        ]
      },
      { 
        heading: "Key Topics", 
        points: [
          "Core concepts and fundamental principles are covered.",
          "Advanced topics and their applications are discussed.",
          "Common challenges and solutions are presented.",
          "Industry best practices and standards are highlighted."
        ]
      }
    ]
  };
}

function normalizeDocument(document, prompt) {
  if (!document || typeof document !== "object") {
    document = {};
  }

  if (!document.title || !String(document.title).trim()) {
    const topic = prompt || "Document";
    document.title = topic.length > 80 ? topic.substring(0, 80) + "..." : topic;
    document.title = document.title.charAt(0).toUpperCase() + document.title.slice(1);
  } else {
    document.title = String(document.title).trim();
  }

  if (!document.subtitle || !String(document.subtitle).trim()) {
    document.subtitle = "Generated document";
  } else {
    document.subtitle = String(document.subtitle).trim();
  }

  if (!Array.isArray(document.sections) || document.sections.length === 0) {
    document.sections = [
      {
        heading: "Content",
        content: `${document.title} provides comprehensive information about the requested topic. The document explains important concepts, relevant details, practical considerations, and useful information for better understanding.`,
        points: [
          `${document.title} covers all essential topics related to the subject.`,
          "Detailed information is provided throughout the document.",
          "Important concepts and practical considerations are explained clearly.",
          "Relevant examples and useful insights are included where appropriate.",
        ],
      },
    ];
  }

  document.sections = document.sections
    .map((section, index) => {
      const heading = section?.heading && String(section.heading).trim()
        ? String(section.heading).trim()
        : `Section ${index + 1}`;

      let content = "";
      if (section?.content !== null && section?.content !== undefined) {
        content = String(section.content).trim();
      }

      let points = Array.isArray(section?.points)
        ? section.points
            .filter((point) => point !== null && point !== undefined)
            .map((point) => String(point).trim())
            .filter(Boolean)
        : [];

      points = points.filter((point) => {
        const normalized = point.toLowerCase().trim();
        return (
          normalized !== "points" &&
          normalized !== "point" &&
          normalized !== "heading" &&
          normalized !== "content" &&
          normalized !== "heading covers important aspects of the topic."
        );
      });

      if (!content) {
        content = `${heading} provides important information about this topic. This section explains the main concepts, relevant details, practical considerations, and important aspects that help the reader understand the subject clearly.`;
      }

      if (points.length === 0) {
        points = [
          `${heading} covers important aspects of the topic.`,
          `Key concepts related to ${heading} are explained in detail.`,
          `Practical insights related to ${heading} are provided for better understanding.`,
          `Important considerations and common approaches related to ${heading} are discussed.`,
        ];
      }

      return { heading, content, points };
    })
    .filter(Boolean);

  if (document.sections.length === 0) {
    document.sections = [
      {
        heading: "Overview",
        content: `This document provides comprehensive information about ${document.title}.`,
        points: [
          `${document.title} covers the essential concepts of the requested topic.`,
          "Important information is organized into clear sections.",
          "Practical insights are provided for better understanding.",
        ],
      },
    ];
  }

  return document;
}

function formatDocumentAsText(document) {
  let text = `# ${document.title || "Document"}\n\n`;
  if (document.subtitle) text += `${document.subtitle}\n\n`;
  
  document.sections.forEach(section => {
    text += `## ${section.heading}\n\n`;
    section.points.forEach(point => {
      text += `• ${point}\n`;
    });
    text += '\n';
  });
  
  return text;
}

async function callAIWithRetry(llm, prompt, maxRetries = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await llm.invoke(prompt);

      let content = response?.content;

      if (Array.isArray(content)) {
        content = content
          .map((item) => {
            if (typeof item === "string") return item;
            return item?.text || "";
          })
          .join("");
      }

      if (!content) {
        throw new Error("AI returned empty content");
      }

      content = String(content).trim();

      if (!content.length) {
        throw new Error("AI returned empty content");
      }

      return { success: true, content, rawResponse: response };
    } catch (error) {
      lastError = error;

      const message = error?.message || String(error);
      const isRateLimit =
        message.includes("429") ||
        message.includes("rate_limit_exceeded") ||
        message.toLowerCase().includes("rate limit") ||
        message.toLowerCase().includes("tokens per minute");

      if (attempt >= maxRetries) break;

      let delay = 5000;

      const retryMatch = message.match(/try again in\s+([\d.]+)s/i);
      if (retryMatch) {
        const seconds = parseFloat(retryMatch[1]);
        if (!isNaN(seconds)) {
          delay = Math.ceil(seconds * 1000) + 2000;
        }
      } else if (isRateLimit) {
        delay = 15000;
      } else {
        delay = Math.pow(2, attempt) * 1000;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { success: false, error: lastError };
}

export const PdfAgent = async (state) => {
  try {
    const llm = await GetModels("pdf");

    const userTopic = state?.prompt?.trim() || "Create a comprehensive document about technology";

    const structurePrompt = `
You are an expert professional document planner.

The user wants a document about:

"${userTopic}"

Create a suitable structure specifically for this topic.

Different topics require different sections.

For example:
- A biography should cover early life, career, achievements, legacy, etc.
- A technology topic should cover concepts, architecture, applications, benefits, limitations, etc.
- A business topic should cover market, strategy, operations, finance, risks, etc.
- A historical topic should cover background, timeline, major events, impact, legacy, etc.
- A scientific topic should cover definitions, principles, methodology, applications, limitations, future directions, etc.

Do NOT blindly follow these examples. Decide the best structure yourself based on the user's topic.

Return ONLY valid JSON.

{
  "title": "Appropriate document title",
  "subtitle": "Informative subtitle",
  "sections": [
    {
      "heading": "Section heading",
      "description": "What this section should explain"
    }
  ]
}

Rules:
1. Create between 8 and 12 meaningful sections.
2. Sections must be specifically relevant to the user's topic.
3. Avoid duplicate sections.
4. Order sections logically.
5. Do not invent unrelated sections.
6. Return ONLY JSON.
7. No markdown.
8. No code fences.
9. Use valid double-quoted JSON.
`;

    const structureResult = await callAIWithRetry(llm, structurePrompt, 2);

    let structure = null;

    if (structureResult.success) {
      try {
        let structureContent = structureResult.content
          .replace(/^```json/i, "")
          .replace(/^```/i, "")
          .replace(/```$/i, "")
          .trim();

        structure = JSON.parse(structureContent);
      } catch (error) {
        // Fallback to default structure
      }
    }

    if (!structure || !Array.isArray(structure.sections) || structure.sections.length === 0) {
      structure = {
        title: userTopic.length > 80 ? userTopic.substring(0, 80) + "..." : userTopic,
        subtitle: `A comprehensive exploration of ${userTopic}`,
        sections: [
          { heading: "Introduction", description: `Introduction and overview of ${userTopic}` },
          { heading: "Background and History", description: `Background and historical development of ${userTopic}` },
          { heading: "Core Concepts", description: `Important concepts and fundamentals related to ${userTopic}` },
          { heading: "Major Developments", description: `Important developments and changes related to ${userTopic}` },
          { heading: "Applications and Impact", description: `Applications, influence and practical impact of ${userTopic}` },
          { heading: "Advantages and Benefits", description: `Major benefits and positive aspects of ${userTopic}` },
          { heading: "Challenges and Limitations", description: `Challenges, limitations and problems associated with ${userTopic}` },
          { heading: "Future Outlook", description: `Future possibilities, trends and developments related to ${userTopic}` },
        ],
      };
    }

    const sectionsPlan = structure.sections.slice(0, 12);
    const generatedSections = [];
    const batchSize = 3;

    for (let i = 0; i < sectionsPlan.length; i += batchSize) {
      const batch = sectionsPlan.slice(i, i + batchSize);

      const sectionPrompt = `
You are an expert professional document writer.

USER TOPIC:
"${userTopic}"

DOCUMENT TITLE:
"${structure.title}"

DOCUMENT SUBTITLE:
"${structure.subtitle}"

Write detailed content for the following sections:

${JSON.stringify(batch, null, 2)}

Return ONLY a valid JSON array.

[
  {
    "heading": "Section heading",
    "content": "A detailed and informative explanation of this section.",
    "points": [
      "Detailed useful point.",
      "Detailed useful point.",
      "Detailed useful point.",
      "Detailed useful point."
    ]
  }
]

Rules:
1. Generate every requested section.
2. Do not skip any section.
3. Each section must contain 120-200 words in the content field.
4. Each section must contain 4-6 detailed points.
5. Each point should contain approximately 20-35 words.
6. Make content specific to "${userTopic}".
7. Do not repeat information unnecessarily.
8. Include useful examples where appropriate.
9. Include facts, concepts, applications, challenges and practical insights where relevant to the topic.
10. Do not force irrelevant categories onto the topic.
11. If the topic is a person, focus on their actual life, career, achievements and impact.
12. If the topic is technology, focus on concepts, implementation, applications, benefits and limitations.
13. If the topic is historical, focus on events, context, causes, consequences and legacy.
14. Adapt the writing style and information to the actual topic.
15. Return ONLY JSON.
16. No markdown.
17. No code fences.
18. No explanation outside JSON.
19. Use valid double-quoted JSON.
20. Do not add trailing commas.
`;

      const sectionResult = await callAIWithRetry(llm, sectionPrompt, 2);

      if (sectionResult.success) {
        try {
          let sectionContent = sectionResult.content
            .replace(/^```json/i, "")
            .replace(/^```/i, "")
            .replace(/```$/i, "")
            .trim();

          const parsedSections = JSON.parse(sectionContent);

          if (Array.isArray(parsedSections)) {
            generatedSections.push(...parsedSections);
          }
        } catch (error) {
          // Skip failed section
        }
      }
    }

    let document = {
      title: structure.title || userTopic,
      subtitle: structure.subtitle || `Comprehensive document about ${userTopic}`,
      sections: generatedSections,
    };

    if (!Array.isArray(document.sections) || document.sections.length === 0) {
      document = createFallbackDocument(userTopic);
    }

    document = normalizeDocument(document, userTopic);

    // ✅ Generate PDF
    const pdfBuffer = await generatePdf(document);

    if (!pdfBuffer) {
      throw new Error("Failed to generate PDF");
    }

    const aiResponseText = formatDocumentAsText(document);

    // ✅ Upload PDF to Cloudinary
    let pdfUrl = null;
    let pdfBase64 = null;

    try {
      const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
      const uploadResult = await uploadToCloudinary(buffer, "pdf", `pdf_${Date.now()}`);
      
      if (uploadResult.success) {
        pdfUrl = uploadResult.url;
        pdfBase64 = buffer.toString("base64");
        console.log("✅ PDF uploaded to Cloudinary:", pdfUrl);
      }
    } catch (uploadError) {
      console.error("❌ Cloudinary upload failed:", uploadError);
      // Fallback: return base64
      pdfBase64 = Buffer.isBuffer(pdfBuffer) ? pdfBuffer.toString("base64") : Buffer.from(pdfBuffer).toString("base64");
    }

    return {
      ...state,
      document,
      pdfBuffer,
      pdfGenerated: true,
      pdfUrl: pdfUrl, // ✅ Cloudinary URL
      pdfBase64: pdfBase64, // ✅ Base64 fallback
      isPartialData: false,
      aiResponse: aiResponseText,
      error: null,
    };

  } catch (error) {
    console.error("PdfAgent error:", error);
    
    try {
      const fallbackDocument = normalizeDocument(createFallbackDocument(state?.prompt), state?.prompt);
      const pdfBuffer = await generatePdf(fallbackDocument);

      if (pdfBuffer) {
        const fallbackText = formatDocumentAsText(fallbackDocument);

        // ✅ Try to upload fallback PDF to Cloudinary
        let pdfUrl = null;
        let pdfBase64 = null;
        
        try {
          const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
          const uploadResult = await uploadToCloudinary(buffer, "pdf", `pdf_fallback_${Date.now()}`);
          if (uploadResult.success) {
            pdfUrl = uploadResult.url;
            pdfBase64 = buffer.toString("base64");
          }
        } catch (uploadError) {
          pdfBase64 = Buffer.isBuffer(pdfBuffer) ? pdfBuffer.toString("base64") : Buffer.from(pdfBuffer).toString("base64");
        }

        return {
          ...state,
          document: fallbackDocument,
          pdfBuffer,
          pdfGenerated: true,
          pdfUrl: pdfUrl,
          pdfBase64: pdfBase64,
          isPartialData: true,
          aiResponse: fallbackText,
          error: "Using fallback data",
        };
      }
    } catch (fallbackError) {
      console.error("Fallback PDF generation failed:", fallbackError);
    }

    return {
      ...state,
      document: null,
      pdfBuffer: null,
      pdfGenerated: false,
      pdfUrl: null,
      pdfBase64: null,
      isPartialData: true,
      aiResponse: `# ${state?.prompt || "Document"}\n\nI couldn't generate the PDF. Please try again.`,
      error: error?.message || "PDF generation failed",
    };
  }
};

export default PdfAgent;