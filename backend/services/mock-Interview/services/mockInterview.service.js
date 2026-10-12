
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.3,
  maxTokens: 16000,
});


const cleanString = (v, fb = "") => (v == null ? fb : String(v).trim());
const cleanStringArray = (v) =>
  Array.isArray(v)
    ? v.filter((i) => i != null).map((i) => String(i).trim()).filter(Boolean)
    : [];


export const detectLanguages = (resumeText) => {
  const t = String(resumeText || "").toLowerCase();

  const patterns = {
    javascript: /\b(javascript|js|node\.?js|react\.?js|react|next\.?js|express\.?js|vue|angular|typescript|ts|nestjs?)\b/,
    python: /\b(python|django|flask|fastapi|pandas|numpy|pytorch|tensorflow)\b/,
    java: /\b(java\b|spring boot|springboot|hibernate)\b/,
    cpp: /\b(c\+\+|cpp|stl)\b/,
    csharp: /\b(c#|csharp|\.net|dotnet|asp\.net)\b/,
    go: /\b(golang|go\s+lang)\b/,
    rust: /\b(rust|cargo)\b/,
    php: /\b(php|laravel)\b/,
    swift: /\b(swift|ios)\b/,
    kotlin: /\b(kotlin|android)\b/,
    sql: /\b(sql|mysql|postgres|postgresql|mongodb|oracle|sqlite|database)\b/,
  };

  const detected = {};
  Object.keys(patterns).forEach((key) => {
    detected[key] = patterns[key].test(t);
  });

 
  return detected;
};


const parseAIResponse = (content) => {
  if (!content) throw new Error("AI returned empty response.");

  if (Array.isArray(content)) {
    content = content
      .map((i) => (typeof i === "string" ? i : i?.text || ""))
      .join("");
  }

  content = String(content).trim();

  content = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const first = content.indexOf("{");
  const last = content.lastIndexOf("}");

  if (first === -1 || last === -1 || last <= first) {
    throw new Error("AI response incomplete or truncated.");
  }

  content = content.slice(first, last + 1);

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
};


const normalizeDSAQuestion = (item) => {
  if (typeof item === "string") {
    const q = cleanString(item);
    if (!q) return null;
    return {
      question: q,
      difficulty: "Medium",
      topic: "DSA",
      description: q,
      expectedApproach: "",
      timeComplexity: "",
      spaceComplexity: "",
      javascript: "",
      python: "",
      testCases: [],
    };
  }

  if (!item || typeof item !== "object") return null;
  const q = cleanString(item.question);
  if (!q) return null;

  return {
    question: q,
    difficulty: ["Easy", "Medium", "Hard"].includes(item.difficulty)
      ? item.difficulty
      : "Medium",
    topic: cleanString(item.topic, "DSA"),
    description: cleanString(item.description, q),
    expectedApproach: cleanString(item.expectedApproach),
    timeComplexity: cleanString(item.timeComplexity),
    spaceComplexity: cleanString(item.spaceComplexity),
    javascript: cleanString(item.javascript),
    python: cleanString(item.python),
    testCases: Array.isArray(item.testCases)
      ? item.testCases
          .filter((t) => t && typeof t === "object")
          .map((t) => ({
            input: cleanString(t.input),
            output: cleanString(t.output),
          }))
          .filter((t) => t.input || t.output)
          .slice(0, 2)
      : [],
  };
};

const normalizeTechnical = (item) => {
  if (typeof item === "string") {
    const q = cleanString(item);
    if (!q) return null;
    return {
      question: q,
      technology: "General",
      whatInterviewerTests: "Technical knowledge.",
      expectedAnswerPoints: [],
      followUps: [],
    };
  }
  if (!item || typeof item !== "object") return null;
  const q = cleanString(item.question);
  if (!q) return null;
  return {
    question: q,
    technology: cleanString(item.technology, "General"),
    whatInterviewerTests: cleanString(
      item.whatInterviewerTests,
      "Technical knowledge."
    ),
    expectedAnswerPoints: cleanStringArray(item.expectedAnswerPoints),
    followUps: cleanStringArray(item.followUps),
  };
};

const normalizeProject = (item) => {
  if (typeof item === "string") {
    const q = cleanString(item);
    if (!q) return null;
    return {
      question: q,
      project: "Candidate Project",
      whatInterviewerTests: "Project understanding.",
      expectedAnswerPoints: [],
      followUps: [],
    };
  }
  if (!item || typeof item !== "object") return null;
  const q = cleanString(item.question);
  if (!q) return null;
  return {
    question: q,
    project: cleanString(item.project, "Candidate Project"),
    whatInterviewerTests: cleanString(
      item.whatInterviewerTests,
      "Project understanding."
    ),
    expectedAnswerPoints: cleanStringArray(item.expectedAnswerPoints),
    followUps: cleanStringArray(item.followUps),
  };
};

const normalizeBehavioral = (item) => {
  if (typeof item === "string") {
    const q = cleanString(item);
    if (!q) return null;
    return {
      question: q,
      whatInterviewerTests: "Communication and teamwork.",
      expectedAnswerPoints: [],
    };
  }
  if (!item || typeof item !== "object") return null;
  const q = cleanString(item.question);
  if (!q) return null;
  return {
    question: q,
    whatInterviewerTests: cleanString(
      item.whatInterviewerTests,
      "Communication and teamwork."
    ),
    expectedAnswerPoints: cleanStringArray(item.expectedAnswerPoints),
  };
};

const normalizeHR = (item) => {
  if (typeof item === "string") {
    const q = cleanString(item);
    if (!q) return null;
    return {
      question: q,
      whatInterviewerTests: "Career goals and motivation.",
      expectedAnswerPoints: [],
    };
  }
  if (!item || typeof item !== "object") return null;
  const q = cleanString(item.question);
  if (!q) return null;
  return {
    question: q,
    whatInterviewerTests: cleanString(
      item.whatInterviewerTests,
      "Career goals and motivation."
    ),
    expectedAnswerPoints: cleanStringArray(item.expectedAnswerPoints),
  };
};


const buildBatchPrompt = (resumeText, batchNumber, previousTopics = []) => {
  const langs = detectLanguages(resumeText);

  
  const availableLanguages = [];
  if (langs.javascript) availableLanguages.push("JavaScript");
  if (langs.python) availableLanguages.push("Python");
  if (langs.java) availableLanguages.push("Java");
  if (langs.cpp) availableLanguages.push("C++");
  if (langs.csharp) availableLanguages.push("C#");
  if (langs.go) availableLanguages.push("Go");
  if (langs.rust) availableLanguages.push("Rust");
  if (langs.php) availableLanguages.push("PHP");

 
  const primaryLang = langs.javascript
    ? "javascript"
    : langs.python
    ? "python"
    : langs.java
    ? "java"
    : "javascript";


  const includeJs = langs.javascript || !langs.python; 
  const includePy = langs.python;

  
  let solutionRules = "";
  if (includeJs && includePy) {
    solutionRules = `
- Provide BOTH "javascript" and "python" solution code.
- JavaScript code must be complete and correct.
- Python code must be complete and correct.`;
  } else if (includeJs) {
    solutionRules = `
- Provide ONLY "javascript" solution code.
- Set "python" field to empty string "".
- DO NOT write Python code (candidate does not know Python).`;
  } else if (includePy) {
    solutionRules = `
- Provide ONLY "python" solution code.
- Set "javascript" field to empty string "".
- DO NOT write JavaScript code (candidate does not know JavaScript).`;
  }

  const previousNote =
    batchNumber > 1 && previousTopics.length > 0
      ? `
IMPORTANT: This is batch #${batchNumber}. 
DO NOT repeat any of these previously asked topics:
${previousTopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Create FRESH, NEW questions on DIFFERENT topics.`
      : "";

  return `
You are a senior technical interviewer at a top tech company.

Analyze the candidate's resume and generate a PERSONALIZED mock interview BATCH #${batchNumber}.

${previousNote}

CRITICAL RULES:

1. Analyze the candidate's ACTUAL skills, technologies, projects, and experience.
2. DO NOT invent technologies not mentioned in the resume.
3. Questions MUST match the candidate's actual tech stack.
4. If candidate has no projects, ask more technical/DSA questions instead.
5. If candidate is a fresher, keep difficulty appropriate.
6. Use ${primaryLang.toUpperCase()} as the primary language.

DETECTED CANDIDATE LANGUAGES: ${
    availableLanguages.length > 0
      ? availableLanguages.join(", ")
      : "JavaScript (default)"
  }

SOLUTION CODE RULES:${solutionRules}

EXACT COUNTS (must match precisely):
- 5 DSA questions
- 4 Technical questions
- 3 Project-based questions
- 2 Behavioral questions
- 1 HR question

TOTAL = 15 questions.

Return ONLY one valid JSON object. No markdown, no code fences, no text outside JSON.

JSON STRUCTURE:

{
  "title": "string",
  "candidateSummary": "max 250 chars",
  "candidateLevel": "Junior" | "Mid-Level" | "Senior",
  "detectedSkills": ["skill1", "skill2"],

  "dsaQuestions": [
    {
      "question": "string",
      "difficulty": "Easy" | "Medium" | "Hard",
      "topic": "string",
      "description": "string",
      "expectedApproach": "string",
      "timeComplexity": "string",
      "spaceComplexity": "string",
      "javascript": "string (empty if not applicable)",
      "python": "string (empty if not applicable)",
      "testCases": [
        { "input": "string", "output": "string" },
        { "input": "string", "output": "string" }
      ]
    }
  ],

  "technicalQuestions": [
    {
      "question": "string",
      "technology": "string (must be from candidate's CV)",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": ["point1", "point2", "point3"],
      "followUps": ["question1"]
    }
  ],

  "projectQuestions": [
    {
      "question": "string",
      "project": "string (must reference actual CV project)",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": ["point1", "point2", "point3"],
      "followUps": ["question1"]
    }
  ],

  "behavioralQuestions": [
    {
      "question": "string",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": ["point1", "point2", "point3"]
    }
  ],

  "hrQuestions": [
    {
      "question": "string",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": ["point1", "point2", "point3"]
    }
  ]
}

STRICT REQUIREMENTS:
1. Exactly 5 DSA, 4 Technical, 3 Project, 2 Behavioral, 1 HR = 15 total.
2. Every question MUST be an object, never a string.
3. Technical questions MUST mention technologies from the CV only.
4. Project questions MUST reference actual CV projects.
5. No duplicate questions.
6. Keep all text concise.
7. Complete the ENTIRE JSON before stopping.

CANDIDATE RESUME:
"""
${resumeText}
"""
`;
};


const normalizeInterviewResult = (data) => {
  const dsaQuestions = Array.isArray(data.dsaQuestions)
    ? data.dsaQuestions.map(normalizeDSAQuestion).filter(Boolean).slice(0, 5)
    : [];

  const technicalQuestions = Array.isArray(data.technicalQuestions)
    ? data.technicalQuestions.map(normalizeTechnical).filter(Boolean).slice(0, 4)
    : [];

  const projectQuestions = Array.isArray(data.projectQuestions)
    ? data.projectQuestions.map(normalizeProject).filter(Boolean).slice(0, 3)
    : [];

  const behavioralQuestions = Array.isArray(data.behavioralQuestions)
    ? data.behavioralQuestions.map(normalizeBehavioral).filter(Boolean).slice(0, 2)
    : [];

  const hrQuestions = Array.isArray(data.hrQuestions)
    ? data.hrQuestions.map(normalizeHR).filter(Boolean).slice(0, 1)
    : [];

  return {
    title: cleanString(data.title, "AI Mock Interview"),
    candidateSummary: cleanString(data.candidateSummary).slice(0, 500),
    candidateLevel: ["Junior", "Mid-Level", "Senior"].includes(data.candidateLevel)
      ? data.candidateLevel
      : "Junior",
    detectedSkills: cleanStringArray(data.detectedSkills),
    dsaQuestions,
    technicalQuestions,
    projectQuestions,
    behavioralQuestions,
    hrQuestions,
    totalQuestions:
      dsaQuestions.length +
      technicalQuestions.length +
      projectQuestions.length +
      behavioralQuestions.length +
      hrQuestions.length,
  };
};


const validateInterviewResult = (result) => {
  const required = {
    dsaQuestions: 5,
    technicalQuestions: 4,
    projectQuestions: 3,
    behavioralQuestions: 2,
    hrQuestions: 1,
  };

  for (const [field, expected] of Object.entries(required)) {
    const actual = Array.isArray(result[field]) ? result[field].length : 0;
    if (actual !== expected) {
      throw new Error(
        `AI generated ${actual} ${field}, but ${expected} are required.`
      );
    }
  }
  return true;
};


export const generateMockInterview = async (resumeText, options = {}) => {
  try {
    if (!resumeText || !resumeText.trim()) {
      throw new Error("Resume text is empty.");
    }

    const batchNumber = options.batchNumber || 1;
    const previousTopics = options.previousTopics || [];

    console.log(
      `Generating batch #${batchNumber} (previous topics: ${previousTopics.length})`
    );

    const prompt = buildBatchPrompt(resumeText, batchNumber, previousTopics);

    const response = await model.invoke([
      new SystemMessage(
        "You are a senior interviewer. Return only complete valid JSON. Follow all counts exactly."
      ),
      new HumanMessage(prompt),
    ]);

    const parsed = parseAIResponse(response.content);
    const result = normalizeInterviewResult(parsed);

    validateInterviewResult(result);

    console.log("Batch generated:", {
      total: result.totalQuestions,
      detectedSkills: result.detectedSkills.length,
      batch: batchNumber,
    });

    return result;
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error(`Failed to generate mock interview: ${error.message}`);
  }
};

export default generateMockInterview;