import { groqModel } from "../../../../config/llm/models";
import { buildToolsDescription } from "../../helpers/agent.helpers";
import { supervisorTools } from "../../tools/tools.registry";
import { supervisorTemplate } from "./supervisor.template";

export const supervisorAgentContext = {
  toolDescriptions: buildToolsDescription(supervisorTools),
};

export const supervisorAgent = supervisorTemplate.pipe(
  groqModel.bindTools(supervisorTools) as any
);
