import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import { checkpointer } from "../../../config/checkpointer";
import { GraphState } from "../../../graphs/state";
import { visualizeGraph } from "../../../LLM.helpers";
import { chatGraph } from "../../chat/graph/chat.graph";
import { emailGraph } from "../../email/graph/email.graph";
import { utilityGraph } from "../../utility/graph/utility.graph";
import { supervisorNode, supervisorRouter } from "./supervisor.nodes";
import { databaseGraph } from "../../database/graph/database.graph";

export const supervisorGraphObject = new StateGraph(GraphState);

supervisorGraphObject
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Supervisor", supervisorNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })

  .addNode("Chat-Agent", chatGraph)
  .addNode("Utility-Agent", utilityGraph)
  .addNode("Email-Agent", emailGraph)
  .addNode("Database-Agent", databaseGraph)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Supervisor")

  .addConditionalEdges("Supervisor", supervisorRouter, {
    chat: "Chat-Agent",
    utility: "Utility-Agent",
    email: "Email-Agent",
    database: "Database-Agent",
  })

  .addEdge("Chat-Agent", END)
  .addEdge("Utility-Agent", END)
  .addEdge("Email-Agent", END)
  .addEdge("Database-Agent", END);

export const supervisorGraph = supervisorGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(
  supervisorGraph,
  path.join(__dirname, "supervisor.graph.png")
);
