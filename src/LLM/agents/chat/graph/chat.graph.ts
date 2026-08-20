import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "../../../graphs/state";
import { chatNode } from "./chat.nodes";
import path from "path";
import { visualizeGraph } from "../../../helpers/graph.helpers";
import { checkpointer } from "../../../../../config/database/checkpointer";

export const chatGraphObject = new StateGraph(GraphState)
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("LLM-Model", chatNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "LLM-Model")
  .addEdge("LLM-Model", END);

export const chatGraph = chatGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(chatGraph, path.join(__dirname, "chat.graph.png"));
