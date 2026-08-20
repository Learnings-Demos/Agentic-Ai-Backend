import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export type AgentType = "chat" | "email" | "utility" | "database" | "rag";

export const GraphState = Annotation.Root({
  ...MessagesAnnotation.spec,

  activeAgent: Annotation<AgentType | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  approval_required_payload: Annotation<{
    title: string;
    question: string;
    options: string[];
    metadata: Record<string, any>;
  }>(),

  generatedSqlQuery: Annotation<string>(),

  humanApproved: Annotation<boolean>(),

  rag: Annotation<{
    currentQuery: string;
    context: string;
    answerReviewResult: string;
    rewrittenQuery: string;
    queryRewriteCount: number;
  }>({
    reducer: (_, update) => update,
    default: () => ({
      currentQuery: "",
      context: "",
      answerReviewResult: "",
      rewrittenQuery: "",
      queryRewriteCount: 0,
    }),
  }),
});
