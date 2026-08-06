import { tool } from "@langchain/core/tools";
import { weatherToolHandler } from "./weather.handler";
import { weatherToolSchema } from "./weather.schema";
import { toolsDescription, toolsMapping } from "../tools.constants";

const weatherToolOptions = {
  name: toolsMapping.weather,
  description: toolsDescription.weather,
  schema: weatherToolSchema,
};

export const weatherTool = tool(weatherToolHandler, weatherToolOptions);
