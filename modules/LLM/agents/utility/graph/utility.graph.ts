import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "../../../graphs/state";
import path from "path";
import { generateFinalizeResponse, visualizeGraph } from "../../../LLM.helpers";
import { checkpointer } from "../../../config/checkpointer";
import {
  calculatorNode,
  utilityAgentNode,
  utilityRoutingNode,
  weatherNode,
} from "./utility.nodes";

export const utilityGraphObject = new StateGraph(GraphState)
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Tool-Identifier", utilityAgentNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })
  .addNode("Calculator", calculatorNode)
  .addNode("Weather", weatherNode)
  .addNode("Generate-Final-Response", generateFinalizeResponse)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Tool-Identifier")

  .addConditionalEdges("Tool-Identifier", utilityRoutingNode, {
    calculator: "Calculator",
    weather: "Weather",
    end: END,
  })

  .addEdge("Calculator", "Generate-Final-Response")
  .addEdge("Weather", "Generate-Final-Response");

export const utilityGraph = utilityGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(utilityGraph, path.join(__dirname, "utility.graph.png"));
