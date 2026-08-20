import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "../../../graphs/state";
import path from "path";
import { generateFinalizeResponse } from "../../../helpers/response.helpers";
import { visualizeGraph } from "../../../helpers/graph.helpers";
import {
  emailRoutingNode,
  emailToolNode,
  generateEmailNode,
} from "./email.nodes";
import { checkpointer } from "../../../../../config/database/checkpointer";

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
  .addNode("Generate-Final-Response", generateFinalizeResponse)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Generate-Email")

  .addConditionalEdges("Generate-Email", emailRoutingNode, {
    email_tool: "Email-Tool",
    end: END,
  })

  .addEdge("Email-Tool", "Generate-Final-Response");

export const emailGraph = emailGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(emailGraph, path.join(__dirname, "email.graph.png"));
