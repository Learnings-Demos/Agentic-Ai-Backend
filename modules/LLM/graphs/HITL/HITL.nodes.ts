import { AIMessageChunk } from "@langchain/core/messages";
import { GraphState } from "../state";
import { interrupt } from "@langchain/langgraph";

export const requestApprovalNode = (state: typeof GraphState.State) => {
  const lastMessage: any = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    throw new Error("Last message is not an AIMessageChunk");
  }

  if (!state.approval_required_payload) {
    throw new Error("Approval payload missing");
  }

  const { title, question, options, metadata } =
    state.approval_required_payload;

  const humanResponse: { approved: boolean } = interrupt({
    title,
    question,
    options,
    toolCalls: lastMessage.tool_calls,
    metadata,
  });

  return {
    humanApproved: humanResponse?.approved,
  };
};
