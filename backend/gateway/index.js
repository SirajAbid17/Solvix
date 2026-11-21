import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import adminRouter from "./routes/admin.routes.js";
import freeRoutes from "./routes/free.routes.js";
import paidRoutes from "./routes/paid.routes.js";
import { corsOptions } from "./config/cors.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/admin", adminRouter);
app.use("/", freeRoutes);
app.use("/", paidRoutes);

const server = app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});


server.requestTimeout = 0;
server.headersTimeout = 0;
server.keepAliveTimeout = 0;
server.timeout = 0;