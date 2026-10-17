
import api from "../utlis/axios";

export const searchJobs = async ({ query, city, country }) => {
  try {
    console.log(" Searching jobs:", { query, city, country });

    const { data } = await api.post(
      "/agent/jobs/search",
      { query, city, country },
      { timeout: 120000 }
    );

    console.log("Search response:", data);
    return data;
  } catch (error) {
    console.error(
      "Search Jobs Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 429) {
      return {
        success: false,
        cooldown: true,
        message: error.response.data.message,
        timeRemaining: error.response.data.timeRemaining,
        cachedResults: error.response.data.cachedResults || [],
        remainingSeconds: error.response.data.remainingSeconds,
        nextAvailableAt: error.response.data.nextAvailableAt,
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        success: false,
        message: "Search timed out. Please try again.",
      };
    }

    return {
      success: false,
      message: error.response?.data?.message || "Search failed",
    };
  }
};


export const getJobSearchStatus = async () => {
  try {
    const { data } = await api.get("/agent/jobs/status");
    return data;
  } catch (error) {
    console.error(
      "Get Job Search Status Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      canSearch: true,
      cachedJobs: [],
      timeRemaining: null,
    };
  }
};