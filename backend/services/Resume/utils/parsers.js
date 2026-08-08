// utils/parsers.js

export const parseBody = (body) => {
  if (body.data) {
    try {
      return JSON.parse(body.data);
    } catch (e) {
      return body;
    }
  }
  return body;
};

export const parseSkills = (skills) => {
  if (!skills) {
    return {
      technical: [],
      soft: [],
      tools: [],
      frameworks: [],
      databases: [],
      cloud: [],
      languages: [],
    };
  }

  if (typeof skills === "object" && !Array.isArray(skills)) {
    return {
      technical: skills.technical || [],
      soft: skills.soft || [],
      tools: skills.tools || [],
      frameworks: skills.frameworks || [],
      databases: skills.databases || [],
      cloud: skills.cloud || [],
      languages: skills.languages || [],
    };
  }

  if (typeof skills === "string") {
    const skillArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      technical: skillArray,
      soft: [],
      tools: [],
      frameworks: [],
      databases: [],
      cloud: [],
      languages: [],
    };
  }

  if (Array.isArray(skills)) {
    return {
      technical: skills,
      soft: [],
      tools: [],
      frameworks: [],
      databases: [],
      cloud: [],
      languages: [],
    };
  }

  return {
    technical: [],
    soft: [],
    tools: [],
    frameworks: [],
    databases: [],
    cloud: [],
    languages: [],
  };
};

export const parseStructuredData = (data, type = "experience") => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item => formatEntry(item, type));
  }
  
  if (type === "volunteering") {
    return parseVolunteering(data);
  }
  
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.map(item => formatEntry(item, type));
    } catch (e) {
      return parseStructuredText(data, type);
    }
  }
  return [];
};

const parseStructuredText = (data, type) => {
  const lines = data.split("\n").filter((l) => l.trim());
  const result = [];
  let current = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      if (value) {
        handleStructuredField(current, result, key, value, type);
      }
    } else if (Object.keys(current).length > 0 && trimmed) {
      appendToCurrent(current, trimmed);
    }
  }

  if (Object.keys(current).length > 0) {
    result.push(formatEntry(current, type));
  }

  return result;
};

const handleStructuredField = (current, result, key, value, type) => {
  const keyLower = key.toLowerCase().trim();

  if (type === "projects" || type === "project") {
    if (keyLower === "project" || keyLower === "title") {
      if (Object.keys(current).length > 0) {
        result.push(formatEntry(current, type));
      }
      current = { title: value };
    } else {
      current[keyLower] = value;
    }
  } else if (["company", "institution", "title", "name", "organization", "publisher", "role", "position"].includes(keyLower)) {
    if (Object.keys(current).length > 0) {
      result.push(formatEntry(current, type));
    }
    if (keyLower === "name" && type === "projects") {
      current = { title: value };
    } else {
      current = { [keyLower]: value };
    }
  } else {
    current[keyLower] = value;
  }
};

const appendToCurrent = (current, trimmed) => {
  if (current.description) {
    current.description += " " + trimmed;
  } else if (current.details) {
    current.details += " " + trimmed;
  } else {
    current.description = trimmed;
  }
};

export const formatEntry = (entry, type) => {
  const formatted = { ...entry };

  if (type === "experience" || type === "workExperience") {
    formatExperienceEntry(formatted);
  } else if (type === "education") {
    formatEducationEntry(formatted);
  } else if (type === "project" || type === "projects") {
    formatProjectEntry(formatted);
  }

  return formatted;
};

const formatExperienceEntry = (formatted) => {
  if (!formatted.startDate) {
    if (formatted.duration) {
      const yearMatch = formatted.duration.match(/\d{4}/);
      if (yearMatch) {
        formatted.startDate = new Date(`${yearMatch[0]}-01-01`);
      } else {
        formatted.startDate = new Date("2020-01-01");
      }
    } else {
      formatted.startDate = new Date("2020-01-01");
    }
  }
  if (!formatted.position) formatted.position = formatted.title || "Position";
  if (!formatted.company) formatted.company = "Company";
  if (!formatted.description) formatted.description = "";
};

const formatEducationEntry = (formatted) => {
  if (!formatted.startDate) {
    if (formatted.year) {
      const yearMatch = formatted.year.match(/\d{4}/);
      if (yearMatch) {
        formatted.startDate = new Date(`${yearMatch[0]}-01-01`);
      } else {
        formatted.startDate = new Date("2020-01-01");
      }
    } else {
      formatted.startDate = new Date("2020-01-01");
    }
  }
  if (!formatted.institution) formatted.institution = "Institution";
  if (!formatted.degree) formatted.degree = "Degree";
  if (!formatted.field) formatted.field = "Field";
  if (!formatted.description) formatted.description = "";
};

const formatProjectEntry = (formatted) => {
  if (!formatted.title) {
    formatted.title = formatted.name || "Project";
  }
  if (!formatted.description) {
    formatted.description = formatted.details || "Project description";
  }
  if (formatted.technologies && typeof formatted.technologies === "string") {
    formatted.technologies = formatted.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (!formatted.technologies) {
    formatted.technologies = [];
  }
};

// Volunteering specific parser
export const parseVolunteering = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item => normalizeVolunteeringItem(item));
  }
  
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(item => normalizeVolunteeringItem(item));
      }
      return [normalizeVolunteeringItem(parsed)];
    } catch (e) {
      return parseVolunteeringText(data);
    }
  }
  
  return [];
};

const normalizeVolunteeringItem = (item) => {
  return {
    organization: item.organization || item.Organization || "",
    role: item.role || item.Role || "",
    startDate: item.startDate || item.StartDate || null,
    endDate: item.endDate || item.EndDate || null,
    current: item.current || item.Current || false,
    description: item.description || item.Description || "",
  };
};

const parseVolunteeringText = (data) => {
  const lines = data.split("\n").filter((l) => l.trim());
  const result = [];
  let current = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key === "organization") {
        if (Object.keys(current).length > 0) {
          result.push(normalizeVolunteeringItem(current));
        }
        current = { organization: value };
      } else if (key === "role") {
        current.role = value;
      } else if (key === "duration") {
        const dates = parseDuration(value);
        if (dates) {
          current.startDate = dates.startDate;
          current.endDate = dates.endDate;
          if (dates.current) current.current = true;
        }
      } else if (key === "startdate" || key === "start date") {
        current.startDate = value;
      } else if (key === "enddate" || key === "end date") {
        current.endDate = value;
      } else if (key === "current") {
        current.current = value.toLowerCase() === "true" || value.toLowerCase() === "yes";
      } else if (key === "description") {
        current.description = value;
      } else {
        current[key] = value;
      }
    } else if (Object.keys(current).length > 0 && trimmed) {
      current.description = current.description ? current.description + " " + trimmed : trimmed;
    }
  }

  if (Object.keys(current).length > 0) {
    result.push(normalizeVolunteeringItem(current));
  }

  return result;
};

const parseDuration = (duration) => {
  if (!duration) return null;
  
  const match = duration.match(/(\d{4})\s*[-–—]\s*(\d{4})/);
  if (match) {
    return {
      startDate: new Date(`${match[1]}-01-01`),
      endDate: new Date(`${match[2]}-01-01`),
    };
  }
  
  const presentMatch = duration.match(/(\d{4})\s*[-–—]\s*Present/i);
  if (presentMatch) {
    return {
      startDate: new Date(`${presentMatch[1]}-01-01`),
      endDate: null,
      current: true,
    };
  }
  
  return null;
};

export const parseCertifications = (data) => {
  if (!data) return [];

  let certArray = getArrayFromData(data);

  return certArray.map((cert) => {
    if (typeof cert === "object" && cert.title) {
      return {
        title: cert.title,
        organization: cert.organization || "Unknown Organization",
        issueDate: cert.issueDate || new Date(),
        credentialId: cert.credentialId || "",
        credentialUrl: cert.credentialUrl || "",
        skills: cert.skills || [],
        isActive: true,
      };
    }
    return {
      title: typeof cert === "string" ? cert : "Certification",
      organization: "Unknown Organization",
      issueDate: new Date(),
      credentialId: "",
      credentialUrl: "",
      skills: [],
      isActive: true,
    };
  });
};

export const parseLanguages = (data) => {
  if (!data) return [];

  let langArray = getArrayFromData(data);

  return langArray.map((lang) => {
    if (typeof lang === "object" && lang.language) {
      return {
        language: lang.language,
        level: lang.level || "Intermediate",
        proficiency: lang.proficiency || 50,
        isNative: lang.isNative || false,
      };
    }
    return {
      language: typeof lang === "string" ? lang : "Language",
      level: "Intermediate",
      proficiency: 50,
      isNative: false,
    };
  });
};

export const parseAwards = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return parseAwardsText(data);
    }
  }
  return [];
};

const parseAwardsText = (data) => {
  const lines = data.split("\n").filter((l) => l.trim());
  const result = [];
  let current = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key === "title") {
        if (Object.keys(current).length > 0) {
          finalizeAward(current, result);
        }
        current = { title: value || "Untitled Award" };
      } else {
        current[key] = value;
      }
    } else if (Object.keys(current).length > 0 && trimmed) {
      current.description = current.description ? current.description + " " + trimmed : trimmed;
    }
  }

  if (Object.keys(current).length > 0) {
    finalizeAward(current, result);
  }

  return result;
};

const finalizeAward = (current, result) => {
  if (!current.organization) current.organization = "Unknown Organization";
  if (!current.year) current.year = new Date().getFullYear().toString();
  if (!current.title) current.title = "Untitled Award";
  result.push({ ...current });
};

export const parsePublications = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return parsePublicationsText(data);
    }
  }
  return [];
};

const parsePublicationsText = (data) => {
  const lines = data.split("\n").filter((l) => l.trim());
  const result = [];
  let current = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key === "title") {
        if (Object.keys(current).length > 0) {
          finalizePublication(current, result);
        }
        current = { title: value || "Untitled Publication" };
      } else if (key === "date" && value) {
        try {
          const parsedDate = new Date(value);
          current.date = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
        } catch (err) {
          current.date = new Date();
        }
      } else {
        current[key] = value;
      }
    } else if (Object.keys(current).length > 0 && trimmed) {
      current.description = current.description ? current.description + " " + trimmed : trimmed;
    }
  }

  if (Object.keys(current).length > 0) {
    finalizePublication(current, result);
  }

  return result;
};

const finalizePublication = (current, result) => {
  if (!current.date) current.date = new Date();
  if (!current.publisher) current.publisher = "Unknown Publisher";
  if (!current.title) current.title = "Untitled Publication";
  result.push({ ...current });
};

export const parseReferences = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    return parseReferencesText(data);
  }
  return [];
};

const parseReferencesText = (data) => {
  const lines = data.split("\n").filter((l) => l.trim());
  const result = [];
  let current = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key === "name") {
        if (Object.keys(current).length > 0) {
          finalizeReference(current, result);
        }
        current = { name: value || "Unknown Reference" };
      } else {
        current[key] = value;
      }
    } else if (Object.keys(current).length > 0 && trimmed) {
      current.description = current.description ? current.description + " " + trimmed : trimmed;
    }
  }

  if (Object.keys(current).length > 0) {
    finalizeReference(current, result);
  }

  return result;
};

const finalizeReference = (current, result) => {
  if (!current.designation) current.designation = "Unknown";
  if (!current.email) current.email = "";
  if (!current.phone) current.phone = "";
  if (!current.name) current.name = "Unknown Reference";
  result.push({ ...current });
};

export const parseCustomSections = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return parseCustomSectionsText(data);
    }
  }
  return [];
};

const parseCustomSectionsText = (data) => {
  const lines = data.split("\n").filter((l) => l.trim());
  const result = [];
  let current = { title: "", content: "", items: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key === "title" || key === "section") {
        if (current.title) {
          result.push({ ...current });
        }
        current = { title: value, content: "", items: [] };
      } else if (key === "content" || key === "description") {
        current.content = value;
      } else if (key === "items" || key === "item") {
        if (value) {
          current.items = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      } else {
        current[key] = value;
      }
    } else if (current.title && trimmed) {
      current.content = current.content ? current.content + " " + trimmed : trimmed;
    }
  }

  if (current.title) {
    result.push({ ...current });
  }

  return result;
};

export const parseArrayData = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return data
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [data];
};

const getArrayFromData = (data) => {
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return data
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};