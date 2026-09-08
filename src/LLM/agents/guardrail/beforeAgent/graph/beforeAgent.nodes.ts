import { AIMessage } from "@langchain/core/messages";
import { GraphState } from "../../../../graphs/state";
import { appendAiMessageToState } from "../../../../helpers/graph.helpers";
import { encodeToon } from "../../../../helpers/token.helpers";
import { beforeAgent } from "../beforeAgent.agent";

/* -------------------------------------------------------------------------- */
/*                            Before-Agent Check Node                         */
/* -------------------------------------------------------------------------- */
export const beforeAgentCheckNode = async (state: typeof GraphState.State) => {
  const decision = await beforeAgent.invoke({
    messages: encodeToon(state.messages),
  });

  if (!decision.allowed) {
    const rejectionMessage = new AIMessage(
      decision.reason ??
        "This request cannot be processed as it violates safety guidelines."
    );

    return appendAiMessageToState(rejectionMessage);
  }

  return {};
};

/* -------------------------------------------------------------------------- */
/*                 Before-Agent Router ( Conditional Function )               */
/* -------------------------------------------------------------------------- */
export const beforeAgentRouter = (state: typeof GraphState.State) => {
  const lastMessage = state.messages.at(-1);

  return lastMessage instanceof AIMessage ? "blocked" : "allowed";
};
