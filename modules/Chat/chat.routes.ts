import express from "express";
import * as ChatController from "./chat.controller";
import {
  validateParamThreadId,
  validateUpdateThreadPayload,
  validateQuery,
  validateHumanApproval,
} from "./chat.validator";
import { validateRequest } from "../../middlewares/validate";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

/* -------------------------------------------------------------------------- */
/*                                Get All Chats                               */
/* -------------------------------------------------------------------------- */
app.get("/list", ChatController.chatsList);

/* -------------------------------------------------------------------------- */
/*                              Get Chat Details                              */
/* -------------------------------------------------------------------------- */
app.get(
  "/:threadId",
  validateParamThreadId,
  validateRequest,
  ChatController.getChatDetails
);

/* -------------------------------------------------------------------------- */
/*                              Continue Chat                                 */
/* -------------------------------------------------------------------------- */
app.post(
  "/:threadId?",
  validateParamThreadId,
  validateQuery,
  validateRequest,
  ChatController.chat
);

/* -------------------------------------------------------------------------- */
/*                                Update Chat                                 */
/* -------------------------------------------------------------------------- */
app.put(
  "/:threadId",
  validateParamThreadId,
  validateUpdateThreadPayload,
  validateRequest,
  ChatController.updateChat
);

/* -------------------------------------------------------------------------- */
/*                                Delete Chat                                 */
/* -------------------------------------------------------------------------- */
app.delete(
  "/:threadId",
  validateParamThreadId,
  validateRequest,
  ChatController.deleteChat
);

/* -------------------------------------------------------------------------- */
/*                               Thread Approval                              */
/* -------------------------------------------------------------------------- */
app.post(
  "/:threadId/approval",
  validateParamThreadId,
  validateHumanApproval,
  validateRequest,
  ChatController.approveThread
);

/* -------------------------------------------------------------------------- */
/*                               Upload Document                              */
/* -------------------------------------------------------------------------- */
app.post(
  "/document/upload",
  upload.single("doc"),
  ChatController.uploadDocument
);

export default app;
