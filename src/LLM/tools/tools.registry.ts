import { interrupt } from "@langchain/langgraph";
import { Tools } from "../../utils/enums";
import { calculatorTool } from "./calculator/tool";
import { weatherTool } from "./weather/tool";
import { databaseTool } from "./database/tool";
import { emailTool } from "./email/tool";
import { ragTool } from "./rag/tool";

/* -------------------------------------------------------------------------- */
/*                                  Tools                                     */
/* -------------------------------------------------------------------------- */
export const safeTools = [calculatorTool, weatherTool];
export const privateTools = [databaseTool, emailTool];

/* -------------------------------------------------------------------------- */
/*                              Supervisor Tools                              */
/* -------------------------------------------------------------------------- */
export const supervisorTools = [...safeTools, ...privateTools, ragTool];

/* -------------------------------------------------------------------------- */
/*                           Approval Required Tools                          */
/* -------------------------------------------------------------------------- */
export const approvalRequiredTools = new Set([Tools.DATABASE, Tools.EMAIL]);

/* -------------------------------------------------------------------------- */
/*                 Tools That Are Delegated To A Specialized Agent            */
/* -------------------------------------------------------------------------- */
export const agentAvailableForTools = new Set([
  Tools.DATABASE,
  Tools.EMAIL,
  Tools.RAG,
]);

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
