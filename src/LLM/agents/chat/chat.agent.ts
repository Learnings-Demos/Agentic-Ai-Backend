import { groqModel } from "../../../../config/llm/models";
import { chatAgentTemplate } from "./chat.template";

export const chatAgent = chatAgentTemplate.pipe(groqModel);
