import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mockInterviewRoutes from "./routes/mockInterview.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// Health Check

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Mock Interview API is running",
  });
});


// Mock Interview

app.use(
  "/mock-interview",
  mockInterviewRoutes
);


// Error Handler

app.use(
  (err, req, res, next) => {
    console.error(
      "ERROR =>",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

export default app;