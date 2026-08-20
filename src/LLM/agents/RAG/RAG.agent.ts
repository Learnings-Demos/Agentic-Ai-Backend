import { groqModel } from "../../../../config/llm/models";
import { ragAgentTemplate } from "./RAG.template";

export const ragAgent = ragAgentTemplate.pipe(groqModel);
