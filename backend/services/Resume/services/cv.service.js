// services/cv.service.js
import Groq from "groq-sdk";
import { CVPrompt } from "../prompt/cv.prompt.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateResume = async (data) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.4,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert ATS Resume Writer with 10+ years of experience in tech recruitment. 
          You specialize in creating resumes that pass ATS filters and impress hiring managers.
          Focus on quantifiable achievements, action verbs, and industry-standard keywords.`,
        },
        {
          role: "user",
          content: CVPrompt(data),
        },
      ],
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to generate resume: " + error.message);
  }
};