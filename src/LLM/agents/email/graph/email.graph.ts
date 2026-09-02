import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import {
  emailRoutingNode,
  emailToolNode,
  generateEmailNode,
} from "./email.nodes";
import { checkpointer } from "../../../../../config/database/checkpointer";
import { GraphState } from "../../../graphs/state";
import {
  redirectToPlannerNode,
  visualizeGraph,
} from "../../../helpers/graph.helpers";

export const emailGraphObject = new StateGraph(GraphState)
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Generate-Email", generateEmailNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })
  .addNode("Email-Tool", emailToolNode)
  .addNode("Go-To-Planner", redirectToPlannerNode)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Generate-Email")

  .addConditionalEdges("Generate-Email", emailRoutingNode, {
    email_tool: "Email-Tool",
    end: END,
  })

  .addEdge("Email-Tool", "Go-To-Planner");

export const emailGraph = emailGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(emailGraph, path.join(__dirname, "email.graph.png"));
