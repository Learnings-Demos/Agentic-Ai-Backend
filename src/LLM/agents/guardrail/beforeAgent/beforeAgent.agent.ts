import { groqModel } from "../../../../../config/llm/models";
import { beforeAgentTemplate } from "./beforeAgent.template";
import { beforeAgentSchema } from "./beforeAgent.schema";

export const beforeAgent = beforeAgentTemplate.pipe(
  groqModel.withStructuredOutput(beforeAgentSchema)
);
