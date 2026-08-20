import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const NewGraphState = Annotation.Root({
  ...MessagesAnnotation.spec,
});
