import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "../../../graphs/state";
import path from "path";
import {
  emptyNode,
  generateFinalizeResponse,
  visualizeGraph,
} from "../../../LLM.helpers";
import { checkpointer } from "../../../config/checkpointer";
import {
  checkIfForbiddenOperation,
  checkIfSQLOrServiceExecution,
  executeServiceNode,
  executeSqlQueryNode,
  generateSqlQueryNode,
  handleForbiddenNode,
  handleHumanResponseOfInterruption,
  handleHumanResponseRouter,
  handleRejectionNode,
  parseUserQueryNode,
  prepareDatabaseServiceMetadataNode,
  prepareSqlMetadataNode,
  queryServiceDecisionRouter,
} from "./database.nodes";
import { humanApprovalGraph } from "../../../graphs/HITL/HITL.graph";

export const databaseGraphObject = new StateGraph(GraphState)
  /* -------------------------------------------------------------------------- */
  /*                              Nodes Defination                              */
  /* -------------------------------------------------------------------------- */
  .addNode("Parse-User-Query", parseUserQueryNode, {
    retryPolicy: {
      maxAttempts: 3,
      initialInterval: 500,
      backoffFactor: 2,
      maxInterval: 2000,
    },
  })
  .addNode("Generate-SQL", generateSqlQueryNode)
  .addNode("Execute-SQL", executeSqlQueryNode)
  .addNode("Execute-Service", executeServiceNode)
  .addNode("Generate-Final-Response", generateFinalizeResponse)
  .addNode("Interrupt", humanApprovalGraph)
  .addNode("Handle-Human-Response", handleHumanResponseOfInterruption)
  .addNode("Handle-Rejection", handleRejectionNode)
  .addNode("Handle-Forbidden-Operation", handleForbiddenNode)
  .addNode("Prepare-SQL-Metadata", prepareSqlMetadataNode)
  .addNode(
    "Prepare-Database-Service-Metadata",
    prepareDatabaseServiceMetadataNode
  )
  .addNode("Check-Approved-Type", emptyNode)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Defination                              */
  /* -------------------------------------------------------------------------- */
  .addEdge(START, "Parse-User-Query")

  .addConditionalEdges("Parse-User-Query", queryServiceDecisionRouter, {
    end: END,
    generate_sql: "Generate-SQL",
    execute_service: "Prepare-Database-Service-Metadata",
    forbidden_service: "Handle-Forbidden-Operation",
  })

  .addEdge("Generate-SQL", "Prepare-SQL-Metadata")

  .addEdge("Prepare-SQL-Metadata", "Interrupt")
  .addEdge("Prepare-Database-Service-Metadata", "Interrupt")

  .addEdge("Interrupt", "Handle-Human-Response")

  .addConditionalEdges("Handle-Human-Response", handleHumanResponseRouter, {
    approved: "Check-Approved-Type",
    rejected: "Handle-Rejection",
  })

  .addConditionalEdges("Check-Approved-Type", checkIfSQLOrServiceExecution, {
    execute_sql: "Execute-SQL",
    execute_service: "Execute-Service",
  })

  .addEdge("Execute-SQL", "Generate-Final-Response")
  .addEdge("Execute-Service", "Generate-Final-Response")
  .addEdge("Handle-Rejection", "Generate-Final-Response")
  .addEdge("Handle-Forbidden-Operation", END)

  .addEdge("Generate-Final-Response", END);

export const databaseGraph = databaseGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(databaseGraph, path.join(__dirname, "database.graph.png"));
