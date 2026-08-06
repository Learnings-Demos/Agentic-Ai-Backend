import { groqModel } from "../../config/models";
import { emailTool } from "../../tools/email/email.tool";
import { invoiceTool } from "../../tools/invoice/invoice.tool";
import { financeAgentTemplate } from "./finance.template";

const tools = [invoiceTool, emailTool];

export const financeAgent = financeAgentTemplate.pipe(
  groqModel.bindTools(tools)
);
