import { AIMessageChunk, ToolMessage } from "@langchain/core/messages";
import { GraphState } from "../../../graphs/state";
import { utilityAgent } from "../utility.agent";
import { calculatorTool } from "../../../tools/calculator/calculator.tool";
import { weatherTool } from "../../../tools/weather/weather.tool";
import {
  appendAiMessageToState,
  createToolMessageAndAppendToState,
} from "../../../LLM.helpers";

/* -------------------------------------------------------------------------- */
/*                             Utility Agent Node                             */
/* -------------------------------------------------------------------------- */
export const utilityAgentNode = async (state: typeof GraphState.State) => {
  const response = await utilityAgent.invoke({
    messages: state.messages,
  });

  return appendAiMessageToState(response);
};

/* -------------------------------------------------------------------------- */
/*                    Utility Routing Node ( Conditional )                    */
/* -------------------------------------------------------------------------- */
export const utilityRoutingNode = (state: typeof GraphState.State) => {
  // Get last message from state
  const lastMessage: any = state.messages.at(-1);

  //   Check if last message is AIMessage
  if (!(lastMessage instanceof AIMessageChunk)) {
    return "end";
  }

  // Check if any tool are required
  if (!lastMessage.tool_calls?.length) {
    return "end";
  }

  // Return tool name
  return lastMessage?.tool_calls?.[0]?.name;
};

/* -------------------------------------------------------------------------- */
/*                               Calulator Node                               */
/* -------------------------------------------------------------------------- */
export const calculatorNode = async (state: typeof GraphState.State) => {
  // Get last AI message
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  // Find calculator tool call
  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "calculator"
  );

  if (!toolCall) {
    return {};
  }

  // Execute calculator tool
  const result = await calculatorTool.invoke(toolCall.args as any);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content:
      typeof result === "object" ? JSON.stringify(result) : String(result),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};

/* -------------------------------------------------------------------------- */
/*                                Weather Node                                */
/* -------------------------------------------------------------------------- */
export const weatherNode = async (state: typeof GraphState.State) => {
  // Get last AI message
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  // Find weather tool call
  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "weather"
  );

  if (!toolCall) {
    return {};
  }

  // Execute weather tool
  const result = await weatherTool.invoke(toolCall.args as any);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content:
      typeof result === "object" ? JSON.stringify(result) : String(result),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};
