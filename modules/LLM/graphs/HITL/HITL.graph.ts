import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import { GraphState } from "../state";
import { checkpointer } from "../../config/checkpointer";
import { visualizeGraph } from "../../LLM.helpers";
import { requestApprovalNode } from "./HITL.nodes";

export const humanApprovalGraphObject = new StateGraph(GraphState);

humanApprovalGraphObject
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Request-Approval", requestApprovalNode)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Request-Approval")
  .addEdge("Request-Approval", END);

export const humanApprovalGraph = humanApprovalGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(humanApprovalGraph, path.join(__dirname, "HITL.graph.png"));
