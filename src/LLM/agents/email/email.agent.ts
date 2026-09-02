import { mcpClient } from "../../../../config/llm/mcp";
import { groqModel } from "../../../../config/llm/models";
import { buildMCPToolsDescription } from "../../helpers/agent.helpers";
import { MCPTools } from "../../../utils/enums";
import { emailAgentTemplate } from "./email.template";

export let gmailMCPToolsDescription: string;

export const getGmailMcpTools = async () => {
  const tools = await mcpClient.getTools([MCPTools.GMAIL]);
  return tools;
};
 
export const createEmailAgent = async () => {
  const gmailTools = await getGmailMcpTools();
  gmailMCPToolsDescription = buildMCPToolsDescription(gmailTools);

  return emailAgentTemplate.pipe(groqModel.bindTools(gmailTools) as any);
};
