import { groqModel } from "../../config/models";
import { calculatorTool } from "../../tools/calculator/calculator.tool";
import { weatherTool } from "../../tools/weather/weather.tool";
import { utilityAgentTemplate } from "./utility.template";

const tools = [calculatorTool, weatherTool];

export const utilityAgent = utilityAgentTemplate.pipe(
  groqModel.bindTools(tools)
);
