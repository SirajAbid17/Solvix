import { GetModels } from "../config/aimodels.js";
import generatePdf from "../utlis/GeneratePdf.js";



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

function extractPartialData(content) {
  try {
   
    let title = "Document";
    let subtitle = "";
    let sections = [];
    
    // Try to extract title
    const titleMatch = content.match(/"title"\s*:\s*"([^"]*)"/);
    if (titleMatch) title = titleMatch[1];
    
    // Try to extract subtitle
    const subtitleMatch = content.match(/"subtitle"\s*:\s*"([^"]*)"/);
    if (subtitleMatch) subtitle = subtitleMatch[1];
    
    // Extract all headings
    const headingRegex = /"heading"\s*:\s*"([^"]*)"/g;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1]);
    }
    
    // Extract all points
    const pointsRegex = /"points"\s*:\s*\[\s*"([^"]*?)"\s*,\s*"([^"]*?)"\s*,\s*"([^"]*?)"\s*\]/g;
    const allPoints = [];
    let pointsMatch;
    while ((pointsMatch = pointsRegex.exec(content)) !== null) {
      for (let i = 1; i < pointsMatch.length; i++) {
        if (pointsMatch[i] && pointsMatch[i].trim()) {
          allPoints.push(pointsMatch[i]);
        }
      }
    }
    
    // Alternative points extraction
    if (allPoints.length === 0) {
      const simplePointRegex = /"points"\s*:\s*\[\s*"([^"]*?)"/g;
      let simpleMatch;
      while ((simpleMatch = simplePointRegex.exec(content)) !== null) {
        if (simpleMatch[1] && simpleMatch[1].trim()) {
          allPoints.push(simpleMatch[1]);
        }
      }
    }
    
    
    
    // Build sections from extracted data
    if (headings.length > 0 && allPoints.length > 0) {
      const pointsPerSection = Math.ceil(allPoints.length / headings.length);
      headings.forEach((heading, index) => {
        const start = index * pointsPerSection;
        const end = Math.min(start + pointsPerSection, allPoints.length);
        const sectionPoints = allPoints.slice(start, end);
        if (sectionPoints.length > 0) {
          sections.push({ 
            heading: heading.trim(), 
            points: sectionPoints.map(p => p.trim())
          });
        }
      });
    } else if (headings.length > 0) {
      headings.forEach(heading => {
        sections.push({ 
          heading: heading.trim(), 
          points: [
            `${heading.trim()} is an important topic to understand.`,
            `Key concepts related to ${heading.trim()} are covered in detail.`,
            `Practical applications of ${heading.trim()} are discussed.`
          ]
        });
      });
    } else if (allPoints.length > 0) {
      sections.push({ 
        heading: "Content", 
        points: allPoints.map(p => p.trim())
      });
    }
    
    if (sections.length === 0) {
      sections = [
        { 
          heading: "Overview", 
          points: [
            `${title} covers essential topics and concepts.`,
            "Comprehensive information is provided in this document.",
            "Key points are highlighted for easy reference."
          ]
        }
      ];
    }
    
    return { title, subtitle, sections };
  } catch (e) {
    console.warn("Extract failed:", e.message);
    return null;
  }
}

function normalizeDocument(document, prompt) {
  if (!document.title) {
    const topic = prompt || "Document";
    document.title = topic.length > 50 ? topic.substring(0, 50) + "..." : topic;
    document.title = document.title.charAt(0).toUpperCase() + document.title.slice(1);
  }
  if (!document.subtitle) document.subtitle = "Generated document";
  
  if (!Array.isArray(document.sections) || document.sections.length === 0) {
    document.sections = [
      { 
        heading: "Content", 
        points: [
          `${document.title} covers all essential topics.`,
          "Detailed information is provided in the following sections.",
          "Key concepts and best practices are explained clearly."
        ]
      }
    ];
  }
  
  document.sections = document.sections.map((section, index) => {
    let points = Array.isArray(section?.points) ? section.points.filter(Boolean).map(String) : [];
    
    if (points.length === 0 || points.every(p => p.toLowerCase().trim() === "points" || p.toLowerCase().trim() === "heading covers important aspects of the topic.")) {
      const heading = section?.heading || `Section ${index + 1}`;
      points = [
        `${heading} covers important aspects of the topic.`,
        `Key concepts related to ${heading} are explained.`,
        `Practical insights are provided for better understanding.`,
        `Best practices and common approaches are discussed.`
      ];
    }
    
    return {
      heading: section?.heading || `Section ${index + 1}`,
      points: points
    };
  });
  
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

async function callAIWithRetry(llm, prompt, maxRetries = 2) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 AI attempt ${attempt}/${maxRetries}...`);
      
      const response = await llm.invoke(prompt);
      
      let content = response?.content;
      
      if (content) {
        if (Array.isArray(content)) {
          content = content.map((item) => {
            if (typeof item === "string") return item;
            return item?.text || "";
          }).join("");
        }
        content = String(content).trim();
        
        if (content.length > 0) {
          console.log(`✅ AI response received (${content.length} chars)`);
          return { success: true, content, rawResponse: response };
        }
      }
      
      console.warn(`⚠️ Attempt ${attempt}: Empty response from AI`);
      lastError = new Error("AI returned empty content");
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return { success: false, error: lastError };
}

// ============================================
// MAIN PDF AGENT - DYNAMIC AI GENERATED
// ============================================

export const PdfAgent = async (state) => {
  try {
    console.log("📄 PdfAgent started...");
    console.log("📄 Prompt:", state?.prompt);
    
    const llm = await GetModels("pdf");

    // ✅ DYNAMIC PROMPT - Let AI generate the content based on the user's request
    const prompt = `You are an expert document writer. Create a comprehensive, detailed document based on the user's request.

## User Request
${state?.prompt || "Create a comprehensive document about technology"}

## Output Format
Return ONLY valid JSON with this structure:
{
  "title": "Descriptive Document Title",
  "subtitle": "A brief, informative subtitle",
  "sections": [
    {
      "heading": "Section 1 Heading",
      "points": [
        "Detailed point 1 with 10-25 words explaining the concept",
        "Detailed point 2 with 10-25 words providing more information",
        "Detailed point 3 with 10-25 words giving practical insights",
        "Detailed point 4 with 10-25 words covering best practices"
      ]
    },
    {
      "heading": "Section 2 Heading",
      "points": [
        "Detailed point 1 with 10-25 words",
        "Detailed point 2 with 10-25 words",
        "Detailed point 3 with 10-25 words"
      ]
    }
  ]
}

## Rules
1. Create 4-6 sections based on the user's topic
2. Each section MUST have 3-5 detailed points
3. Each point MUST be 10-25 words with specific, useful information
4. Make the content relevant, practical, and comprehensive
5. Return ONLY valid JSON - no markdown, no code fences, no explanation
6. Use double quotes for all strings
7. No trailing commas

Generate the JSON now:`;

    console.log("🤖 Calling AI model for dynamic PDF generation...");
    
    const aiResult = await callAIWithRetry(llm, prompt, 2);
    
    let document = null;
    let isPartialData = false;
    let content = null;
    
    if (aiResult.success) {
      content = aiResult.content;
      console.log("📝 Raw content length:", content.length);
      console.log("📝 Content preview:", content.substring(0, 300));
      
      // Clean up
      content = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      
      // Fix JSON issues
      content = content.replace(/,(\s*[}\]])/g, '$1');
      content = content.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
      
      try {
        console.log("🔍 Trying to parse JSON...");
        document = JSON.parse(content);
        console.log("✅ JSON parsed successfully!");
        
        // Validate document structure
        if (!document.title) {
          document.title = state?.prompt?.substring(0, 50) || "Document";
        }
        
        if (!document.sections || !Array.isArray(document.sections) || document.sections.length === 0) {
          console.warn("⚠️ No sections found in AI response");
          document = null;
        } else {
          // Ensure each section has valid points
          document.sections = document.sections.map(section => {
            if (!section.heading) {
              section.heading = "Section";
            }
            if (!section.points || !Array.isArray(section.points) || section.points.length === 0) {
              section.points = [
                `${section.heading} covers important aspects of the topic.`,
                `Key concepts related to ${section.heading} are explained.`,
                `Practical insights are provided for better understanding.`
              ];
            }
            // Filter empty points
            section.points = section.points.filter(p => p && p.trim().length > 0);
            return section;
          });
          
          console.log(`✅ Document created with ${document.sections.length} sections`);
        }
        
      } catch (parseError) {
        console.warn(`⚠️ JSON parse failed: ${parseError.message}`);
        console.log("🔄 Attempting to extract partial data from AI response...");
        document = extractPartialData(content);
        if (document) {
          console.log("✅ Partial data extracted successfully!");
          isPartialData = true;
        }
      }
    } else {
      console.warn("⚠️ AI call failed");
    }

    // If no document from AI, use fallback
    if (!document) {
      console.warn("⚠️ No document from AI, creating fallback document...");
      document = createFallbackDocument(state?.prompt);
      isPartialData = true;
    }

    document = normalizeDocument(document, state?.prompt);

    console.log(`📄 Document finalized:`);
    console.log(`   Title: ${document.title}`);
    console.log(`   Sections: ${document.sections.length}`);
    let totalPoints = 0;
    document.sections.forEach((s, i) => {
      console.log(`   Section ${i+1}: ${s.heading} (${s.points.length} points)`);
      totalPoints += s.points.length;
    });
    console.log(`   Total Points: ${totalPoints}`);
    if (isPartialData) console.log("   ⚠️ Note: Using fallback/partial data");

    console.log("📄 Generating PDF...");
    const pdfBuffer = await generatePdf(document);

    if (!pdfBuffer) {
      throw new Error("Failed to generate PDF");
    }

    console.log(`✅ PDF generated successfully! Buffer size: ${pdfBuffer.length} bytes`);

    const aiResponseText = formatDocumentAsText(document);

    const result = {
      ...state,
      document: document,
      pdfBuffer: pdfBuffer,
      pdfGenerated: true,
      isPartialData: isPartialData,
      aiResponse: aiResponseText,
      error: null,
    };

    return result;

  } catch (error) {
    console.error("❌ PdfAgent Error:", error);

    // Final fallback
    try {
      console.log("🔄 Creating fallback PDF...");
      
      const fallbackDocument = createFallbackDocument(state?.prompt);
      const pdfBuffer = await generatePdf(fallbackDocument);
      
      if (pdfBuffer) {
        console.log("✅ Fallback PDF generated!");
        const fallbackText = formatDocumentAsText(fallbackDocument);
        
        return {
          ...state,
          document: fallbackDocument,
          pdfBuffer: pdfBuffer,
          pdfGenerated: true,
          isPartialData: true,
          aiResponse: fallbackText,
          error: "Using fallback data",
        };
      }
      
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
    }
    
    return {
      ...state,
      document: null,
      pdfBuffer: null,
      pdfGenerated: false,
      isPartialData: true,
      aiResponse: `# ${state?.prompt || "Document"}\n\nI couldn't generate the PDF. Please try again.`,
      error: error?.message || "PDF generation failed",
    };
  }
};

export default PdfAgent;