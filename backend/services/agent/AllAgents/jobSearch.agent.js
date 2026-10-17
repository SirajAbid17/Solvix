import { jobSearchTavily } from "../config/tavily.config.js";
import { GetModels } from "../config/aimodels.js";

const trimText = (text, maxChars = 300) => {
  if (!text) return "";
  const str = String(text).replace(/\s+/g, " ").trim();
  return str.length > maxChars ? str.slice(0, maxChars) + "..." : str;
};

const isJobFresh = (job, maxDaysOld = 3) => {
  const title = String(job.title || "").toLowerCase();
  const content = String(job.content || job.snippet || "").toLowerCase();
  const url = String(job.url || "").toLowerCase();
  const fullText = `${title} ${content} ${url}`;

  const oldPatterns = [
    /\b\d+\s*years?\s*ago\b/i,
    /\ba\s+year\s+ago\b/i,
    /\byears?\s+ago\b/i,
    /\b\d+\s*months?\s*ago\b/i,
    /\ba\s+month\s+ago\b/i,
    /\bmonths?\s+ago\b/i,
    /\b\d+\s*weeks?\s*ago\b/i,
    /\bweeks?\s+ago\b/i,
    /\bno\s+longer\s+accepting\b/i,
    /\bno\s+longer\s+available\b/i,
    /\bapplications?\s+closed\b/i,
    /\bposition\s+filled\b/i,
    /\bexpired\b/i,
    /\bjob\s+closed\b/i,
    /\blast\s+month\b/i,
    /\bold\s+job\b/i,
  ];

  for (const pattern of oldPatterns) {
    if (pattern.test(fullText)) {
      console.log(
        `    Old (relative): ${pattern.source} → ${title.slice(0, 50)}`,
      );
      return false;
    }
  }

  const freshPatterns = [
    /\b\d+\s*hours?\s*ago\b/i,
    /\b\d+\s*minutes?\s*ago\b/i,
    /\bjust\s+now\b/i,
    /\btoday\b/i,
    /\byesterday\b/i,
    /\bposted\s+today\b/i,
    /\bposted\s+yesterday\b/i,
    /\b\d+\s*days?\s*ago\b/i,
  ];

  for (const pattern of freshPatterns) {
    if (pattern.test(fullText)) {
      console.log(
        `    Fresh (relative): ${pattern.source} → ${title.slice(0, 50)}`,
      );
      return true;
    }
  }

  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - maxDaysOld);

  const monthNamePattern =
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b/gi;

  let match;
  while ((match = monthNamePattern.exec(fullText)) !== null) {
    const monthStr = match[1];
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const monthIndex = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ].indexOf(monthStr.toLowerCase().slice(0, 3));

    if (monthIndex !== -1) {
      const jobDate = new Date(year, monthIndex, day);
      const diffDays = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= maxDaysOld) {
        console.log(
          `    Fresh (date): ${match[0]} (${diffDays}d ago) → ${title.slice(0, 40)}`,
        );
        return true;
      } else if (diffDays > maxDaysOld) {
        console.log(
          `    Old (date): ${match[0]} (${diffDays}d ago) → ${title.slice(0, 40)}`,
        );
        return false;
      }
    }
  }

  const isoDatePattern = /\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/g;
  while ((match = isoDatePattern.exec(fullText)) !== null) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);

    const jobDate = new Date(year, month, day);
    const diffDays = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= maxDaysOld) {
      console.log(
        `   Fresh (ISO): ${match[0]} (${diffDays}d ago) → ${title.slice(0, 40)}`,
      );
      return true;
    } else if (diffDays > maxDaysOld && diffDays < 365) {
      console.log(
        `    Old (ISO): ${match[0]} (${diffDays}d ago) → ${title.slice(0, 40)}`,
      );
      return false;
    }
  }

  const usDatePattern = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;
  while ((match = usDatePattern.exec(fullText)) !== null) {
    const month = parseInt(match[1], 10) - 1;
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const jobDate = new Date(year, month, day);
    const diffDays = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= maxDaysOld) {
      console.log(
        `    Fresh (US): ${match[0]} (${diffDays}d ago) → ${title.slice(0, 40)}`,
      );
      return true;
    } else if (diffDays > maxDaysOld && diffDays < 365) {
      console.log(
        `    Old (US): ${match[0]} (${diffDays}d ago) → ${title.slice(0, 40)}`,
      );
      return false;
    }
  }

  console.log(`  No date found → rejecting: ${title.slice(0, 50)}`);
  return false;
};

export const JobSearchAgent = async (state) => {
  try {
    const userQuery = String(state.prompt || "").trim();
    const city = String(state.city || "").trim();
    const country = String(state.country || "").trim();

    if (!userQuery) {
      return {
        ...state,
        aiResponse: "Please provide a job role or keywords to search.",
        jobs: [],
      };
    }

    console.log(`Job Search: "${userQuery}"`);
    console.log(` City: ${city || "any"} | Country: ${country || "any"}`);

    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const todayStr = today.toISOString().split("T")[0];
    const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0];
    const locationStr = [city, country].filter(Boolean).join(", ");

    const searchQuery = `
${userQuery} job hiring ${locationStr ? `in ${locationStr}` : "in Pakistan"}
posted in the last 3 days
latest openings ${threeDaysAgoStr} to ${todayStr}

Priority sources: rozee.pk, mustakbil.com, linkedin.com/jobs, indeed.com

Only jobs posted within last 3 days.
Include posting date in results.
Reject: jobs older than 3 days, closed jobs, search pages, blogs.
`;

    const tavilyResponse = await jobSearchTavily.invoke({
      query: searchQuery,
    });

    console.log("Tavily response received");

    const rawResults =
      tavilyResponse?.results || tavilyResponse?.data || tavilyResponse || [];

    if (!Array.isArray(rawResults) || rawResults.length === 0) {
      return {
        ...state,
        aiResponse: `No recent job postings found for "${userQuery}". Try different keywords.`,
        jobs: [],
      };
    }

    console.log(`Raw results: ${rawResults.length}`);

    const jobUrlPatterns = [
      /linkedin\.com\/jobs\/view/i,
      /indeed\.com\/(viewjob|rc\/clk|jobs)/i,
      /glassdoor\.com\/job-listing/i,
      /wellfound\.com\/jobs/i,
      /remoteok\.com\/remote-jobs/i,
      /greenhouse\.io\/.*\/jobs/i,
      /lever\.co\/.*\//i,
      /ashbyhq\.com\/.*\//i,
      /jobs\./i,
      /careers\./i,
      /\/jobs?\//i,
      /\/careers?\//i,
      /naukri\.com\/job-listings/i,
      /rozee\.pk\/job/i,
      /mustakbil\.com\/jobs/i,
    ];

    let validJobs = rawResults.filter((r) => {
      const url = String(r.url || "").toLowerCase();
      const title = String(r.title || "").toLowerCase();

      const hasJobUrl = jobUrlPatterns.some((p) => p.test(url));
      const isNotSearchPage =
        !url.includes("/search?") &&
        !url.includes("/jobs?") &&
        !url.includes("?q=");
      const titleLooksLikeJob =
        title.length > 0 &&
        !title.includes("job search") &&
        !title.includes("find jobs") &&
        !title.includes("top jobs") &&
        !title.includes("career advice") &&
        !title.includes("career tips") &&
        !title.includes("resume tips") &&
        !title.includes("salary guide");

      return hasJobUrl && isNotSearchPage && titleLooksLikeJob;
    });

    console.log(`After URL filter: ${validJobs.length}`);

    console.log(`Applying strict freshness filter (max 3 days)...`);
    validJobs = validJobs.filter((job) => isJobFresh(job, 3));

    console.log(`After freshness filter: ${validJobs.length}`);

    validJobs = validJobs.slice(0, 8);

    if (validJobs.length === 0) {
      console.log(`No jobs in 3 days — trying 7-day window`);

      const widerQuery = `
${userQuery} jobs ${locationStr ? `in ${locationStr}` : "in Pakistan"}
posted in the last 7 days
`;

      try {
        const widerResponse = await jobSearchTavily.invoke({
          query: widerQuery,
        });

        const widerRaw =
          widerResponse?.results || widerResponse?.data || widerResponse || [];

        let widerJobs = widerRaw.filter((r) => {
          const url = String(r.url || "").toLowerCase();
          const title = String(r.title || "").toLowerCase();
          const hasJobUrl = jobUrlPatterns.some((p) => p.test(url));
          return (
            hasJobUrl &&
            !url.includes("/search?") &&
            !url.includes("?q=") &&
            title.length > 0 &&
            !title.includes("job search")
          );
        });

        widerJobs = widerJobs.filter((job) => isJobFresh(job, 7));

        console.log(` 7-day window results: ${widerJobs.length}`);

        if (widerJobs.length > 0) {
          validJobs = widerJobs.slice(0, 8);
        }
      } catch (widerErr) {
        console.error("7-day fallback failed:", widerErr.message);
      }
    }

    if (validJobs.length === 0) {
      return {
        ...state,
        aiResponse: ` No fresh "${userQuery}" jobs found in the last 3-7 days${locationStr ? ` in ${locationStr}` : ""}.

**Why:**
• No new postings for this role on LinkedIn/Rozee
• Tavily is returning old indexed jobs

**What to do:**
• Try broader keywords (e.g. "Developer" instead of "Senior Full Stack Engineer")
• Check Rozee.pk directly: https://www.rozee.pk
• Use the "Past 24 hours" filter on LinkedIn
• Try again tomorrow — new jobs are posted daily`,
        jobs: [],
      };
    }

    const trimmedJobs = validJobs.map((job) => ({
      title: trimText(job.title, 150),
      url: trimText(job.url, 300),
      content: trimText(job.content || job.snippet || "", 250),
    }));

    const llm = await GetModels("chat");

    const todayFormatted = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const structuringPrompt = `Today is ${todayFormatted}.

Extract ONLY genuine job postings posted in the last 3 days from the results below.

Request: "${userQuery}" in ${locationStr || "Pakistan"}

Results:
${JSON.stringify(trimmedJobs)}

Return ONLY valid JSON array (no markdown). Max 10 jobs, min 3.
Format: [{"title":"","company":"","location":"","salary":"","description":"","url":"","jobType":"","postedAt":""}]

STRICT RULES:
- Reject jobs older than 3 days
- Reject jobs with "1 year ago", "6 months ago", "weeks ago"
- Reject closed/expired jobs
- Only jobs with title + company
- postedAt must be: "Today" / "Yesterday" / "1 day ago" / "2 days ago" / "3 days ago"
- If you cannot find ≥3 fresh jobs, return as many as you find (min 1)`;

    const llmResponse = await llm.invoke(structuringPrompt);

    let content = llmResponse?.content;
    if (Array.isArray(content)) {
      content = content
        .map((i) => (typeof i === "string" ? i : i?.text || ""))
        .join("");
    }
    content = String(content || "").trim();

    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const arrStart = content.indexOf("[");
    const arrEnd = content.lastIndexOf("]");

    let jobs = [];

    if (arrStart !== -1 && arrEnd > arrStart) {
      try {
        const jsonStr = content.substring(arrStart, arrEnd + 1);
        jobs = JSON.parse(jsonStr);
      } catch (err) {
        console.error("JSON parse error:", err.message);
        jobs = [];
      }
    }

    jobs = (Array.isArray(jobs) ? jobs : [])
      .filter((job) => {
        if (!job || typeof job !== "object") return false;
        if (!job.title || !job.company || !job.url || !job.description)
          return false;
        if (String(job.description).length < 40) return false;

        const postedAt = String(job.postedAt || "").toLowerCase();
        if (
          postedAt.includes("month") ||
          postedAt.includes("year") ||
          postedAt.includes("week")
        ) {
          return false;
        }

        return true;
      })
      .slice(0, 10);

    if (jobs.length < 3) {
      console.log(` Only ${jobs.length} jobs — fallback`);

      const existingUrls = new Set(jobs.map((j) => j.url));

      validJobs.forEach((r) => {
        if (jobs.length >= 6) return;
        if (existingUrls.has(r.url)) return;

        const cleanTitle = String(r.title || "")
          .replace(/\s*[-|]\s*.*$/, "")
          .trim();

        jobs.push({
          title: cleanTitle || "Position Available",
          company: "See details",
          location:
            city && country
              ? `${city}, ${country}`
              : locationStr || "Not specified",
          salary: "Not specified",
          description:
            trimText(r.content || r.snippet || "", 300) ||
            "Click to view full job details",
          url: r.url,
          jobType: "Not specified",
          postedAt: "Recently",
        });
      });
    }

    console.log(`Final jobs: ${jobs.length}`);

    if (jobs.length === 0) {
      return {
        ...state,
        aiResponse: `No fresh jobs found for "${userQuery}"${locationStr ? ` in ${locationStr}` : ""}.

Try:
• Broader keywords
• Rozee.pk directly
• Again tomorrow`,
        jobs: [],
      };
    }

    return {
      ...state,
      aiResponse: `Found ${jobs.length} fresh job${jobs.length > 1 ? "s" : ""}${locationStr ? ` in ${locationStr}` : ""} for "${userQuery}" (last 3 days) `,
      jobs,
    };
  } catch (error) {
    console.error(" JobSearchAgent error:", error);

    const msg = String(error?.message || "");
    const isRateLimit =
      msg.includes("413") ||
      msg.includes("429") ||
      msg.toLowerCase().includes("rate limit") ||
      msg.toLowerCase().includes("too large");

    return {
      ...state,
      aiResponse: isRateLimit
        ? " Job search temporarily paused (server busy). Please try again in a minute."
        : `Job search failed: ${error.message}`,
      jobs: [],
    };
  }
};
