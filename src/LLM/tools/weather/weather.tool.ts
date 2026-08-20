import { tool } from "@langchain/core/tools";
import { weatherToolHandler } from "./weather.handler";
import { weatherToolSchema } from "./weather.schema";
import { toolDescriptions, toolNames } from "../tools.constants";

const weatherToolOptions = {
  name: toolNames.weather,
  description: toolDescriptions.weather,
  schema: weatherToolSchema,
};

export const weatherTool = tool(weatherToolHandler, weatherToolOptions);
