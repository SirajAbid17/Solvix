import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import protect from "./middleware/auth.middleware.js"
import { CurrentUser } from "./controllers/user.controller.js"
import { ProxyWithHeader } from "./utlis/proxyWithHeader.js"
import morgan from "morgan"
dotenv.config()

const PORT=process.env.PORT
const app=express()
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser())
app.use(morgan("dev"))


app.use('/auth',proxy(process.env.Auth_Services))
app.use('/chat',protect,ProxyWithHeader(process.env.Chat_Services))
app.get('/me',protect,CurrentUser)
app.use(
  "/agent",
  proxy(process.env.Agent_Services, {
    proxyReqPathResolver: (req) => {
      return `/agent${req.url}`;
    },
  })
);

app.use(
  "/resume",
  protect,
  proxy(process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/resume${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("Resume User:", srcReq.user);

      if (!srcReq.user) {
        throw new Error("User not found");
      }

      const userId =
        srcReq.user._id ||
        srcReq.user.userId ||
        srcReq.user?.user?._id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] =
        srcReq.user.email || srcReq.user?.user?.email || "";

      proxyReqOpts.headers["x-user-name"] =
        srcReq.user.name || srcReq.user?.user?.name || "";

      // Forward auth headers
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization =
          srcReq.headers.authorization;
      }

      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      return proxyReqOpts;
    },

    proxyErrorHandler: (err, res) => {
      console.error("Resume Proxy Error:", err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    },

    parseReqBody: false,
  })
);

app.use(
  "/cv",
  protect,
  proxy(process.env.CV_Services || process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/cv${req.url}`;
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("CV User:", srcReq.user);

      if (!srcReq.user) {
        throw new Error("User not found");
      }

      const userId =
        srcReq.user._id ||
        srcReq.user.userId ||
        srcReq.user?.user?._id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      // Add user information to headers
      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] =
        srcReq.user.email || srcReq.user?.user?.email || "";

      proxyReqOpts.headers["x-user-name"] =
        srcReq.user.name || srcReq.user?.user?.name || "";

      // Forward auth headers
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization =
          srcReq.headers.authorization;
      }

      if (srcReq.headers.cookie) {
        proxyReqOpts.headers.cookie = srcReq.headers.cookie;
      }

      // Important: Forward content-type for file uploads
      if (srcReq.headers["content-type"]) {
        proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"];
      }

      return proxyReqOpts;
    },

    // Don't parse body for file uploads
    parseReqBody: false,

    proxyErrorHandler: (err, res) => {
      console.error("CV Proxy Error:", err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    },
  })
);

app.use(
  "/portfolio",
  protect,

  proxy(
    process.env.PORTFOLIO_SERVICES,

    {
    
      proxyReqPathResolver: (req) => {
        return `/api/portfolio${req.url}`;
      },

      proxyReqOptDecorator: (
        proxyReqOpts,
        srcReq
      ) => {
        console.log(
          "Portfolio User:",
          srcReq.user
        );

        if (!srcReq.user) {
          throw new Error("User not found");
        }

        const userId =
          srcReq.user._id ||
          srcReq.user.userId ||
          srcReq.user?.user?._id;

        if (!userId) {
          throw new Error("User ID not found");
        }

    

        proxyReqOpts.headers["x-user-id"] =
          String(userId);

        
        proxyReqOpts.headers["x-user-email"] =
          srcReq.user.email ||
          srcReq.user?.user?.email ||
          "";

      
        proxyReqOpts.headers["x-user-name"] =
          srcReq.user.name ||
          srcReq.user?.user?.name ||
          "";

      
        if (srcReq.headers.authorization) {
          proxyReqOpts.headers.authorization =
            srcReq.headers.authorization;
        }

    
        if (srcReq.headers.cookie) {
          proxyReqOpts.headers.cookie =
            srcReq.headers.cookie;
        }

      
        if (srcReq.headers["content-type"]) {
          proxyReqOpts.headers["content-type"] =
            srcReq.headers["content-type"];
        }

        return proxyReqOpts;
      },

      
      parseReqBody: false,


      proxyErrorHandler: (err, res) => {
        console.error(
          "Portfolio Proxy Error:",
          err
        );

        res.status(500).json({
          success: false,
          message:
            err.message ||
            "Portfolio service unavailable",
        });
      },
    }
  )
);

app.listen(PORT,()=>{
    console.log(`gateway running on port ${PORT}`)
})