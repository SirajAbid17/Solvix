import { TavilySearch } from "@langchain/tavily";

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
  maxResults: 4,
  includeImages: true,
});