import { GraphState } from "../../../graphs/state";
import { getGmailMcpTools, gmailMCPToolsDescription } from "../email.agent";
import {
  appendAiMessageToState,
  createToolMessageAndAppendToState,
} from "../../../helpers/graph.helpers";
import { getAgent } from "../..";
import { Agents } from "../../../../utils/enums";
import { withHITL } from "../../../tools/tools.policy";

/* -------------------------------------------------------------------------- */
/*                           Generate Email Node                              */
/* -------------------------------------------------------------------------- */
export const generateEmailNode = async (state: typeof GraphState.State) => {
  const emailAgent = await getAgent(Agents.EMAIL);

  const result = await emailAgent.invoke({
    messages: state.messages,
    gmailTools: gmailMCPToolsDescription,
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

  // Any Gmail MCP tool call routes to the same execution node
  return "email_tool";
};

/* -------------------------------------------------------------------------- */
/*                               Email Tool Node                              */
/* -------------------------------------------------------------------------- */
export const emailToolNode = async (state: typeof GraphState.State) => {
  /* Check if any tool are required */
  const lastMessage: any = state.messages.at(-1);

  const toolCall = lastMessage.tool_calls?.[0];

  if (!toolCall) {
    return {};
  }

  // Find the matching Gmail MCP tool and execute it
  const gmailToolsList = await getGmailMcpTools();
  const gmailTool = gmailToolsList.find((tool) => tool.name === toolCall.name);

  const emailService = withHITL(async (toolCall: any) => {
    return await gmailTool?.invoke(toolCall.args);
  });

  const emailResult = await emailService(toolCall);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content: JSON.stringify(emailResult),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};
