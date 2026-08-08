const mergeArrays = (arr = []) => {
  const seen = new Set();

  return arr.filter((item) => {
    const value =
      typeof item === "string"
        ? item.toLowerCase()
        : JSON.stringify(item);

    if (seen.has(value)) return false;

    seen.add(value);

    return true;
  });
};

export const buildPortfolioAnalysis = (responses) => {
  const result = {
    portfolio: {},
    personal: {},
    socials: {},

    techStack: {
      frontend: [],
      backend: [],
      mobile: [],
      database: [],
      ai: [],
      cloud: [],
      devops: [],
      tools: [],
      languages: [],
    },

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
    seo: {},
  };

  for (const data of responses) {
    result.portfolio = {
      ...result.portfolio,
      ...data.portfolio,
    };

    result.personal = {
      ...result.personal,
      ...data.personal,
    };

    result.socials = {
      ...result.socials,
      ...data.socials,
    };

    if (data.techStack) {
      Object.keys(result.techStack).forEach((key) => {
        result.techStack[key] = mergeArrays([
          ...result.techStack[key],
          ...(data.techStack[key] || []),
        ]);
      });
    }

    result.skills.push(...(data.skills || []));
    result.experience.push(...(data.experience || []));
    result.projects.push(...(data.projects || []));
    result.education.push(...(data.education || []));
    result.certifications.push(...(data.certifications || []));
    result.achievements.push(...(data.achievements || []));
    result.publications.push(...(data.publications || []));
    result.volunteering.push(...(data.volunteering || []));
    result.languages.push(...(data.languages || []));
    result.interests.push(...(data.interests || []));
    result.references.push(...(data.references || []));

    result.seo = {
      ...result.seo,
      ...data.seo,
    };
  }

  result.skills = mergeArrays(result.skills);
  result.experience = mergeArrays(result.experience);
  result.projects = mergeArrays(result.projects);
  result.education = mergeArrays(result.education);
  result.certifications = mergeArrays(result.certifications);
  result.achievements = mergeArrays(result.achievements);
  result.publications = mergeArrays(result.publications);
  result.volunteering = mergeArrays(result.volunteering);
  result.languages = mergeArrays(result.languages);
  result.interests = mergeArrays(result.interests);
  result.references = mergeArrays(result.references);

  return result;
};