import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";



/*
=========================
Groq Model
=========================
*/

const model = new ChatGroq({

    apiKey: process.env.GROQ_API_KEY,

  model: "openai/gpt-oss-20b",
    temperature: 0

});





/*
=========================
Tavily Job Search
=========================
*/

const tavily = new TavilySearch({

    apiKey: process.env.TAVILY_API_KEY,

    maxResults: 10

});





/*
=========================
Resume Analysis
=========================
*/


export const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert ATS Resume Analyzer with deep knowledge of software engineering careers, MERN stack development, and AI/ML roles.

## RESUME TO ANALYZE:
${resumeText}

## ANALYSIS INSTRUCTIONS:

### 1. SCORING (0-100)
- **resumeScore**: Overall resume quality based on content, relevance, and presentation
- **atsScore**: ATS compatibility based on keywords, formatting, and standard sections
- **sectionScores**: Rate each section (experience, projects, skills, education, formatting, ats)

### 2. STRENGTHS
Identify 3-5 key strengths from the resume. Focus on:
- Technical expertise that stands out
- Notable achievements or impact
- Unique combinations of skills
- Project complexity and scale
- Leadership or initiative shown

### 3. AREAS FOR IMPROVEMENT
Provide 3-5 constructive improvements that are:
- Specific and actionable
- Aligned with current industry demands
- Based on gaps in the resume
- Prioritized by importance

### 4. CAREER ROADMAP
Create exactly 4 personalized steps:
- **Step 1**: Immediate action (set completed: true)
- **Steps 2-4**: Progressive career development (completed: false)
- Each step should have a clear title and actionable description

### 5. SKILLS TO IMPROVE
List 4-6 specific technical skills that would enhance the candidate's profile based on:
- Current job market demands
- Career trajectory
- Technology stack evolution
- Industry trends

### 6. NEXT LEARNING RECOMMENDATIONS
Provide 3 detailed recommendations covering:
- Specific technologies or frameworks
- Concrete learning resources or paths
- Practical projects to build
- Timeframe for completion

### 7. MISSING KEYWORDS
Extract 5-10 important keywords that are:
- Relevant to the candidate's target roles
- Currently trending in job descriptions
- Missing from the resume
- ATS-friendly and recruiter-valued

### 8. RECOMMENDED ROLES
Suggest 3-5 job titles that best match the candidate's:
- Current skills and experience
- Career progression path
- Industry demand and opportunities

## CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations
2. Be specific and personalized to this resume
3. Provide actionable, realistic recommendations
4. Consider the candidate's current level (junior/mid/senior)
5. Match recommendations to their specific tech stack and experience
6. Include emerging technologies where relevant
7. Be constructive, not critical

## EXACT JSON FORMAT:
{
  "resumeScore": 0-100,
  "atsScore": 0-100,
  "grade": "A/B/C/D/F",
  "summary": "2-3 sentence professional summary",
  "strengths": [
    {"title": "Specific strength statement"}
  ],
  "improvements": [
    {"title": "Specific improvement area"}
  ],
  "roadmap": [
    {
      "step": 1,
      "title": "Action title",
      "description": "Detailed actionable step",
      "completed": true
    }
  ],
  "skillsToImprove": [
    {"name": "Specific skill name"}
  ],
  "nextLearning": [
    {
      "title": "Learning topic",
      "description": "Detailed recommendation with resources"
    }
  ],
  "missingKeywords": [
    "Keyword1", "Keyword2", "Keyword3"
  ],
  "recommendedRoles": [
    "Role1", "Role2", "Role3"
  ],
  "sectionScores": {
    "experience": 0-100,
    "projects": 0-100,
    "skills": 0-100,
    "education": 0-100,
    "formatting": 0-100,
    "ats": 0-100
  }
}`;

  const response = await model.invoke(prompt);
  let content = response.content;
  content = content.replace(/```json/g, "").replace(/```/g, "").trim();
  const analysis = JSON.parse(content);
  return analysis;
};

export const findJobs = async (analysis) => {

  const primaryRole =
    analysis.recommendedRoles?.[0] || "Full Stack Developer";

  const skills =
    analysis.skillsToImprove?.map(skill => skill.name) || [];

  const experienceLevel = "Junior to Mid Level";

  const query = `
Find ONLY ACTIVE JOB POSTINGS.

Candidate Profile

Role:
${primaryRole}

Skills:
${skills.join(", ")}

Experience:
${experienceLevel}

STRICT RULES

Return ONLY individual job postings.

DO NOT RETURN

- Job search pages
- Search results pages
- Articles
- Blogs
- Career homepages
- Category pages
- Facebook
- Reddit
- LinkedIn feeds
- Company landing pages

Allowed domains

- linkedin.com/jobs/view
- indeed.com/viewjob
- wellfound.com/jobs
- remoteok.com
- greenhouse.io
- lever.co
- ashbyhq.com

Each result MUST contain

- Job title
- Company
- Location
- Salary
- Apply URL
- Description

Return only 8 jobs.
`;

  const result = await tavily.invoke({ query });

  return result.results.map(job => ({
    title: job.title || "Not specified",
    company: job.company || "Not specified",
    location: job.location || "Not specified",
    url: job.url,
    description: job.content || "",
    jobType: job.jobType || "Not specified",
    salary: job.salary || "Not specified",
    source: "Tavily",
  }));
};


