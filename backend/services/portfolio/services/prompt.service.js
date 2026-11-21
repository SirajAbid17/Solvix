
export const portfolioAnalysisPrompt = (chunk) => `
You are an expert resume analyzer, portfolio architect, professional copywriter, SEO specialist and career consultant.

TASK:
Analyze the supplied resume text and return a complete portfolio data object as valid JSON.

CRITICAL OUTPUT RULES:
1. Return exactly one valid JSON object.
2. Do not return Markdown.
3. Do not use code fences.
4. Do not add explanations before or after the JSON.
5. Use double quotes for all JSON keys and string values.
6. Use null when factual information is missing.
7. Use [] for missing arrays and {} for missing objects.
8. Never invent factual information.
9. Never invent employers, dates, degrees, certifications, links, phone numbers, email addresses or achievements.
10. Keep factual details consistent with the resume.
11. You may professionally rewrite descriptions without changing their meaning.
12. Generated marketing content must not introduce unsupported factual claims.

ANALYSIS REQUIREMENTS:

Extract:
- Personal information
- Contact information
- Social links
- Professional title
- Professional summary
- Skills and technologies
- Work experience
- Projects
- Education
- Certifications
- Achievements
- Publications
- Volunteering
- Languages
- Interests
- References, if explicitly provided

TECH STACK CATEGORIES:
- frontend
- backend
- mobile
- database
- ai
- cloud
- devops
- tools
- languages

GENERATED CONTENT:
You may generate polished presentation content based on the candidate's actual resume:
- Hero title
- Hero subtitle
- About me
- Career objective
- Professional summary
- Professional tagline
- Website introduction
- Why hire me
- Strengths
- Soft skills
- Services
- CTA title and description
- Footer description

Do not claim experience, achievements or qualifications that are not supported by the resume.

DESIGN RECOMMENDATION:
Recommend a suitable portfolio style, theme, colors, typography, animation, layout, hero layout, project layout, navigation and website personality.

PROJECT ANALYSIS:
For each project, extract the actual project name, description and technologies.
You may professionally improve its description.
Do not create fake project names, URLs, clients or statistics.
An image prompt may be suggested, but never generate a fake image URL.

STATISTICS:
Only include values supported by the resume.
If years of experience, completed projects, technologies or certifications cannot be reliably counted, return null.

REQUIRED JSON STRUCTURE:
{
  "portfolio": {
    "title": null,
    "description": null,
    "portfolioType": null,
    "seniority": null
  },
  "personal": {
    "name": null,
    "email": null,
    "phone": null,
    "location": null,
    "website": null,
    "title": null,
    "summary": null,
    "profileImage": null
  },
  "socials": {
    "linkedin": null,
    "github": null,
    "twitter": null,
    "instagram": null,
    "facebook": null,
    "youtube": null
  },
  "techStack": {
    "frontend": [],
    "backend": [],
    "mobile": [],
    "database": [],
    "ai": [],
    "cloud": [],
    "devops": [],
    "tools": [],
    "languages": []
  },
  "skills": [],
  "experience": [],
  "projects": [],
  "education": [],
  "certifications": [],
  "achievements": [],
  "languages": [],
  "interests": [],
  "publications": [],
  "volunteering": [],
  "references": [],
  "generatedContent": {
    "heroTitle": null,
    "heroSubtitle": null,
    "aboutMe": null,
    "careerObjective": null,
    "professionalSummary": null,
    "professionalTagline": null,
    "websiteIntroduction": null,
    "whyHireMe": [],
    "strengths": [],
    "softSkills": [],
    "services": [],
    "ctaTitle": null,
    "ctaDescription": null,
    "footerDescription": null
  },
  "statistics": {
    "yearsExperience": null,
    "projectsCompleted": null,
    "technologiesKnown": null,
    "certificationsCount": null
  },
  "designRecommendation": {
    "portfolioStyle": null,
    "theme": null,
    "primaryColor": null,
    "secondaryColor": null,
    "accentColor": null,
    "font": null,
    "animation": null,
    "layout": null,
    "heroLayout": null,
    "projectLayout": null,
    "navigation": null,
    "websitePersonality": null
  },
  "seo": {
    "title": null,
    "description": null,
    "keywords": [],
    "ogTitle": null,
    "ogDescription": null
  }
}

IMPORTANT:
- Keep every required top-level key in the returned JSON.
- Use the exact key names from this structure.
- Use arrays for list fields.
- Use objects for object fields.
- Do not return comments or trailing commas.
- If this resume chunk does not contain information for a field, return its empty/default value.
- Do not assume that a missing field means the candidate does not have that skill or experience.

RESUME TEXT:
${chunk}
`;
