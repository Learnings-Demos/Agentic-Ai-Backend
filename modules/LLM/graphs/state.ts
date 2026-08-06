import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export type AgentType = "chat" | "finance" | "email" | "utility";

export const GraphState = Annotation.Root({
  ...MessagesAnnotation.spec,

  activeAgent: Annotation<AgentType | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  generatedSqlQuery: Annotation<string>(),
});
