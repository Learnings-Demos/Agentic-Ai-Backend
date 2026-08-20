import { interrupt } from "@langchain/langgraph";
import { toolNames } from "./tools.constants";

export const approvalRequiredTools = new Set([toolNames.database]);

/* -------------------------------------------------------------------------- */
/*                               HITL Middleware                              */
/* -------------------------------------------------------------------------- */
export const withHITL = (toolExecutor: Function) => {
  return async (toolCall: any) => {
    const toolName = toolCall.name;

    // 🔥 Check if approval required
    if (approvalRequiredTools.has(toolName)) {
      const { approved } = interrupt({
        type: "tool_approval",
        tool: toolCall,
        message: `Approval required for tool: ${toolName}`,
        options: ["Approve", "Reject"],
      });

      if (!approved) {
        return "The user rejected this action. It was not executed. Do not attempt it again.";
      }
    }

    // ✅ Otherwise execute directly
    return await toolExecutor(toolCall);
  };
};
