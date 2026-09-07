import { BaseMessage, RemoveMessage } from "@langchain/core/messages";
import { GraphState } from "../graphs/state";
import { generateContextSummaryChain } from "../pipelines/generate-context-summary/generate-context-summary.chain";
import { encodeToon } from "./token.helpers";

/* -------------------------------------------------------------------------- */
/*                              Configuration                                 */
/* -------------------------------------------------------------------------- */
const MAX_MESSAGE_LIMIT = 6;

/* -------------------------------------------------------------------------- */
/*                         Conversation Summarizer                             */
/* -------------------------------------------------------------------------- */
const summarizeConversation = async (
  previousSummary: string,
  messages: BaseMessage[]
) => {
  const history = encodeToon(messages);

  const response = await generateContextSummaryChain.invoke({
    previousSummary,
    history,
  });

  return response.content;
};

/* -------------------------------------------------------------------------- */
/*                         Manage Conversation Memory                          */
/* -------------------------------------------------------------------------- */
export const manageConversationMemory = async (
  state: typeof GraphState.State
) => {
  const messages = state.messages;

  /* Do Nothing Until Limit Is Reached */
  if (messages.length < MAX_MESSAGE_LIMIT) {
    return {};
  }

  /* Keep The Most Recent Message Intact (Current Turn's Query / Tool Result) */
  const messagesToSummarize = messages.slice(0, -1);

  /* Create / Extend Summary */
  const newSummary = await summarizeConversation(
    state.summary,
    messagesToSummarize
  );

  if(!newSummary) {
    throw new Error("Failed to generate conversation summary.");
  }

  /* Remove Summarized Messages From State */
  const removeMessages = messagesToSummarize
    .filter((message) => message.id)
    .map(
      (message) =>
        new RemoveMessage({
          id: message.id!,
        })
    );

  /* Update State */
  return {
    summary: newSummary,
    messages: removeMessages,
  };
};
