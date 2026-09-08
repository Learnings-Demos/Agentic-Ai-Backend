import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import { GraphState } from "../../../../graphs/state";
import { visualizeGraph } from "../../../../helpers/graph.helpers";
import { checkpointer } from "../../../../../../config/database/checkpointer";
import { beforeAgentCheckNode } from "./beforeAgent.nodes";

export const beforeAgentGraphObject = new StateGraph(GraphState)

  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Before-Agent-Check", beforeAgentCheckNode, {
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
  .addEdge(START, "Before-Agent-Check")
  .addEdge("Before-Agent-Check", END);

export const beforeAgentGraph = beforeAgentGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(
  beforeAgentGraph,
  path.join(__dirname, "beforeAgent.graph.png")
);
