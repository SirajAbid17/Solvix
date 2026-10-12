import express from "express";
import dotenv from "dotenv";
import Resumerouter from "./routes/resume.routes.js";
import connectDB from "./config/db.js";
import CVrouter from "./routes/cv.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;
connectDB()

app.use(express.json());
app.use('/resume',Resumerouter)
app.use("/cv", CVrouter); 

app.get("/", (req, res) => {
  res.send("Express Server is Running ");
});
app.use((err, req, res, next) => {
  console.error("ERROR =>", err);

  res.status(500).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});