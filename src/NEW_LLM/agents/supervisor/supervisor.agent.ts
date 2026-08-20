import { groqModel } from "../../../../config/llm/models";
import { buildToolsDescription } from "../../../LLM/helpers/agent.helpers";
import { supervisorTemplate } from "./supervisor.template";
import { calculatorTool } from "../../../LLM/tools/calculator/calculator.tool";
import { databaseTool } from "../../../LLM/tools/database/database.tool";
import { weatherTool } from "../../../LLM/tools/weather/weather.tool";

export const availableTools = [databaseTool, calculatorTool, weatherTool];
export const availableToolsDescription = buildToolsDescription(availableTools);

export const supervisorAgentContext = {
  toolDescriptions: availableToolsDescription,
};

export const supervisorAgent = supervisorTemplate.pipe(
  groqModel.bindTools(availableTools)
);
