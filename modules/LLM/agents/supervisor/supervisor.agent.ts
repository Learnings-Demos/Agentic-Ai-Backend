import { groqModel } from "../../config/models";
import { supervisorDecisionSchema } from "./supervisor.schema";
import { supervisorTemplate } from "./supervisor.template";

export const supervisorAgent = supervisorTemplate.pipe(
  groqModel.withStructuredOutput(supervisorDecisionSchema)
);
