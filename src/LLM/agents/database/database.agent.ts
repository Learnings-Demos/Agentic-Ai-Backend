import { groqModel } from "../../../../config/llm/models";
import {
  buildServiceRegistryDescription,
  buildDatabaseSchemaDescription,
} from "../../helpers/agent.helpers";
import { databaseTool } from "../../tools/database/database.tool";
import { databaseAgentTemplate } from "./database.template";

const tools = [databaseTool];

export const serviceRegistry = buildServiceRegistryDescription();
export const databaseSchema = buildDatabaseSchemaDescription();

export const databaseAgentContext = {
  serviceRegistry,
  databaseSchema,
};

export const databaseAgent = databaseAgentTemplate.pipe(
  groqModel.bindTools(tools)
);
