import { chatAgent } from "../chat.agent";
import { GraphState } from "../../../graphs/state";
import { appendAiMessageToState } from "../../../helpers/graph.helpers";

export const chatNode = async (state: typeof GraphState.State) => {
  const response = await chatAgent.invoke({
    messages: state.messages,
  });

  return appendAiMessageToState(response);
};
