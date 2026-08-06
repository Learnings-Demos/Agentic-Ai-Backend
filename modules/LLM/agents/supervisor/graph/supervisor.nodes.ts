import { GraphState } from "../../../graphs/state";
import { withTrace } from "../../../LLM.helpers";
import { supervisorAgent } from "../supervisor.agent";

/* -------------------------------------------------------------------------- */
/*                               Supervisor Node                              */
/* -------------------------------------------------------------------------- */
export const supervisorNode = async (state: typeof GraphState.State) => {
  const decision = await supervisorAgent.invoke({
    messages: state.messages,
  });

  return {
    activeAgent: decision.agent,
  };
};

withTrace(supervisorNode, {
  name: "Supervisor Node",
})

/* -------------------------------------------------------------------------- */
/*                 Supervisor Router ( Conditional Function )                 */
/* -------------------------------------------------------------------------- */
export const supervisorRouter = (state: typeof GraphState.State) => {
  return state.activeAgent as string;
};

