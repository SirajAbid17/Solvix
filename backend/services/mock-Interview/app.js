import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mockInterviewRoutes from "./routes/mockInterview.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5000",  
  "http://localhost:5173",  
  "http://localhost:3000",
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
      "x-user-id",
      "x-user-email",
      "x-user-name",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Mock Interview API is running",
    timestamp: new Date().toISOString(),
  });
});


app.use("/mock-interview", mockInterviewRoutes);


app.use((err, req, res, next) => {
  console.error("ERROR =>", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;