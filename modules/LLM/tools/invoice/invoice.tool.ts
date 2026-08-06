import { tool } from "@langchain/core/tools";
import { toolsDescription, toolsMapping } from "../tools.constants";
import { invoiceToolHandler } from "./invoice.handler";
import { invoiceSchema } from "./invoice.schema";

const invoiceToolOptions = {
  name: toolsMapping.invoice,
  description: toolsDescription.invoice,
  schema: invoiceSchema,
};

export const invoiceTool = tool(invoiceToolHandler, invoiceToolOptions);
