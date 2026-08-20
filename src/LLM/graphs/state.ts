import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export type AgentType = "chat" | "email" | "utility" | "database" | "rag";

export const GraphState = Annotation.Root({
  ...MessagesAnnotation.spec,

  activeAgent: Annotation<AgentType | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  rag: Annotation<{
    currentQuery: string;
    context: string;
    answerReviewResult: string;
    rewrittenQuery: string;
    queryRewriteCount: number;
  }>({
    reducer: (current, update) => ({
      ...current,
      ...update,
    }),
    default: () => ({
      currentQuery: "",
      context: "",
      answerReviewResult: "",
      rewrittenQuery: "",
      queryRewriteCount: 0,
    }),
  }),

  database: Annotation<{
    generatedSqlQuery: string;
  }>({
    reducer: (current, update) => ({
      ...current,
      ...update,
    }),
    default: () => ({
      generatedSqlQuery: "",
    }),
  }),
});
