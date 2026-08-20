import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state";
import { visualizeGraph } from "../helpers/graph.helpers";
import path from "path";
import { supervisorGraph } from "../agents/supervisor/graph/supervisor.graph";
import { checkpointer } from "../../../config/database/checkpointer";

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
