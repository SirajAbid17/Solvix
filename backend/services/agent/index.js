import express from "express";
import DbConnect from "./config/db.js";
import dotenv from "dotenv";
import AgentRoutes from "./routes/agent.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import { initPinecone } from "./config/pinecone.js";   

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 5003;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) callback(null, true);
      else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


const STORAGE_DIR = path.join(__dirname, "storage");
const SUB_DIRS = ["pdf", "ppt", "images", "uploads"];
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
SUB_DIRS.forEach((dir) => {
  const sub = path.join(STORAGE_DIR, dir);
  if (!fs.existsSync(sub)) fs.mkdirSync(sub, { recursive: true });
});

app.use("/storage", express.static(STORAGE_DIR));

app.use("/agent", AgentRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "agent", timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  console.log(` Agent running on port ${PORT}`);
  DbConnect();


  try {
    await initPinecone();
  } catch (err) {
    console.warn(" Pinecone init failed at startup:", err.message);
  }
});