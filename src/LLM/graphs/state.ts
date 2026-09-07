import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  ...MessagesAnnotation.spec,

  summary: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
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

  rag: Annotation<{
    currentQuery: string;
    context: string;
    answerReviewResult: string;
    rewrittenQuery: string;
    queryRewriteCount: number;
    tool_call_id: string;
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
      tool_call_id: "",
    }),
  }),
});
