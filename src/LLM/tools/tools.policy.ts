import { interrupt } from "@langchain/langgraph";
import { toolsMapping } from "./tools.constants";
import { getGmailToolsList } from "../agents/email/email.agent";

export const approvalRequiredTools = new Set([toolsMapping.database]);

/* -------------------------------------------------------------------------- */
/*                                    Init                                    */
/* -------------------------------------------------------------------------- */
export const init = async () => {
  // Add Gmail Tools to Set
  const gmailTools = await getGmailToolsList();

  gmailTools.forEach((toolName) => {
    approvalRequiredTools.add(toolName);
  });
};
init();

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
