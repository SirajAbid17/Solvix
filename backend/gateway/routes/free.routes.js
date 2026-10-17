import express from "express";
import proxy from "express-http-proxy";

import protect from "../middleware/auth.middleware.js";
import { CurrentUser } from "../controllers/user.controller.js";
import { ProxyWithHeader } from "../utlis/proxyWithHeader.js";
import {
  trackActivity,
  getUserActivity,
} from "../../shared/middlewares/activity.middleware.js";

import { skipCredits } from "../middleware/credits.middleware.js";
import {
  addUserHeadersToProxy,
  shouldParseBody,
  createProxyErrorHandler,
} from "../middleware/proxy.helpers.js";

const router = express.Router();


router.use("/auth", proxy(process.env.Auth_Services));


router.get("/me", CurrentUser);


router.get("/activity", protect, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const activity = await getUserActivity(userId);

    if (!activity) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch activity data",
      });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.use(
  "/chat",
  protect,
  trackActivity,
  skipCredits,
  ProxyWithHeader(process.env.Chat_Services)
);


router.use(
  "/agent",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.Agent_Services, {
    proxyReqPathResolver: (req) => {
      return `/agent${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: shouldParseBody,
    proxyErrorHandler: createProxyErrorHandler("Agent"),
  })
);


router.use(
  "/billing",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.BILLING_SERVICES, {
    proxyReqPathResolver: (req) => {
      const path = req.originalUrl.replace(/^\/billing/, "");

     
      console.log("BILLING PROXY");
     

      return path || "/";
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("User:", srcReq.user?.userId || srcReq.user?._id);
      console.log("Content-Type:", srcReq.headers["content-type"]);
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: shouldParseBody,
    proxyErrorHandler: createProxyErrorHandler("Billing"),
  })
);

export default router;