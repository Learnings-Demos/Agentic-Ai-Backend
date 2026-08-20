import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";

import { GraphState } from "../../../graphs/state";
import { generateFinalizeResponse } from "../../../helpers/response.helpers";
import { emptyNode, visualizeGraph } from "../../../helpers/graph.helpers";

import { queryRewriteNode, ragNode, reviewAnswerNode } from "./RAG.nodes";
import { checkpointer } from "../../../../../config/database/checkpointer";

export const ragGraphObject = new StateGraph(GraphState)

  /* -------------------------------------------------------------------------- */
  /*                              Nodes Definition                              */
  /* -------------------------------------------------------------------------- */

  .addNode("RAG-Model", ragNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })
  .addNode("Review-Answer", emptyNode)
  .addNode("Query-Rewrite", queryRewriteNode)
  .addNode("Generate-Final-Response", generateFinalizeResponse)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Definition                              */
  /* -------------------------------------------------------------------------- */

  .addEdge(START, "RAG-Model")
  .addEdge("RAG-Model", "Review-Answer")

  .addConditionalEdges("Review-Answer", reviewAnswerNode, {
    PASS: "Generate-Final-Response",
    REWRITE_QUERY: "Query-Rewrite",
  })

  .addEdge("Generate-Final-Response", END);

export const ragGraph = ragGraphObject.compile({
  checkpointer,
});

void visualizeGraph(ragGraph, path.join(__dirname, "rag.graph.png"));
