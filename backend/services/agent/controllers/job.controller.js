import nodemailer from "nodemailer";
import axios from "axios";
import { JobSearchAgent } from "../AllAgents/jobSearch.agent.js";
import {
  canUserSearchJobs,
  setSearchCooldown,
  cacheJobResults,
  getCachedJobResults,
  formatRemainingTime,
} from "../utlis/jobCache.js";
import { getPineconeIndex } from "../config/pinecone.js";
import redis from "../../../shared/redis/redis.js";


const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS;
const RESUME_SERVICE = process.env.Resume_Services || "http://localhost:5005";


export const searchJobs = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { query, city, country } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User authentication required" });
    }

    if (!query || !query.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Search query required" });
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

    console.log(`Found ${jobs.length} jobs — cooldown set`);

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
    console.error("searchJobs error:", error);
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
      return res
        .status(401)
        .json({ success: false, message: "User authentication required" });
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
    console.error("getJobSearchStatus error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cleanCredential = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/\s+/g, "");
};

const getTransporter = () => {
  const user = cleanCredential(GMAIL_USER);
  const pass = cleanCredential(GMAIL_APP_PASS);

  if (!user || !pass) {
    throw new Error(
      "Gmail credentials missing. Set GMAIL_USER and GMAIL_APP_PASS in .env"
    );
  }

  console.log(`   Gmail login as: ${user} (pass length: ${pass.length})`);

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
};

const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


const fetchCvBuffer = async (userId, cvFileId) => {

  try {
    const cached = await redis.get(`cv:${userId}:${cvFileId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.url) {
        console.log(`    CV URL from Redis: ${parsed.url}`);
        try {
          const fileRes = await axios.get(parsed.url, {
            responseType: "arraybuffer",
            timeout: 15000,
          });
          return {
            buffer: Buffer.from(fileRes.data),
            filename:
              parsed.fileName ||
              `${userId}_${cvFileId}.pdf`,
            contentType: parsed.mimetype || "application/pdf",
          };
        } catch (err) {
          console.warn(
            `     Cloudinary fetch failed: ${err.message}`
          );
        }
      }
    }
  } catch (err) {
    console.log(`     Redis lookup failed: ${err.message}`);
  }


  if (RESUME_SERVICE) {
    try {
      const res = await axios.get(
        `${RESUME_SERVICE}/resume/file/${cvFileId}`,
        {
          headers: { "x-user-id": userId },
          responseType: "arraybuffer",
          timeout: 10000,
          validateStatus: (s) => s === 200,
        }
      );
      if (res?.data && res.data.byteLength > 0) {
        console.log(`    CV fetched from Resume service`);
        return {
          buffer: Buffer.from(res.data),
          filename: `${cvFileId}.pdf`,
          contentType: "application/pdf",
        };
      }
    } catch (err) {
      console.log(
        `     Resume service failed: ${err.message} (trying Pinecone)`
      );
    }
  }

 
  try {
    const index = await getPineconeIndex();
    if (index) {
      const results = await index.namespace(`user-${userId}`).query({
        vector: new Array(768).fill(0),
        topK: 1,
        filter: { fileId: { $eq: String(cvFileId) } },
        includeMetadata: true,
      });

      const meta = results?.matches?.[0]?.metadata;
      const cvUrl = meta?.cloudinaryUrl || meta?.url || meta?.fileUrl;

      if (cvUrl) {
        console.log(`    CV URL from Pinecone: ${cvUrl}`);
        try {
          const fileRes = await axios.get(cvUrl, {
            responseType: "arraybuffer",
            timeout: 15000,
          });
          return {
            buffer: Buffer.from(fileRes.data),
            filename: meta.fileName || `${cvFileId}.pdf`,
            contentType: "application/pdf",
          };
        } catch (err) {
          console.error(
            `    Cloudinary fetch failed: ${err.message}`
          );
        }
      }
    }
  } catch (err) {
    console.log(`    Pinecone lookup failed: ${err.message}`);
  }

  console.error(`    CV not found anywhere for fileId: ${cvFileId}`);
  return null;
};

export const applyToJob = async (req, res) => {
  const startedAt = Date.now();

  try {
    const userId = req.headers["x-user-id"];
    const userName = req.headers["x-user-name"] || "Applicant";
    const userEmail = req.headers["x-user-email"] || "";

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const { job, to, subject, body, cvFileId } = req.body || {};

    const missing = [];
    if (!job) missing.push("job");
    if (!subject?.trim()) missing.push("subject");
    if (!body?.trim()) missing.push("body");
    if (!cvFileId) missing.push("cvFileId");
    if (!to) missing.push("to");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
        jobUrl: job?.url || null,
      });
    }

    if (!isValidEmail(to)) {
      return res.status(400).json({
        success: false,
        message: `Invalid recipient email: "${to}". Please enter a valid email or apply on the job site.`,
        jobUrl: job.url,
      });
    }

    if (subject.length > 200) {
      return res
        .status(400)
        .json({ success: false, message: "Subject too long (max 200 chars)" });
    }

    if (body.length > 15000) {
      return res
        .status(400)
        .json({ success: false, message: "Body too long (max 15000 chars)" });
    }

    
    console.log(`\n📎 Fetching CV ${cvFileId} for user ${userId}...`);
    const cvData = await fetchCvBuffer(userId, cvFileId);

    if (!cvData) {
      return res.status(404).json({
        success: false,
        message:
          "CV not found. Please re-upload your CV before applying. If the issue persists, check that the CV was uploaded successfully.",
      });
    }

    const attachments = [];
    if (cvData.buffer) {
      attachments.push({
        filename:
          cvData.filename ||
          `${userName.replace(/\s+/g, "_")}_CV.pdf`,
        content: cvData.buffer,
        contentType: cvData.contentType || "application/pdf",
      });
      console.log(
        `    CV attached: ${attachments[0].filename} (${(
          cvData.buffer.length / 1024
        ).toFixed(1)} KB)`
      );
    }

   
    const safeBody = body.trim();
    const htmlBody = `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; font-size: 14px; line-height: 1.7; color: #1e293b; max-width: 640px;">
        ${escapeHtml(safeBody).replace(/\n/g, "<br/>")}
      </div>
    `;

    const fromEmail = cleanCredential(GMAIL_USER);
    const fromHeader = userEmail
      ? `"${userName}" <${fromEmail}>`
      : `${userName} <${fromEmail}>`;

    const mailOptions = {
      from: fromHeader,
      to: to.trim(),
      replyTo: userEmail || undefined,
      subject: subject.trim(),
      text: safeBody,
      html: htmlBody,
      attachments,
      headers: {
        "X-Mailer": "Solvix Auto-Apply",
        "X-Job-Title": String(job.title || "").slice(0, 100),
        "X-Job-Company": String(job.company || "").slice(0, 100),
        "X-Job-URL": String(job.url || "").slice(0, 500),
      },
    };

    const transporter = getTransporter();

   
    try {
      await transporter.verify();
      console.log(`    Gmail SMTP verified — credentials OK`);
    } catch (verifyErr) {
      console.error(`    Gmail verify failed: ${verifyErr.message}`);
      return res.status(500).json({
        success: false,
        message:
          "Gmail authentication failed. Check GMAIL_USER and GMAIL_APP_PASS in .env (App Password should be 16 chars, no spaces).",
        durationMs: Date.now() - startedAt,
      });
    }

    console.log(` Sending to ${to} for "${job.title}"...`);
    const info = await transporter.sendMail(mailOptions);

    const durationMs = Date.now() - startedAt;
    console.log(` Sent! messageId=${info.messageId} (${durationMs}ms)`);

    return res.status(200).json({
      success: true,
      message: "Application sent successfully",
      messageId: info.messageId,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
      attachedCV: attachments.length > 0,
      durationMs,
    });
  } catch (error) {
    console.error("applyToJob error:", error);

    const msg = String(error.message || "");
    let friendlyMessage = msg;

    if (
      msg.includes("Invalid login") ||
      msg.includes("Username and Password") ||
      msg.includes("535") ||
      msg.includes("EAUTH")
    ) {
      friendlyMessage =
        "Gmail authentication failed. App Password galat ya expire ho gaya hai. Naya 16-character App Password banayein (spaces ke baghair) .env mein daalein.";
    } else if (msg.includes("ETIMEDOUT") || msg.includes("ECONNREFUSED")) {
      friendlyMessage =
        "Email server unreachable. Please try again in a moment.";
    } else if (msg.includes("Daily user sending limit exceeded")) {
      friendlyMessage = "Daily email limit reached. Try again tomorrow.";
    } else if (msg.includes("Invalid recipient")) {
      friendlyMessage = "The recipient email address is invalid or blocked.";
    }

    return res.status(500).json({
      success: false,
      message: friendlyMessage,
      durationMs: Date.now() - startedAt,
    });
  }
};