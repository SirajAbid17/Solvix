import { ChatGroq } from "@langchain/groq";
import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

/*
|--------------------------------------------------------------------------
| Groq Model
|--------------------------------------------------------------------------
*/

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.1,
  maxTokens: 16000,
});

/*
|--------------------------------------------------------------------------
| Basic Helpers
|--------------------------------------------------------------------------
*/

const cleanString = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
};

const cleanStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        item !== null &&
        item !== undefined
    )
    .map((item) => String(item).trim())
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| Parse AI Response
|--------------------------------------------------------------------------
*/

const parseAIResponse = (content) => {
  if (!content) {
    throw new Error(
      "AI returned an empty response."
    );
  }

  /*
   * LangChain can return:
   *
   * string
   * OR
   * array of content blocks
   */

  if (Array.isArray(content)) {
    content = content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (
          item &&
          typeof item === "object" &&
          item.text
        ) {
          return item.text;
        }

        return "";
      })
      .join("");
  }

  content = String(content).trim();

  console.log(
    "🤖 AI response characters:",
    content.length
  );

  /*
   * Remove markdown code fences
   */

  content = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  /*
   * Find JSON object
   */

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  /*
   * If there is no closing brace,
   * the model response was truncated.
   */

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    console.error(
      "❌ AI response does not contain a complete JSON object."
    );

    console.error(
      "❌ Response ending:"
    );

    console.error(
      content.slice(-1500)
    );

    throw new Error(
      "AI response was incomplete or truncated. Please try again."
    );
  }

  content = content.slice(
    firstBrace,
    lastBrace + 1
  );

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(
      "❌ JSON parsing failed:",
      error.message
    );

    console.error(
      "❌ Response ending:"
    );

    console.error(
      content.slice(-1500)
    );

    throw new Error(
      `AI returned invalid JSON: ${error.message}`
    );
  }
};

/*
|--------------------------------------------------------------------------
| Normalize DSA Question
|--------------------------------------------------------------------------
*/

const normalizeDSAQuestion = (
  item,
  index
) => {
  /*
   * AI accidentally returns:
   *
   * "Explain Binary Search"
   *
   * Convert it to object.
   */

  if (typeof item === "string") {
    const question =
      cleanString(item);

    if (!question) {
      return null;
    }

    return {
      question,

      difficulty: "Medium",

      topic: "DSA",

      description: question,

      expectedApproach: "",

      timeComplexity: "",

      spaceComplexity: "",

      javascript: "",

      python: "",

      testCases: [],
    };
  }

  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const question =
    cleanString(item.question);

  if (!question) {
    return null;
  }

  const difficulty = [
    "Easy",
    "Medium",
    "Hard",
  ].includes(item.difficulty)
    ? item.difficulty
    : "Medium";

  const testCases =
    Array.isArray(item.testCases)
      ? item.testCases
          .filter(
            (test) =>
              test &&
              typeof test === "object"
          )
          .map((test) => ({
            input: cleanString(
              test.input
            ),
            output: cleanString(
              test.output
            ),
          }))
          .filter(
            (test) =>
              test.input ||
              test.output
          )
          .slice(0, 2)
      : [];

  return {
    question,

    difficulty,

    topic: cleanString(
      item.topic,
      "DSA"
    ),

    description: cleanString(
      item.description,
      question
    ),

    expectedApproach:
      cleanString(
        item.expectedApproach
      ),

    timeComplexity:
      cleanString(
        item.timeComplexity
      ),

    spaceComplexity:
      cleanString(
        item.spaceComplexity
      ),

    javascript:
      cleanString(
        item.javascript
      ),

    python:
      cleanString(
        item.python
      ),

    testCases,
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Technical Question
|--------------------------------------------------------------------------
*/

const normalizeTechnicalQuestion = (
  item
) => {
  if (typeof item === "string") {
    const question =
      cleanString(item);

    if (!question) {
      return null;
    }

    return {
      question,

      technology: "General",

      whatInterviewerTests:
        "Technical knowledge and problem-solving ability.",

      expectedAnswerPoints: [],

      followUps: [],
    };
  }

  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const question =
    cleanString(item.question);

  if (!question) {
    return null;
  }

  return {
    question,

    technology: cleanString(
      item.technology,
      "General"
    ),

    whatInterviewerTests:
      cleanString(
        item.whatInterviewerTests,
        "Technical knowledge and problem-solving ability."
      ),

    expectedAnswerPoints:
      cleanStringArray(
        item.expectedAnswerPoints
      ),

    followUps:
      cleanStringArray(
        item.followUps
      ),
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Project Question
|--------------------------------------------------------------------------
*/

const normalizeProjectQuestion = (
  item
) => {
  if (typeof item === "string") {
    const question =
      cleanString(item);

    if (!question) {
      return null;
    }

    return {
      question,

      project:
        "Candidate Project",

      whatInterviewerTests:
        "Project understanding and technical decision-making.",

      expectedAnswerPoints: [],

      followUps: [],
    };
  }

  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const question =
    cleanString(item.question);

  if (!question) {
    return null;
  }

  return {
    question,

    project: cleanString(
      item.project,
      "Candidate Project"
    ),

    whatInterviewerTests:
      cleanString(
        item.whatInterviewerTests,
        "Project understanding and technical decision-making."
      ),

    expectedAnswerPoints:
      cleanStringArray(
        item.expectedAnswerPoints
      ),

    followUps:
      cleanStringArray(
        item.followUps
      ),
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Behavioral Question
|--------------------------------------------------------------------------
*/

const normalizeBehavioralQuestion = (
  item
) => {
  if (typeof item === "string") {
    const question =
      cleanString(item);

    if (!question) {
      return null;
    }

    return {
      question,

      whatInterviewerTests:
        "Communication, teamwork, ownership and problem-solving.",

      expectedAnswerPoints: [],
    };
  }

  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const question =
    cleanString(item.question);

  if (!question) {
    return null;
  }

  return {
    question,

    whatInterviewerTests:
      cleanString(
        item.whatInterviewerTests,
        "Communication, teamwork, ownership and problem-solving."
      ),

    expectedAnswerPoints:
      cleanStringArray(
        item.expectedAnswerPoints
      ),
  };
};

/*
|--------------------------------------------------------------------------
| Normalize HR Question
|--------------------------------------------------------------------------
*/

const normalizeHRQuestion = (
  item
) => {
  if (typeof item === "string") {
    const question =
      cleanString(item);

    if (!question) {
      return null;
    }

    return {
      question,

      whatInterviewerTests:
        "Career goals, motivation and role alignment.",

      expectedAnswerPoints: [],
    };
  }

  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const question =
    cleanString(item.question);

  if (!question) {
    return null;
  }

  return {
    question,

    whatInterviewerTests:
      cleanString(
        item.whatInterviewerTests,
        "Career goals, motivation and role alignment."
      ),

    expectedAnswerPoints:
      cleanStringArray(
        item.expectedAnswerPoints
      ),
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Complete Interview
|--------------------------------------------------------------------------
*/

const normalizeInterviewResult = (
  data
) => {
  const dsaQuestions =
    Array.isArray(
      data.dsaQuestions
    )
      ? data.dsaQuestions
          .map(
            normalizeDSAQuestion
          )
          .filter(Boolean)
          .slice(0, 5)
      : [];

  const technicalQuestions =
    Array.isArray(
      data.technicalQuestions
    )
      ? data.technicalQuestions
          .map(
            normalizeTechnicalQuestion
          )
          .filter(Boolean)
          .slice(0, 4)
      : [];

  const projectQuestions =
    Array.isArray(
      data.projectQuestions
    )
      ? data.projectQuestions
          .map(
            normalizeProjectQuestion
          )
          .filter(Boolean)
          .slice(0, 3)
      : [];

  const behavioralQuestions =
    Array.isArray(
      data.behavioralQuestions
    )
      ? data.behavioralQuestions
          .map(
            normalizeBehavioralQuestion
          )
          .filter(Boolean)
          .slice(0, 2)
      : [];

  const hrQuestions =
    Array.isArray(
      data.hrQuestions
    )
      ? data.hrQuestions
          .map(
            normalizeHRQuestion
          )
          .filter(Boolean)
          .slice(0, 1)
      : [];

  return {
    title: cleanString(
      data.title,
      "AI Mock Interview"
    ),

    candidateSummary:
      cleanString(
        data.candidateSummary
      ).slice(0, 500),

    candidateLevel: [
      "Junior",
      "Mid-Level",
      "Senior",
    ].includes(
      data.candidateLevel
    )
      ? data.candidateLevel
      : "Junior",

    detectedSkills:
      cleanStringArray(
        data.detectedSkills
      ),

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

/*
|--------------------------------------------------------------------------
| Validate Interview
|--------------------------------------------------------------------------
*/

const validateInterviewResult = (
  result
) => {
  const requiredCounts = {
    dsaQuestions: 5,
    technicalQuestions: 4,
    projectQuestions: 3,
    behavioralQuestions: 2,
    hrQuestions: 1,
  };

  for (
    const [field, expected] of Object.entries(
      requiredCounts
    )
  ) {
    const actual =
      Array.isArray(result[field])
        ? result[field].length
        : 0;

    if (actual !== expected) {
      throw new Error(
        `AI generated ${actual} ${field}, but ${expected} are required.`
      );
    }
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Generate Mock Interview
|--------------------------------------------------------------------------
*/

export const generateMockInterview =
  async (resumeText) => {
    try {
      if (
        !resumeText ||
        !resumeText.trim()
      ) {
        throw new Error(
          "Resume text is empty."
        );
      }

      console.log(
        "🤖 Starting LangChain/Groq interview generation..."
      );

      /*
      |--------------------------------------------------------------------------
      | Prompt
      |--------------------------------------------------------------------------
      */

      const prompt = `
You are a senior technical interviewer.

Analyze the candidate resume below and generate a personalized mock interview.

IMPORTANT:
Return ONLY one valid JSON object.
Do NOT use Markdown.
Do NOT use code fences.
Do NOT write anything before or after JSON.

EXACT COUNTS:
- 5 DSA questions
- 4 technical questions
- 3 project questions
- 2 behavioral questions
- 1 HR question

Never return a question as a plain string.
Every question MUST be an object.

JSON STRUCTURE:

{
  "title": "string",
  "candidateSummary": "maximum 250 characters",
  "candidateLevel": "Junior",
  "detectedSkills": [],

  "dsaQuestions": [
    {
      "question": "string",
      "difficulty": "Easy",
      "topic": "string",
      "description": "string",
      "expectedApproach": "string",
      "timeComplexity": "string",
      "spaceComplexity": "string",
      "javascript": "string",
      "python": "string",
      "testCases": [
        {
          "input": "string",
          "output": "string"
        },
        {
          "input": "string",
          "output": "string"
        }
      ]
    }
  ],

  "technicalQuestions": [
    {
      "question": "string",
      "technology": "string",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": [
        "string"
      ],
      "followUps": [
        "string"
      ]
    }
  ],

  "projectQuestions": [
    {
      "question": "string",
      "project": "string",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": [
        "string"
      ],
      "followUps": [
        "string"
      ]
    }
  ],

  "behavioralQuestions": [
    {
      "question": "string",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": [
        "string"
      ]
    }
  ],

  "hrQuestions": [
    {
      "question": "string",
      "whatInterviewerTests": "string",
      "expectedAnswerPoints": [
        "string"
      ]
    }
  ]
}

RULES:

1. Exactly 5 DSA objects.
2. Exactly 4 technical objects.
3. Exactly 3 project objects.
4. Exactly 2 behavioral objects.
5. Exactly 1 HR object.

6. Questions must be objects, NEVER strings.

7. Do not create empty questions.

8. candidateLevel must be exactly:
   Junior
   Mid-Level
   Senior

9. Use only technologies and projects found in the resume.

10. Project questions must reference actual resume projects.

11. DSA questions should match the candidate's level.

12. DSA JavaScript and Python solutions should be short and correct.

13. Each DSA question should have exactly 2 short test cases.

14. Technical expectedAnswerPoints should contain 3 short points.

15. Technical followUps should contain 1 short question.

16. Project expectedAnswerPoints should contain 3 short points.

17. Project followUps should contain 1 short question.

18. Behavioral expectedAnswerPoints should contain 3 short points.

19. HR expectedAnswerPoints should contain 3 short points.

20. Keep every text field concise.

21. Do not repeat the same question.

22. Finish the COMPLETE JSON before stopping.

23. Do not add any additional JSON fields.

CANDIDATE RESUME:

${resumeText}
`;

      /*
      |--------------------------------------------------------------------------
      | Call AI
      |--------------------------------------------------------------------------
      */

      const response =
        await model.invoke([
          new SystemMessage(
            "You are a senior interviewer. Return only complete valid JSON."
          ),

          new HumanMessage(prompt),
        ]);

      console.log(
        "✅ Groq response received."
      );

      /*
      |--------------------------------------------------------------------------
      | Parse
      |--------------------------------------------------------------------------
      */

      const parsed =
        parseAIResponse(
          response.content
        );

      /*
      |--------------------------------------------------------------------------
      | Normalize
      |--------------------------------------------------------------------------
      */

      const result =
        normalizeInterviewResult(
          parsed
        );

      /*
      |--------------------------------------------------------------------------
      | Validate
      |--------------------------------------------------------------------------
      */

      validateInterviewResult(
        result
      );

      /*
      |--------------------------------------------------------------------------
      | Success Logs
      |--------------------------------------------------------------------------
      */

      console.log(
        "========================================"
      );

      console.log(
        "✅ MOCK INTERVIEW GENERATED"
      );

      console.log(
        `📊 Total Questions: ${result.totalQuestions}`
      );

      console.log(
        `🧠 DSA: ${result.dsaQuestions.length}`
      );

      console.log(
        `💻 Technical: ${result.technicalQuestions.length}`
      );

      console.log(
        `📁 Projects: ${result.projectQuestions.length}`
      );

      console.log(
        `👤 Behavioral: ${result.behavioralQuestions.length}`
      );

      console.log(
        `🏢 HR: ${result.hrQuestions.length}`
      );

      console.log(
        "========================================"
      );

      return result;
    } catch (error) {
      console.error(
        "❌ Groq AI Error:",
        error
      );

      throw new Error(
        `Failed to generate mock interview: ${error.message}`
      );
    }
  };

export default generateMockInterview;