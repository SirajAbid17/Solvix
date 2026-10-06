import express from "express";

import {
  CreateConversion,
  GetConversions,
  GetMessages,
  SaveMessage,
  UpdatedConversions,
} from "../controllers/chat.controller.js";
import { uploadRateLimit } from "../../../shared/rateLimit.js";


const Route = express.Router();

Route.post(
  "/create-conversation",
  uploadRateLimit,
  CreateConversion
);

Route.get("/get-conversation", GetConversions);

Route.post(
  "/save-messages",
  uploadRateLimit,
  SaveMessage
);

Route.post(
  "/update-conversation",
  uploadRateLimit,
  UpdatedConversions
);

Route.get(
  "/get-messages/:conversationId",
  GetMessages
);

export default Route;