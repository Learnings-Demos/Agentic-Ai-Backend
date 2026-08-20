import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import { NewGraphState } from "../../../graphs/state";
import { visualizeGraph } from "../../../../LLM/helpers/graph.helpers";
import { checkpointer } from "../../../../../config/database/checkpointer";
import {
  routeAfterSupervisor,
  supervisorNode,
  toolExecutor,
} from "./supervisor.nodes";

export const supervisorGraphObject = new StateGraph(NewGraphState)

  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */

  .addNode("Supervisor", supervisorNode)
  .addNode("Tools", toolExecutor)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */

  .addEdge(START, "Supervisor")

  .addConditionalEdges("Supervisor", routeAfterSupervisor, {
    tools: "Tools",
    [END]: END,
  })

  .addEdge("Tools", "Supervisor");

export const supervisorGraph = supervisorGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(
  supervisorGraph,
  path.join(__dirname, "supervisor.graph.png")
);
