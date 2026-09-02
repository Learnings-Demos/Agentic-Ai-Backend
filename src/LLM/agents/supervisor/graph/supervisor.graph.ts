import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import { GraphState } from "../../../graphs/state";
import {
  emptyNode,
  visualizeGraph,
} from "../../../helpers/graph.helpers";
import { checkpointer } from "../../../../../config/database/checkpointer";
import {
  routeAfterSupervisor,
  routerAfterTools,
  supervisorNode,
  toolExecutor,
} from "./supervisor.nodes";
import { databaseGraph } from "../../database/graph/database.graph";
import { emailGraph } from "../../email/graph/email.graph";
import { ragGraph } from "../../RAG/graph/RAG.graph";

export const supervisorGraphObject = new StateGraph(GraphState)

  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */

  .addNode("Supervisor", supervisorNode)
  .addNode("Database-Agent", databaseGraph)
  .addNode("Email-Agent", emailGraph)
  .addNode("RAG-Agent", ragGraph)
  .addNode("Safe-Tool-Executor", toolExecutor)
  .addNode("Agent-Router", emptyNode)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */

  .addEdge(START, "Supervisor")

  .addConditionalEdges("Supervisor", routeAfterSupervisor, {
    use_agent: "Agent-Router",
    safe_tool: "Safe-Tool-Executor",
    [END]: END,
  })

  .addConditionalEdges("Agent-Router", routerAfterTools, {
    database: "Database-Agent",
    email: "Email-Agent",
    rag: "RAG-Agent",
  })

  .addEdge("Safe-Tool-Executor", "Supervisor");

/* -------------------------------------------------------------------------- */
/*                                Compile Graph                               */
/* -------------------------------------------------------------------------- */
export const supervisorGraph = supervisorGraphObject.compile({
  checkpointer: checkpointer,
});

/* -------------------------------------------------------------------------- */
/*                                 Draw Graph                                 */
/* -------------------------------------------------------------------------- */
void visualizeGraph(
  supervisorGraph,
  path.join(__dirname, "supervisor.graph.png")
);
