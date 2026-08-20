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

  currentQuery: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
  }),

  ragContext: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
  }),

  answerReviewResult: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
  }),

  rewrittenQuery: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
  }),

  queryRewriteCount: Annotation<number>({
    reducer: (_, update) => update,
    default: () => 0,
  }),
});
