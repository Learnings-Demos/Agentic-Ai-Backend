import { AIMessageChunk, ToolMessage } from "@langchain/core/messages";
import { GraphState } from "../../../graphs/state";
import { invoiceTool } from "../../../tools/invoice/invoice.tool";
import { financeAgent } from "../finance.agent";
import { emailTool } from "../../../tools/email/email.tool";
import {
  appendAiMessageToState,
  createToolMessageAndAppendToState,
} from "../../../LLM.helpers";

/* -------------------------------------------------------------------------- */
/*                              Generate Invoice                              */
/* -------------------------------------------------------------------------- */
export const generateInvoiceNode = async (state: typeof GraphState.State) => {
  const result = await financeAgent.invoke({
    messages: state.messages,
  });

  return appendAiMessageToState(result);
};

/* -------------------------------------------------------------------------- */
/*                Finance Invoice Routing ( Conditional Func )                */
/* -------------------------------------------------------------------------- */
export const financeInvoiceRoutingNode = async (
  state: typeof GraphState.State
) => {
  // Get last message from state
  const lastMessage: any = state.messages.at(-1);

  //   Check if last message is AIMessage
  if (!(lastMessage instanceof AIMessageChunk)) {
    return "end";
  }

  // Get all Tools from last message
  const tools = lastMessage.tool_calls;

  if (!tools?.length) {
    return "end";
  }

  const isInvoiceToolExist = tools.some((item) => item.name === "invoice");

  if (!isInvoiceToolExist) {
    return "end";
  }

  // Return tool name
  return tools[0].name;
};

/* -------------------------------------------------------------------------- */
/*                              Invoice Tool Node                             */
/* -------------------------------------------------------------------------- */
export const invoiceToolNode = async (state: typeof GraphState.State) => {
  // Get last AI message
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  // Find invoice tool call
  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "invoice"
  );

  if (!toolCall) {
    return {};
  }

  const result = await invoiceTool.invoke(toolCall.args as any);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content:
      typeof result === "object" ? JSON.stringify(result) : String(result),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};

/* -------------------------------------------------------------------------- */
/*                 Finance Email Routing ( Conditional Func )                 */
/* -------------------------------------------------------------------------- */
export const financeEmailRoutingNode = async (
  state: typeof GraphState.State
) => {
  // Get last message from state
  const lastMessage: any = state.messages.at(-1);

  //   Check if last message is AIMessage
  if (!(lastMessage instanceof ToolMessage)) {
    return "end";
  }

  // Get all Tools from last message
  const sendEmail = JSON.parse(lastMessage.content as any).sendEmail;

  if (!sendEmail) {
    return "end";
  }

  // Return tool name
  return "sendEmail";
};

/* -------------------------------------------------------------------------- */
/*                               Email Tool Node                              */
/* -------------------------------------------------------------------------- */
export const emailToolNode = async (state: typeof GraphState.State) => {
  // Get last AI message
  const lastAiMessage: any = state.messages.at(-2);

  if (!(lastAiMessage instanceof AIMessageChunk)) {
    return {};
  }

  // Find invoice tool call
  const toolCall = lastAiMessage.tool_calls?.find(
    (tool) => tool.name === "email"
  );

  if (!toolCall) {
    return {};
  }

  const result = await emailTool.invoke(toolCall.args as any);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content: JSON.stringify(result),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};
