import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state";
import { checkpointer } from "../config/checkpointer";
import { visualizeGraph } from "../LLM.helpers";
import path from "path";
import { supervisorGraph } from "../agents/supervisor/graph/supervisor.graph";

export const rootGraphObject = new StateGraph(GraphState);

rootGraphObject
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Supervisor-Agent", supervisorGraph)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Supervisor-Agent")

  .addEdge("Supervisor-Agent", END);

export const rootGraph = rootGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(rootGraph, path.join(__dirname, "graph.png"));
