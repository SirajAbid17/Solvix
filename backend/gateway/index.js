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

const PORT = process.env.PORT;
const app = express();


app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/admin", adminRouter);


app.use("/", freeRoutes);


app.use("/", paidRoutes);


app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});