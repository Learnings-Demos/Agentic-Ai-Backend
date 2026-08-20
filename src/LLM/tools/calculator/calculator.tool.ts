import { tool } from "@langchain/core/tools";
import { calculatorToolHandler } from "./calculator.handler";
import { calculatorToolSchema } from "./calculator.schema";
import { toolDescriptions, toolNames } from "../tools.constants";

const calculatorToolOptions = {
  name: toolNames.calculator,
  description: toolDescriptions.calculator,
  schema: calculatorToolSchema,
};

export const calculatorTool = tool(
  calculatorToolHandler,
  calculatorToolOptions
);
