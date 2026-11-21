
const TECH_STACK_KEYS = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "ai",
  "cloud",
  "devops",
  "tools",
  "languages",
];

const ARRAY_KEYS = [
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
  "publications",
  "volunteering",
  "languages",
  "interests",
  "references",
];

const uniqueKey = (item) => {
  if (typeof item === "string") {
    return item.trim().toLowerCase();
  }

  if (item && typeof item === "object") {
    return JSON.stringify(item);
  }

  return String(item);
};

const mergeArrays = (...arrays) => {
  const result = [];
  const seen = new Set();

  for (const array of arrays) {
    if (!Array.isArray(array)) continue;

    for (const item of array) {
      if (item == null) continue;

      const key = uniqueKey(item);

      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
  }

  return result;
};

const mergeObjects = (...objects) => {
  const result = {};

  for (const object of objects) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      continue;
    }

    for (const [key, value] of Object.entries(object)) {
      if (value !== undefined && value !== null) {
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          result[key] &&
          typeof result[key] === "object" &&
          !Array.isArray(result[key])
        ) {
          result[key] = {
            ...result[key],
            ...value,
          };
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result;
};

export const buildPortfolioAnalysis = (responses = []) => {
  if (!Array.isArray(responses) || responses.length === 0) {
    throw new Error("No valid analysis responses to merge");
  }

  const result = {
    portfolio: {},
    personal: {},
    socials: {},

    techStack: Object.fromEntries(
      TECH_STACK_KEYS.map((key) => [key, []])
    ),

    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    publications: [],
    volunteering: [],
    languages: [],
    interests: [],
    references: [],

    generatedContent: {},
    statistics: {},
    designRecommendation: {},
    seo: {},
  };

  for (const data of responses) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      continue;
    }

    result.portfolio = mergeObjects(
      result.portfolio,
      data.portfolio
    );

    result.personal = mergeObjects(
      result.personal,
      data.personal
    );

    result.socials = mergeObjects(
      result.socials,
      data.socials
    );

    result.generatedContent = mergeObjects(
      result.generatedContent,
      data.generatedContent
    );

    result.statistics = mergeObjects(
      result.statistics,
      data.statistics
    );

    result.designRecommendation = mergeObjects(
      result.designRecommendation,
      data.designRecommendation
    );

    result.seo = mergeObjects(
      result.seo,
      data.seo
    );

    if (data.techStack && typeof data.techStack === "object") {
      for (const key of TECH_STACK_KEYS) {
        result.techStack[key] = mergeArrays(
          result.techStack[key],
          data.techStack[key]
        );
      }
    }

    for (const key of ARRAY_KEYS) {
      result[key] = mergeArrays(
        result[key],
        data[key]
      );
    }
  }

  return result;
};
