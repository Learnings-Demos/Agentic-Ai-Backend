import { END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { GraphState } from "../../../graphs/state";
import { appendAiMessageToState } from "../../../helpers/graph.helpers";
import { supervisorAgent, supervisorAgentContext } from "../supervisor.agent";
import { AIMessageChunk } from "@langchain/core/messages";
import {
  agentAvailableForTools,
  safeTools,
} from "../../../tools/tools.registry";
import { Tools } from "../../../../utils/enums";
import { encodeToon } from "../../../helpers/token.helpers";

/* -------------------------------------------------------------------------- */
/*                               Supervisor Node                              */
/* -------------------------------------------------------------------------- */
export const supervisorNode = async (state: typeof GraphState.State) => {
  const response = await supervisorAgent.invoke({
    messages: encodeToon(state.messages),
    summary: state.summary,
    ...supervisorAgentContext, // Pass Tools Descriptions to Template
  });

  return appendAiMessageToState(response as AIMessageChunk);
};

/* -------------------------------------------------------------------------- */
/*                              Tool Executor Node                            */
/* -------------------------------------------------------------------------- */
export const toolExecutor = new ToolNode(safeTools); // Automatically adds ToolMessage to state

/* -------------------------------------------------------------------------- */
/*                 Supervisor Router ( Conditional Function )                 */
/* -------------------------------------------------------------------------- */
export const routeAfterSupervisor = (state: typeof GraphState.State) => {
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return END;
  }

  if (lastMessage?.tool_calls?.length) {
    if (agentAvailableForTools.has(lastMessage.tool_calls[0].name as Tools)) {
      return "use_agent";
    }

    return "safe_tool";
  }

  // No tool needed, so finish
  return END;
};

/* -------------------------------------------------------------------------- */
/*               Tool Identifier Router ( Conditional Function )              */
/* -------------------------------------------------------------------------- */
export const routerAfterTools = (state: typeof GraphState.State) => {
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return END;
  }

  if (!lastMessage?.tool_calls?.length) {
    return END;
  }

  return lastMessage?.tool_calls[0].name;
};
