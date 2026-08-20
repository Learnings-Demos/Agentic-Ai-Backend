import { mcpClient } from "../../../../config/llm/mcp";
import { groqModel } from "../../../../config/llm/models";
import { MCPTools } from "../../../utils/enums";
import { buildMCPToolsDescription } from "../../helpers/agent.helpers";
import { emailAgentTemplate } from "./email.template";

export let gmailMCPToolsDescription: string;

export const getGmailMcpTools = async () => {
  const tools = await mcpClient.getTools([MCPTools.GMAIL]);
  return tools;
};

export const getGmailToolsList = async () => {
  const tools = await getGmailMcpTools();
  return tools.map((tool) => tool.name);
};

export const createEmailAgent = async () => {
  const gmailTools = await getGmailMcpTools();

  gmailMCPToolsDescription = buildMCPToolsDescription(gmailTools);

  return emailAgentTemplate.pipe(groqModel.bindTools(gmailTools));
};
