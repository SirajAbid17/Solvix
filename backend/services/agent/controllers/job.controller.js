
import { JobSearchAgent } from "../AllAgents/jobSearch.agent.js";
import {
  canUserSearchJobs,
  setSearchCooldown,
  cacheJobResults,
  getCachedJobResults,
  formatRemainingTime,
} from "../utlis/jobCache.js";


export const searchJobs = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { query, city, country } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    
    const cooldown = await canUserSearchJobs(userId);

    if (!cooldown.allowed) {
      const timeRemaining = formatRemainingTime(cooldown.remainingSeconds);
      const cached = await getCachedJobResults(userId);

      console.log(`Cooldown active: ${timeRemaining}`);

      return res.status(429).json({
        success: false,
        message: `You have already searched for jobs today. Please wait ${timeRemaining} before searching again.`,
        nextAvailableAt: cooldown.nextAvailableAt,
        remainingSeconds: cooldown.remainingSeconds,
        timeRemaining,
        cachedResults: cached?.jobs || [],
      });
    }

  
    const result = await JobSearchAgent({
      prompt: query.trim(),
      city: city?.trim() || "",
      country: country?.trim() || "",
      userId,
    });

    const jobs = result?.jobs || [];

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: result?.aiResponse || "No jobs found",
        jobs: [],
        query: query.trim(),
      });
    }

   
    await setSearchCooldown(userId);
    await cacheJobResults(userId, query.trim(), jobs);

    console.log(` Found ${jobs.length} jobs — cooldown set`);

    return res.status(200).json({
      success: true,
      message: result?.aiResponse || `Found ${jobs.length} jobs`,
      jobs,
      query: query.trim(),
      city: city?.trim() || "",
      country: country?.trim() || "",
      cachedAt: new Date().toISOString(),
      nextSearchAllowedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    console.error(" searchJobs error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Job search failed",
    });
  }
};


export const getJobSearchStatus = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const cooldown = await canUserSearchJobs(userId);
    const cached = await getCachedJobResults(userId);

    return res.status(200).json({
      success: true,
      canSearch: cooldown.allowed,
      timeRemaining: cooldown.allowed
        ? null
        : formatRemainingTime(cooldown.remainingSeconds),
      remainingSeconds: cooldown.remainingSeconds,
      nextAvailableAt: cooldown.nextAvailableAt,
      cachedJobs: cached?.jobs || [],
      cachedQuery: cached?.query || null,
      cachedAt: cached?.cachedAt || null,
    });
  } catch (error) {
    console.error(" getJobSearchStatus error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};