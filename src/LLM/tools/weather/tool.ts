import { tool } from "@langchain/core/tools";
import { Tools } from "../../../utils/enums";
import { weatherToolDescription } from "./description";
import { weatherToolSchema } from "./schema";
import { weatherToolHandler } from "./handler";

const weatherToolOptions = {
  name: Tools.WEATHER,
  description: weatherToolDescription,
  schema: weatherToolSchema,
};

export const weatherTool = tool(weatherToolHandler, weatherToolOptions);
