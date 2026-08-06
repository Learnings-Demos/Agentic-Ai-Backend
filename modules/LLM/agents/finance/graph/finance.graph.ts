import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "../../../graphs/state";
import path from "path";
import { generateFinalizeResponse, visualizeGraph } from "../../../LLM.helpers";
import { checkpointer } from "../../../config/checkpointer";
import {
  emailToolNode,
  financeEmailRoutingNode,
  financeInvoiceRoutingNode,
  generateInvoiceNode,
  invoiceToolNode,
} from "./finance.nodes";

export const financeGraphObject = new StateGraph(GraphState)
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Generate-Invoice", generateInvoiceNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })
  .addNode("Email-Tool", emailToolNode)
  .addNode("Invoice-Tool", invoiceToolNode)
  .addNode("Generate-Final-Response", generateFinalizeResponse)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Generate-Invoice")

  .addConditionalEdges("Generate-Invoice", financeInvoiceRoutingNode, {
    end: END,
    invoice: "Invoice-Tool",
  })

  .addConditionalEdges("Invoice-Tool", financeEmailRoutingNode, {
    end: END,
    sendEmail: "Email-Tool",
    finalize: "Generate-Final-Response",
  })

  .addEdge("Email-Tool", "Generate-Final-Response")
  .addEdge( "Generate-Final-Response", END);

export const financeGraph = financeGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(financeGraph, path.join(__dirname, "finance.graph.png"));
