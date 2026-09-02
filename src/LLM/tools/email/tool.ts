import { tool } from "@langchain/core/tools";
import { Tools } from "../../../utils/enums";
import { emailToolDescription } from "./description";
import { emailToolSchema } from "./schema";
import { emailToolHandler } from "./handler";

const emailToolOptions = {
  name: Tools.EMAIL,
  description: emailToolDescription,
  schema: emailToolSchema,
};

export const emailTool = tool(emailToolHandler, emailToolOptions);
