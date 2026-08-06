import { ToolMessage } from "@langchain/core/messages";
import { GraphState } from "../../../graphs/state";
import { emailAgent } from "../email.agent";
import { emailTool } from "../../../tools/email/email.tool";
import {
  appendAiMessageToState,
  createToolMessageAndAppendToState,
} from "../../../LLM.helpers";

/* -------------------------------------------------------------------------- */
/*                           Generate Email Node                              */
/* -------------------------------------------------------------------------- */
export const generateEmailNode = async (state: typeof GraphState.State) => {
  const result = await emailAgent.invoke({
    messages: state.messages,
  });

  return appendAiMessageToState(result);
};

/* -------------------------------------------------------------------------- */
/*                   Email Routing Node ( Conditional Func )                  */
/* -------------------------------------------------------------------------- */
export const emailRoutingNode = async (state: typeof GraphState.State) => {
  // Get last message from state
  const lastMessage: any = state.messages.at(-1);

  // Check in last message if tools are required
  const isToolRequired = lastMessage.tool_calls.length > 0;

  if (!isToolRequired) {
    return "end";
  }

  // Return tool name
  return lastMessage?.tool_calls?.[0]?.name;
};

/* -------------------------------------------------------------------------- */
/*                               Email Tool Node                              */
/* -------------------------------------------------------------------------- */
export const emailToolNode = async (state: typeof GraphState.State) => {
  /* Check if any tool are required */
  const lastMessage: any = state.messages.at(-1);

  // Find email tool call
  const toolCall = lastMessage.tool_calls?.find(
    (tool: { name: string }) => tool.name === "email"
  );

  // Execute calculator tool
  const emailResult = await emailTool.invoke(toolCall.args);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content: JSON.stringify(emailResult),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};
