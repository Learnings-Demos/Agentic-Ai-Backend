import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { MCPTools } from "../../../utils/enums";

export const mcpClient = new MultiServerMCPClient({
  mcpServers: {
    [MCPTools.GMAIL]: {
      command: "npx",
      args: ["@gongrzhe/server-gmail-autoauth-mcp"],
    },
  },
  useStandardContentBlocks: true,
});
