import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";

import { NewGraphState } from "./state";
import { visualizeGraph } from "../../LLM/helpers/graph.helpers";
import { checkpointer } from "../../../config/database/checkpointer";
import { supervisorGraph } from "../agents/supervisor/graph/supervisor.graph";

export const rootGraphObject = new StateGraph(NewGraphState);

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

export const newSupervisorGraph = rootGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(newSupervisorGraph, path.join(__dirname, "graph.png"));
