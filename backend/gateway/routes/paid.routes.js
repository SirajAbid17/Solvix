import express from "express";
import proxy from "express-http-proxy";

import protect from "../middleware/auth.middleware.js";
import { trackActivity } from "../../shared/middlewares/activity.middleware.js";

import {
  checkCredits,
  skipCredits,
} from "../middleware/credits.middleware.js";
import {
  addUserHeadersToProxy,
  shouldParseBody,
  createProxyErrorHandler,
} from "../middleware/proxy.helpers.js";

const router = express.Router();


router.post(
  "/resume/upload",
  protect,
  checkCredits,
  trackActivity,
  proxy(process.env.Resume_Services, {
    proxyReqPathResolver: () => `/resume/upload`,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: false, 
    proxyErrorHandler: createProxyErrorHandler("Resume Upload"),
  })
);


router.use(
  "/resume",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/resume${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: shouldParseBody,
    proxyErrorHandler: createProxyErrorHandler("Resume"),
  })
);


router.post(
  "/mock-interview/generate",
  protect,
  checkCredits,
  trackActivity,
  proxy(process.env.MOCK_INTERVIEW_SERVICES, {
    proxyReqPathResolver: () => `/mock-interview/generate`,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: false,
    proxyErrorHandler: createProxyErrorHandler("Mock Interview"),
  })
);


router.use(
  "/mock-interview",
  protect,
  trackActivity,
  skipCredits,
  proxy(process.env.MOCK_INTERVIEW_SERVICES, {
    proxyReqPathResolver: (req) => {
      return `/mock-interview${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: shouldParseBody,
    proxyErrorHandler: createProxyErrorHandler("Mock Interview"),
  })
);


router.use(
  "/cv",
  protect,
  checkCredits,
  trackActivity,
  proxy(process.env.CV_Services || process.env.Resume_Services, {
    proxyReqPathResolver: (req) => {
      return `/cv${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: shouldParseBody,
    proxyErrorHandler: createProxyErrorHandler("CV"),
  })
);


router.use(
  "/portfolio",
  protect,
  checkCredits,
  trackActivity,
  proxy(process.env.PORTFOLIO_SERVICES, {
    proxyReqPathResolver: (req) => {
      return `/api/portfolio${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return addUserHeadersToProxy(proxyReqOpts, srcReq);
    },
    parseReqBody: false,
    proxyErrorHandler: createProxyErrorHandler("Portfolio"),
  })
);

export default router;