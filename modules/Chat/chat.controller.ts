import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { generateUUID } from "../../src/utils/security.helpers";
import { SendResponse } from "../../src/utils/http.helpers";
import { ThreadStatus } from "../../src/utils/enums";
import * as ChatService from "./chat.service";
import { rootGraph } from "../../src/LLM/graphs/graph";
import { generateThreadTitle } from "../../src/LLM/helpers/response.helpers";
import { checkpointer } from "../../config/database/checkpointer";
import { processDocument, SUPPORTED_MIME_TYPES } from "../../src/utils/RAG.helpers";
import { newSupervisorGraph } from "../../src/NEW_LLM/graphs/graph";

/* -------------------------------------------------------------------------- */
/*                                Get All Chats                               */
/* -------------------------------------------------------------------------- */
export const chatsList = async (req: Request, res: Response) => {
  try {
    const result = await ChatService.getAllThreads();

    return SendResponse({
      res,
      data: result,
      status: HttpStatusCode.Ok,
      message: "All Chats",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              Get Chat Details                              */
/* -------------------------------------------------------------------------- */
export const getChatDetails = async (req: any, res: Response) => {
  try {
    /* Parse Request */
    const { threadId } = req.params;

    /* Get Thread Details */
    const result = await ChatService.getThreadDetails(threadId);

    if (!result) throw new Error("Thread not found");

    /* Invoke Graph */
    const graphResult: any = await rootGraph.getState({
      configurable: {
        thread_id: threadId,
      },
    });

    /* Convert to Easy Format */
    const chats = graphResult.values.messages.map((msg: any) => ({
      role: msg.type,
      content: msg.content,
    }));

    return SendResponse({
      res,
      data: chats,
      status: HttpStatusCode.Ok,
      message: "Chat Retrieved",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               Start New Chat                               */
/* -------------------------------------------------------------------------- */
export const chat = async (req: Request, res: Response) => {
  try {
    /* Parse Request */
    const { query } = req.body;
    let { threadId = undefined } = req.params;

    /* If Thread Id is not provided then generate new and store in DB */
    if (!threadId) {
      /* Generate Thread Id */
      threadId = generateUUID();

      /* Generate Thread Title ( With LLM ) */
      const threadTitle = await generateThreadTitle(query);

      /* Payload */
      const payload = {
        thread_id: threadId,
        title: threadTitle,
        status: ThreadStatus.ACTIVE,
      };

      /* Store Thread Id & Title */
      await ChatService.createThread(payload);
    } else {
      /* Get Thread Details */
      const result = await ChatService.getThreadDetails(threadId.toString());

      if (!result) throw new Error("Thread not found");
    }

    /* Invoke Graph */
    const response: any = await newSupervisorGraph.invoke(
      { messages: [new HumanMessage(query)] },
      {
        configurable: {
          thread_id: threadId,
        },
      }
    );

    /* If response is interrupted by HITL */
    if (response?.__interrupt__) {
      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: "Approval Required",
        data: {
          thread_id: threadId,
          approval_required: response.__interrupt__,
        },
      });
    }

    /* For Testing */
    const lastMessage = response.messages.at(-1);

    return SendResponse({
      res,
      data: {
        thread_id: threadId,
        answer: lastMessage?.content,
      },
      status: HttpStatusCode.Ok,
      message: "Query Reply",
    });

    /* SSE Headers */
    res.setHeader("X-Thread-Id", (threadId as string).toString());
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    /* Stream Graph Events */
    const eventStream = rootGraph.streamEvents(
      {
        messages: [new HumanMessage(query)],
      },
      {
        configurable: {
          thread_id: threadId,
        },
        version: "v2",
      }
    );

    for await (const event of eventStream) {
      if (event.event === "on_chat_model_stream") {
        const content = event.data?.chunk?.content;

        if (content) {
          res.write(
            `data: ${JSON.stringify({
              type: "token",
              content,
            })}\n\n`
          );
        }
      }
    }

    /* Update updated_at for this thread in DB to retrieve most recent chat at top */
    await ChatService.updateThread("threadId".toString(), {
      updatedAt: new Date(),
    });

    /* Stream Complete */
    res.write(
      `data: ${JSON.stringify({
        type: "done",
      })}\n\n`
    );

    return res.end();
  } catch (error: any) {
    if (error.status === HttpStatusCode.TooManyRequests) {
      return SendResponse({
        res,
        status: HttpStatusCode.TooManyRequests,
        message: "Ai Usage Limit Reached. Please try again shortly.",
      });
    }

    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Update Chat                                */
/* -------------------------------------------------------------------------- */
export const updateChat = async (req: any, res: Response) => {
  try {
    /* Parse Request */
    const { threadId } = req.params;
    const payload = req.body;

    /* Update Thread */
    const result = await ChatService.updateThread(threadId, payload);

    /* Update updated_at for this thread in DB to retrieve most recent chat at top */
    await ChatService.updateThread(threadId, { updatedAt: new Date() });

    return SendResponse({
      res,
      data: result,
      status: HttpStatusCode.Ok,
      message: "Chat Details updated",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Delete Chat                                */
/* -------------------------------------------------------------------------- */
export const deleteChat = async (req: any, res: Response) => {
  try {
    /* Parse Request */
    const { threadId } = req.params;

    /* Delete Thread From DB */
    await ChatService.deleteThread(threadId);

    /* Delete Thread Checkpoint From Langraph */
    await checkpointer.deleteThread(threadId);

    return SendResponse({
      res,
      data: null,
      status: HttpStatusCode.Ok,
      message: "Chat Deleted",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               Thread Approve                               */
/* -------------------------------------------------------------------------- */
export const approveThread = async (req: any, res: Response) => {
  try {
    /* Parse Request */
    const { threadId } = req.params;
    const { user_response } = req.body;

    /* Resume Graph With Human Approval Decision */
    const result: any = await rootGraph.invoke(
      new Command({
        resume: {
          approved: user_response.toLowerCase() === "approve",
        },
      }),
      {
        configurable: {
          thread_id: threadId,
        },
      }
    );

    /* If response is interrupted again by HITL */
    if (result?.__interrupt__) {
      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: "Approval Required",
        data: {
          thread_id: threadId,
          approval_required: result.__interrupt__,
        },
      });
    }

    const lastMessage = result.messages.at(-1);

    return SendResponse({
      res,
      data: {
        thread_id: threadId,
        answer: lastMessage?.content,
      },
      status: HttpStatusCode.Ok,
      message: "Response Approved",
    });
  } catch (error: any) {
    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                           Upload Document in Chat                          */
/* -------------------------------------------------------------------------- */
export const uploadDocument = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return SendResponse({
        res,
        status: HttpStatusCode.BadRequest,
        message: "Document is required",
      });
    }

    if (!(req.file.mimetype in SUPPORTED_MIME_TYPES)) {
      return SendResponse({
        res,
        status: HttpStatusCode.BadRequest,
        message: "Only PDF, DOC, and DOCX documents are allowed",
      });
    }

    const result = await processDocument(req.file.buffer, req.file.mimetype);

    return SendResponse({
      res,
      status: HttpStatusCode.Ok,
      data: result,
      message: "Document processed and stored successfully",
    });
  } catch (error: any) {
    console.error("UploadDocument Error:", error);

    return SendResponse({
      res,
      status: HttpStatusCode.InternalServerError,
      message: "Error: " + error.message,
    });
  }
};