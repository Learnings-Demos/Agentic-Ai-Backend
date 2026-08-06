import { tool } from "@langchain/core/tools";
import { sendEmailToolHandler } from "./email.handler";
import { emailSchema } from "./email.schema";
import { toolsDescription, toolsMapping } from "../tools.constants";

const emailToolOptions = {
  name: toolsMapping.email,
  description: toolsDescription.email,
  schema: emailSchema,
};

export const emailTool = tool(sendEmailToolHandler, emailToolOptions);
