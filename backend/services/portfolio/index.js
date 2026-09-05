import express from "express";
import PortfolioRouter from "./routes/portfolio.routes.js";
import DbConnect from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

DbConnect();

app.use(express.json());
app.use("/api/portfolio", PortfolioRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});