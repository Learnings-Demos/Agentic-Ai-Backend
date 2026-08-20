import { getGmailToolsList } from "../agents/email/email.agent";
import { approvalRequiredTools } from "./tools.policy";

/* -------------------------------------------------------------------------- */
/*                             Tool Initialization                            */
/* -------------------------------------------------------------------------- */
export const initializeTools = async () => {
  // Add Gmail Tools to Set
  const gmailTools = await getGmailToolsList();

  gmailTools.forEach((toolName) => {
    approvalRequiredTools.add(toolName);
  });
};
initializeTools();