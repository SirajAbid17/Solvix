import { serpApiConfig, jobSearchTavily } from "../config/tavily.config.js";
import { GetModels } from "../config/aimodels.js";

const trimText = (text, maxChars = 300) => {
  if (!text) return "";
  const str = String(text).replace(/\s+/g, " ").trim();
  return str.length > maxChars ? str.slice(0, maxChars) + "..." : str;
};

const extractEmails = (text) => {
  if (!text) return [];
  const re = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const found = String(text).match(re) || [];

  const blocked = [
    "example.com", "sentry.io", "wixpress.com", "schema.org",
    "noreply", "no-reply", "donotreply", "wordpress",
    "linkedin.com", "indeed.com", "glassdoor.com",
  ];

  return [
    ...new Set(
      found
        .map((e) => e.toLowerCase().trim())
        .filter((e) => {
          if (blocked.some((b) => e.includes(b))) return false;
          if (/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(e)) return false;
          if (!/\.(com|pk|org|net|io|co|ai|dev|info|biz|me|tech|cloud|site|online|app)$/i.test(e)) return false;
          return true;
        })
    ),
  ];
};

const isNotSearchPage = (url, title) => {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (/linkedin\.com\/(posts|pulse|feed\/update)\//i.test(lowerUrl)) return true;

  if (lowerUrl.includes("/search?") || lowerUrl.includes("/jobs?")) return false;
  if (lowerUrl.includes("?q=") || lowerUrl.includes("&q=")) return false;

  const badTitlePatterns = [
    /^\d+\+?\s+.*jobs?\s+in/i,
    /\bjobs?\s+in\s+(lahore|karachi|islamabad|pakistan)/i,
    /\bopen\s+roles\b/i,
    /\bjob\s+search\b/i,
    /\bfind\s+jobs?\b/i,
    /\btop\s+jobs?\b/i,
    /\bcareer\s+(advice|tips)\b/i,
    /\bresume\s+tips\b/i,
    /\bsalary\s+guide\b/i,
    /\bemployment\b.*\bjobs?\b/i,
    /\bvacancies\s+in\b/i,
    /^\d+\s+.*jobs\s*[-|]/i,
  ];

  if (badTitlePatterns.some((p) => p.test(lowerTitle))) return false;

  const badUrlPatterns = [
    /\/jobs\?/i, /\/job-search/i, /\/jobsearch/i,
    /\/search\/jobs/i, /\/q-.*-jobs/i, /\/jobs-in-/i, /\/jobs\/in-/i,
  ];

  if (badUrlPatterns.some((p) => p.test(lowerUrl))) return false;

  return true;
};


const isJobFresh = (job, maxDaysOld = 10) => {
  const text = [
    job.title, job.description, job.content, job.snippet,
    job.postedAt, job.rawContent, job.raw_content, job.url,
  ].filter(Boolean).join(" ").toLowerCase();

  const oldPatterns = [
    /\b\d+\s*years?\s*ago\b/i,
    /\ba\s+year\s+ago\b/i,
    /\byears?\s+ago\b/i,
    /\b\d+\s*months?\s*ago\b/i,
    /\ba\s+month\s+ago\b/i,
    /\bmonths?\s+ago\b/i,
    /\bno\s+longer\s+(accepting|available)\b/i,
    /\bapplications?\s+closed\b/i,
    /\bposition\s+filled\b/i,
    /\bjob\s+closed\b/i,
    /\bexpired\b/i,
  ];
  if (oldPatterns.some((p) => p.test(text))) return false;

  const daysAgoMatch = text.match(/(\d+)\s*days?\s*ago/i);
  if (daysAgoMatch) {
    const days = parseInt(daysAgoMatch[1], 10);
    if (days > maxDaysOld) return false;
  }

  const freshPatterns = [
    /\b\d+\s*(hour|minute)s?\s*ago\b/i,
    /\b(just\s+now|today|yesterday)\b/i,
    /\bposted\s+(today|yesterday)\b/i,
    /\b\d+\s*days?\s*ago\b/i,
    /\b\d+\s*weeks?\s*ago\b/i,
  ];
  if (freshPatterns.some((p) => p.test(text))) return true;

  const monthYear =
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})?,?\s*(\d{4})\b/gi;
  let m;
  while ((m = monthYear.exec(text)) !== null) {
    const monthIdx = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
      .indexOf(m[1].toLowerCase().slice(0, 3));
    if (monthIdx !== -1) {
      const day = m[2] ? parseInt(m[2], 10) : 1;
      const year = parseInt(m[3], 10);
      const diffDays = Math.floor((Date.now() - new Date(year, monthIdx, day)) / 86400000);
      if (diffDays >= -1 && diffDays <= maxDaysOld) return true;
      if (diffDays > maxDaysOld) return false;
    }
  }

  return true;
};

const extractCompany = (title, text) => {
  const t = String(title || "");
  const blob = String(text || "").slice(0, 500);

  let m = t.match(/^(.+?)\s+(?:is\s+)?hiring/i);
  if (m) return m[1].trim().slice(0, 100);

  m = t.match(/\bat\s+([A-Z][A-Za-z0-9&.\s]{2,40})(?:\s*[-|—]|$)/);
  if (m) return m[1].trim().slice(0, 100);

  m = t.match(/^([A-Z][A-Za-z0-9&.\s]{2,40})\s*[-—|]/);
  if (m) return m[1].trim().slice(0, 100);

  const emailMatch = blob.match(/@([a-z0-9-]+)\./i);
  if (emailMatch) {
    const domain = emailMatch[1];
    if (domain.length > 3 && !["gmail", "yahoo", "hotmail", "outlook"].includes(domain)) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  return "See details";
};

const cleanTitle = (title) => {
  return String(title || "")
    .replace(/\s*[-|—]\s*.*$/, "")
    .replace(/^\d+\+?\s+/, "")
    .replace(/\s+(jobs?\s+in\s+.*)$/i, "")
    .replace(/\s+hiring\s+.*$/i, "")
    .replace(/\s*\|\s*.*$/, "")
    .trim()
    .slice(0, 150);
};


const sanitizeQuery = (q) => {
  const stopWords = /\b(find|findme|worldwide|jobs?|job|opportunities|opportunity|prioritizing|remote|and|or|the|a|an|in|for|with|at|on|of|to|me|please|search|show|give)\b/gi;
  const cleaned = String(q || "")
    .replace(stopWords, " ")
    .replace(/[^\w\s+#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length >= 3 ? cleaned.slice(0, 100) : String(q || "").slice(0, 100);
};


async function searchWithSerpApi(query, city, country) {
  const apiKey = serpApiConfig.apiKey;
  if (!apiKey) {
    console.warn("SERPAPI_API_KEY not set, skipping SerpApi");
    return [];
  }

  const serpQuery = sanitizeQuery(query);
  const location = [city, country].filter(Boolean).join(", ");
  const params = new URLSearchParams({
    api_key: apiKey,
    engine: "google_jobs",
    q: serpQuery,
    location: location || "Pakistan",
    hl: "en",
    gl: "pk",
    chips: "date_posted:week",
    num: "20",
  });

  const url = `${serpApiConfig.baseUrl}?${params.toString()}`;
  console.log(`   SerpApi query: "${serpQuery}"`);
  console.log(`   SerpApi: ${url.slice(0, 130)}...`);

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const jobs = data.jobs_results || [];
    console.log(`   SerpApi returned ${jobs.length} jobs`);

    return jobs.map((j) => ({
      title: j.title || "",
      company: j.company_name || "",
      location: j.location || location,
      description: j.description || "",
      url: j.share_link || j.apply_options?.[0]?.link || "",
      postedAt: j.detected_extensions?.posted_at || "Recently",
      via: j.via || "",
      extensions: j.extensions || [],
    }));
  } catch (err) {
    console.error("SerpApi search failed:", err.message);
    return [];
  }
}


async function searchWithTavily(query, city, country) {
  const location = [city, country].filter(Boolean).join(", ");

  const postsQuery = `site:linkedin.com/posts "${query}" (hiring OR "send your CV" OR "send resume" OR "email your" OR "apply at" OR "dm me") ${city || country}`;
  const jobsQuery = `${query} job ${city || country} hiring apply careers email`;

  const [postsResult, jobsResult] = await Promise.allSettled([
    jobSearchTavily.invoke({ query: postsQuery }).catch((e) => {
      console.error("Posts search failed:", e.message);
      return null;
    }),
    jobSearchTavily.invoke({ query: jobsQuery }).catch((e) => {
      console.error("Jobs search failed:", e.message);
      return null;
    }),
  ]);

  const postsData =
    postsResult.status === "fulfilled"
      ? postsResult.value?.results || postsResult.value?.data || []
      : [];
  const jobsData =
    jobsResult.status === "fulfilled"
      ? jobsResult.value?.results || jobsResult.value?.data || []
      : [];

  const seen = new Set();
  const merged = [];
  for (const r of [...postsData, ...jobsData]) {
    const url = String(r.url || "");
    if (!url || seen.has(url)) continue;
    seen.add(url);
    merged.push({
      title: r.title || "",
      company: "",
      location: location,
      description: r.content || r.snippet || r.rawContent || r.raw_content || "",
      url: r.url,
      postedAt: "Recently",
      via: "tavily",
      extensions: [],
    });
  }
  console.log(`   Tavily returned ${merged.length} jobs`);
  return merged;
}


export const JobSearchAgent = async (state) => {
  try {
    const userQuery = String(state.prompt || "").trim();
    const city = String(state.city || "").trim();
    const country = String(state.country || "").trim() || "Pakistan";

    if (!userQuery) {
      return { ...state, aiResponse: "Please provide job keywords.", jobs: [] };
    }

    console.log(`\n Job Search: "${userQuery}"`);
    console.log(`   Location: ${city || "any"}, ${country}`);

    
    let rawJobs = await searchWithSerpApi(userQuery, city, country);

   
    if (rawJobs.length < 10) {
      console.log(`   SerpApi only ${rawJobs.length} jobs, falling back to Tavily...`);
      const tavilyJobs = await searchWithTavily(userQuery, city, country);
      const seen = new Set(rawJobs.map((j) => j.url).filter(Boolean));
      for (const tj of tavilyJobs) {
        if (tj.url && !seen.has(tj.url)) {
          rawJobs.push(tj);
          seen.add(tj.url);
        }
      }
      console.log(`   After Tavily merge: ${rawJobs.length} total`);
    }

    
    let validJobs = rawJobs.filter((j) => {
      if (!j.title || !j.url) return false;
      if (!isNotSearchPage(j.url, j.title)) return false;
      return true;
    });
    console.log(`   After URL filter: ${validJobs.length}`);

   
    const beforeFresh = validJobs.length;
    validJobs = validJobs.filter((j) => isJobFresh(j, 10));
    console.log(`   Freshness filter (10 days): ${beforeFresh} → ${validJobs.length}`);

 
    if (validJobs.length < 10) {
      const usedUrls = new Set(validJobs.map((j) => j.url));
      const remaining = rawJobs.filter(
        (j) => j.title && j.url && !usedUrls.has(j.url) && isNotSearchPage(j.url, j.title)
      );
      const needed = 10 - validJobs.length;
      validJobs = [...validJobs, ...remaining.slice(0, needed)];
      console.log(`   Padded to minimum 10: ${validJobs.length} jobs`);
    }

    if (validJobs.length === 0) {
      return {
        ...state,
        aiResponse: `No results found for "${userQuery}". Try broader keywords like "MERN Developer".`,
        jobs: [],
      };
    }

  
    const withEmail = [];
    const withoutEmail = [];

    for (const job of validJobs) {
      const blob = [
        job.title, job.company, job.description, job.content,
        job.snippet, job.rawContent, job.raw_content, job.url,
      ].filter(Boolean).join(" ");

      const emails = extractEmails(blob);
      const company = job.company || extractCompany(job.title, blob);
      const cleanT = cleanTitle(job.title);

      const base = {
        id: `job_${withEmail.length + withoutEmail.length + 1}_${Date.now()}`,
        title: cleanT || "Developer Position",
        company,
        location: job.location || [city, country].filter(Boolean).join(", "),
        salary: "Not specified",
        description: trimText(job.description || job.content || job.snippet || "", 400) || "Click to view full details",
        url: job.url,
        jobType: "Not specified",
        postedAt: job.postedAt || "Recently",
      };

      if (emails.length > 0) {
        const preferred =
          emails.find((e) => /(career|hiring|hr|jobs|recruit|talent|apply|contact|info)/i.test(e)) ||
          emails[0];
        withEmail.push({ ...base, email: preferred, allEmails: emails, status: "Email ready" });
        console.log(`     ${preferred} → ${cleanT.slice(0, 40)} @ ${company.slice(0, 25)}`);
      } else {
        withoutEmail.push({ ...base, email: null, status: "Apply on site" });
      }
    }

    const finalJobs = [...withEmail, ...withoutEmail].slice(0, 15);

 
    try {
      const llm = await GetModels("chat");
      const llmPrompt = `You are a job data cleaner. Given these jobs with emails, improve ONLY the title and company fields. Return JSON array.

Jobs:
${JSON.stringify(
  finalJobs.slice(0, 10).map((j) => ({
    title: j.title,
    company: j.company,
    description: j.description.slice(0, 200),
    email: j.email,
  })),
  null,
  2
)}

Return ONLY:
[{"title":"Clean professional title","company":"Company name"}]

Rules:
- Clean title: "MERN Stack Developer" not "X hiring MERN in Lahore"
- Company: extract real name from title/description/email domain
- Return same number of items
- No markdown, no explanation, ONLY JSON array`;

      const llmRes = await llm.invoke(llmPrompt);
      let c = llmRes?.content;
      if (Array.isArray(c)) c = c.map((i) => (typeof i === "string" ? i : i?.text || "")).join("");
      c = String(c || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

      const s = c.indexOf("[");
      const e = c.lastIndexOf("]");
      if (s !== -1 && e > s) {
        const improved = JSON.parse(c.substring(s, e + 1));
        if (Array.isArray(improved)) {
          improved.forEach((im, idx) => {
            if (finalJobs[idx]) {
              if (im.title) finalJobs[idx].title = String(im.title).slice(0, 150);
              if (im.company) finalJobs[idx].company = String(im.company).slice(0, 100);
            }
          });
          console.log(`    LLM improved ${improved.length} titles`);
        }
      }
    } catch (llmErr) {
      console.warn("LLM cleanup skipped:", llmErr.message);
    }

    const emailCount = finalJobs.filter((j) => j.email).length;
    console.log(`  FINAL: ${finalJobs.length} jobs (${emailCount} with email)`);

    return {
      ...state,
      aiResponse: `Found ${finalJobs.length} job${finalJobs.length > 1 ? "s" : ""} for "${userQuery}" (last 10 days, ${emailCount} with direct email) — ready to apply!`,
      jobs: finalJobs,
    };
  } catch (error) {
    console.error("JobSearchAgent error:", error);
    return { ...state, aiResponse: `Job search failed: ${error.message}`, jobs: [] };
  }
};