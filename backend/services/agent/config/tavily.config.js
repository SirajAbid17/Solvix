import { TavilySearch } from "@langchain/tavily";


export const serpApiConfig = {
  apiKey: process.env.SERPAPI_API_KEY,
  baseUrl: "https://serpapi.com/search",
  engine: "google_jobs",
};

export const jobSearchTavily = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 15,
  includeImages: false,
  includeRawContent: "markdown",
  searchDepth: "advanced",
  includeDomains: [
    "linkedin.com",
    "indeed.com",
    "glassdoor.com",
    "rozee.pk",
    "mustakbil.com",
    "naukri.com",
    "wellfound.com",
    "remoteok.com",
    "greenhouse.io",
    "lever.co",
    "ashbyhq.com",
  ],
});

export const tavilySearch = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 5,
  includeImages: true,
});