import { GetModels } from "../config/aimodels.js";
import { tavilySearch } from "../config/websearchTavily.js";

export const RoadmapAgent = async (state) => {
  try {
    const llm = await GetModels("chat");
    const { topic, level = "Intermediate" } = state;

    if (!topic || !topic.trim()) {
      return { ...state, error: "Topic is required" };
    }

    console.log(`\n Generating roadmap for: "${topic}" (${level})`);

    
    const prompt = `You are an expert career mentor and curriculum designer.

Create a structured learning roadmap for: "${topic}"
Target level: ${level}

Return ONLY valid JSON (no markdown, no code fences):
{
  "title": "Clean title for the roadmap",
  "totalWeeks": 8,
  "phases": [
    {
      "id": 1,
      "title": "Phase title",
      "duration": "Week 1",
      "description": "2-3 sentence description",
      "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"],
      "searchKeywords": ["keyword 1", "keyword 2"]
    }
  ]
}

RULES:
- Create 6-8 phases
- Each phase must have 3-5 actionable tasks
- searchKeywords are used to find real learning resources
- Phases should progress logically from basics to advanced
- Be specific to "${topic}" — not generic
- Return ONLY JSON`;

    const res = await llm.invoke(prompt);
    let content = res?.content;
    if (Array.isArray(content)) content = content.map((i) => (typeof i === "string" ? i : i?.text || "")).join("");
    content = String(content || "").trim()
      .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("Invalid JSON from AI");

    let roadmap = JSON.parse(content.substring(start, end + 1));
    console.log(`    AI generated ${roadmap.phases?.length || 0} phases`);

    
    for (const phase of roadmap.phases || []) {
      const resources = [];

      for (const keyword of (phase.searchKeywords || []).slice(0, 2)) {
        try {
          const searchRes = await tavilySearch.invoke({
            query: `${keyword} tutorial documentation`,
          });

          const results = (searchRes?.results || searchRes?.data || []).slice(0, 2);

          for (const r of results) {
            if (!r.url) continue;

            
            let type = "Documentation";
            if (r.url.includes("youtube.com") || r.url.includes("youtu.be")) type = "YouTube";
            else if (r.url.includes("github.com")) type = "GitHub";
            else if (r.url.includes("coursera") || r.url.includes("udemy")) type = "Course";

            resources.push({
              id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              title: String(r.title || keyword).slice(0, 150),
              description: String(r.content || r.snippet || "").slice(0, 300),
              url: r.url,
              type,
              domain: new URL(r.url).hostname.replace("www.", ""),
              keywords: keyword,
            });
          }
        } catch (err) {
          console.warn(`     Resource search failed for "${keyword}":`, err.message);
        }
      }

      phase.resources = resources.slice(0, 3);
      console.log(`    Phase ${phase.id}: ${phase.resources.length} resources`);
    }

    return {
      ...state,
      roadmap,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("RoadmapAgent error:", error);
    return { ...state, error: error.message };
  }
};