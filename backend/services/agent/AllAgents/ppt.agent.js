import { GetModels } from "../config/aimodels.js";
import { Generateppt } from "../utlis/Generateppt.js";
import { uploadToCloudinary } from "../utlis/UploadFile.js";

export const pptAgent = async (state) => {
  try {
    const llm = await GetModels("ppt");

    const prompt = `
You are a professional presentation designer and content strategist.

Return ONLY valid JSON.

Do not include:
- markdown
- explanations
- comments
- code blocks
- extra text

Use EXACTLY this JSON structure:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

RULES:

1. Generate exactly 6 slides.
2. Each slide must have a clear and relevant title.
3. Each slide must contain 4 to 6 concise bullet points.
4. Bullet points must be informative.
5. Keep bullet points short and presentation-friendly.
6. Maintain a logical flow.
7. Use double quotes for JSON.
8. Do not add trailing commas.
9. "slides" must be an array.
10. Return ONLY JSON.

TOPIC:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    console.log("AI RESPONSE:", res);

    
    let content = res?.content;

    if (Array.isArray(content)) {
      content = content
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.text || ""
        )
        .join("");
    }

    if (!content) {
      throw new Error("PPT AI returned empty content");
    }

   
    content = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid PPT JSON returned by AI");
    }

    content = content.substring(
      jsonStart,
      jsonEnd + 1
    );

   
    const data = JSON.parse(content);

    console.log("PPT DATA:", data);

    
    if (!data.title) {
      throw new Error("PPT title missing");
    }

    if (!Array.isArray(data.slides)) {
      throw new Error("PPT slides must be an array");
    }

    if (data.slides.length !== 6) {
      throw new Error(
        `Expected 6 slides but received ${data.slides.length}`
      );
    }

    data.slides.forEach((slide, index) => {
      if (!slide.title) {
        throw new Error(
          `Slide ${index + 1} title missing`
        );
      }

      if (!Array.isArray(slide.points)) {
        throw new Error(
          `Slide ${index + 1} points must be an array`
        );
      }
    });

    
    const ppt = await Generateppt(data);

    if (!ppt) {
      throw new Error("Generateppt() returned nothing");
    }

   
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    if (!buffer) {
      throw new Error("PPT buffer was not generated");
    }

    const pptBuffer = Buffer.isBuffer(buffer)
      ? buffer
      : Buffer.from(buffer);

    console.log(
      "PPT generated successfully. Size:",
      pptBuffer.length,
      "bytes"
    );


    const fileName = `${data.title || "solvix-presentation"}`
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .toLowerCase() + ".pptx";

    
    let pptUrl = null;
    let pptBase64 = null;

    try {
      const uploadResult = await uploadToCloudinary(
        pptBuffer,
        "ppt",
        `ppt_${Date.now()}`
      );
      
      if (uploadResult.success) {
        pptUrl = uploadResult.url;
        pptBase64 = pptBuffer.toString("base64");
        console.log(" PPT uploaded to Cloudinary:", pptUrl);
      } else {
        console.log(" Cloudinary upload failed, using base64 fallback");
        pptBase64 = pptBuffer.toString("base64");
      }
    } catch (uploadError) {
      console.error(" Cloudinary upload error:", uploadError);
      pptBase64 = pptBuffer.toString("base64");
    }

   
    return {
      ...state,

     
      ppt: data,

    
      pptBuffer,

     
      pptGenerated: true,

     
      pptFileName: fileName,

    
      pptData: data,

      
      pptUrl: pptUrl,

     
      pptBase64: pptBase64,

      aiResponse: `Your PowerPoint presentation has been generated successfully.

Title: ${data.title}

${data.subtitle || ""}

The presentation contains ${data.slides.length} slides.

Click the download button below to download the PowerPoint file.`,

      error: null,
    };

  } catch (error) {
    console.error(
      "PPT AGENT ERROR:",
      error
    );

    return {
      ...state,

      ppt: null,

      pptBuffer: null,

      pptGenerated: false,

      pptFileName: null,

      pptData: null,

      pptUrl: null,

      pptBase64: null,

      aiResponse:
        "Sorry, I could not generate the PowerPoint presentation.",

      error: error.message,
    };
  }
};