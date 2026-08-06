import { groqModel } from "../../config/models";
import { emailTool } from "../../tools/email/email.tool";
import { emailAgentTemplate } from "./email.template";

const tools = [emailTool];

export const emailAgent = emailAgentTemplate.pipe(
  groqModel.bindTools(tools)
);
