import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  uploadAndProcessFile,
  askAboutFile,
  deleteFileRAG,
} from "../controllers/file.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


const UPLOAD_DIR = path.join(__dirname, "..", "storage", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = [
      ".pdf", ".docx", ".doc", ".txt", ".md",
      ".csv", ".xls", ".xlsx",
      ".png", ".jpg", ".jpeg", ".webp",
      ".json", ".xml", ".html",
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed`));
    }
  },
});

router.post("/upload", upload.single("file"), uploadAndProcessFile);
router.post("/ask", askAboutFile);
router.delete("/:fileId", deleteFileRAG);

export default router;