import { toolsMapping } from "./tools.constants";

const approvalRequiredTools = new Set([
  toolsMapping.email,
  toolsMapping.database,
]);

export const requiresToolApproval = (toolName: string): boolean => {
  return approvalRequiredTools.has(toolName);
};
