import express from "express";
import DbConnect from "./config/db.js";
import dotenv from "dotenv";
import AgentRoutes from "./routes/agent.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 5003;
const app = express();

// =====================================================
// ✅ CORS - Allow frontend origin with credentials
// =====================================================
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
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400,
  })
);

// =====================================================
// ✅ INCREASE PAYLOAD LIMIT
// =====================================================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =====================================================
// ✅ CREATE STORAGE DIRECTORIES
// =====================================================
const STORAGE_DIR = path.join(__dirname, "storage");
const SUB_DIRS = ["pdf", "ppt", "images"];

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

SUB_DIRS.forEach((dir) => {
  const subDir = path.join(STORAGE_DIR, dir);
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }
});

console.log("✅ Storage directories created");

// =====================================================
// ✅ SERVE STATIC FILES
// =====================================================
app.use("/storage", express.static(path.join(__dirname, "storage")));

// =====================================================
// ✅ ROUTES
// =====================================================
app.use("/agent", AgentRoutes);

// =====================================================
// ✅ HEALTH CHECK
// =====================================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "agent",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// ✅ START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`✅ Agent running on port ${PORT}`);
  DbConnect();
});