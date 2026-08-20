import { END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { NewGraphState } from "../../../graphs/state";
import { appendAiMessageToState } from "../../../../LLM/helpers/graph.helpers";
import {
  availableTools,
  supervisorAgent,
  supervisorAgentContext,
} from "../supervisor.agent";
import { AIMessageChunk } from "@langchain/core/messages";

/* -------------------------------------------------------------------------- */
/*                               Supervisor Node                              */
/* -------------------------------------------------------------------------- */
export const supervisorNode = async (state: typeof NewGraphState.State) => {
  const response = await supervisorAgent.invoke({
    messages: state.messages,
    ...supervisorAgentContext, // Pass Tools Descriptions to Template
  });

  return appendAiMessageToState(response);
};

/* -------------------------------------------------------------------------- */
/*                              Tool Executor Node                            */
/* -------------------------------------------------------------------------- */
export const toolExecutor = new ToolNode(availableTools); // Automatically adds ToolMessage to state

/* -------------------------------------------------------------------------- */
/*                 Supervisor Router ( Conditional Function )                 */
/* -------------------------------------------------------------------------- */
export const routeAfterSupervisor = (state: typeof NewGraphState.State) => {
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return END;
  }

  if (lastMessage?.tool_calls?.length) {
    return "tools";
  }

  // No tool needed, so finish
  return END;
};
