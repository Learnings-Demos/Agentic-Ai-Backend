import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import { GraphState } from "./state";
import { visualizeGraph } from "../helpers/graph.helpers";
import { checkpointer } from "../../../config/database/checkpointer";
import { supervisorGraph } from "../agents/supervisor/graph/supervisor.graph";
import { beforeAgentGraph } from "../agents/guardrail/beforeAgent/graph/beforeAgent.graph";
import { beforeAgentRouter } from "../agents/guardrail/beforeAgent/graph/beforeAgent.nodes";

export const rootGraphObject = new StateGraph(GraphState);

rootGraphObject
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Before-Guardrail", beforeAgentGraph)
  .addNode("Supervisor-Agent", supervisorGraph)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Before-Guardrail")

  .addConditionalEdges("Before-Guardrail", beforeAgentRouter, {
    allowed: "Supervisor-Agent",
    blocked: END,
  })

  .addEdge("Supervisor-Agent", END);

export const rootGraph = rootGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(rootGraph, path.join(__dirname, "graph.png"));
