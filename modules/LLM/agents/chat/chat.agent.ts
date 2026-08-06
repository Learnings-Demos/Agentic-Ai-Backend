import { groqModel } from "../../config/models";
import { chatAgentTemplate } from "./chat.template";

export const chatAgent = chatAgentTemplate.pipe(groqModel);
