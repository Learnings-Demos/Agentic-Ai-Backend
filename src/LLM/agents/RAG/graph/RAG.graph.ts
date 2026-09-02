import { START, StateGraph } from "@langchain/langgraph";
import path from "path";
import {
  queryPassedNode,
  queryRewriteNode,
  ragNode,
  resetRagStateNode,
  reviewAnswerNode,
} from "./RAG.nodes";
import { checkpointer } from "../../../../../config/database/checkpointer";
import { GraphState } from "../../../graphs/state";
import {
  emptyNode,
  redirectToPlannerNode,
  visualizeGraph,
} from "../../../helpers/graph.helpers";

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
  .addNode("Query-Passed", queryPassedNode)
  .addNode("Go-To-Planner", redirectToPlannerNode)
  .addNode("Reset-RAG-State", resetRagStateNode)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Definition                              */
  /* -------------------------------------------------------------------------- */

  .addEdge(START, "RAG-Model")
  .addEdge("RAG-Model", "Review-Answer")

  .addConditionalEdges("Review-Answer", reviewAnswerNode, {
    PASS: "Query-Passed",
    REWRITE_QUERY: "Query-Rewrite",
  })

  .addEdge("Query-Passed", "Reset-RAG-State")
  .addEdge("Reset-RAG-State", "Go-To-Planner");

export const ragGraph = ragGraphObject.compile({
  checkpointer,
});

void visualizeGraph(ragGraph, path.join(__dirname, "rag.graph.png"));
