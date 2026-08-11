import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "../../../graphs/state";
import path from "path";
import { generateFinalizeResponse, visualizeGraph } from "../../../LLM.helpers";
import { checkpointer } from "../../../config/checkpointer";
import {
  executeServiceNode,
  executeSqlQueryNode,
  generateSqlQueryNode,
  handleForbiddenNode,
  parseUserQueryNode,
  queryServiceDecisionRouter,
} from "./database.nodes";

export const databaseGraphObject = new StateGraph(GraphState)

  /* -------------------------------------------------------------------------- */
  /*                              Nodes Definition                              */
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
  .addNode("Handle-Forbidden-Operation", handleForbiddenNode)

  /* -------------------------------------------------------------------------- */
  /*                              Edges Definition                              */
  /* -------------------------------------------------------------------------- */

  .addEdge(START, "Parse-User-Query")

  .addConditionalEdges("Parse-User-Query", queryServiceDecisionRouter, {
    end: END,
    generate_sql: "Generate-SQL",
    execute_service: "Execute-Service",
    forbidden_service: "Handle-Forbidden-Operation",
  })

  .addEdge("Generate-SQL", "Execute-SQL")

  .addEdge("Execute-SQL", "Generate-Final-Response")

  .addEdge("Execute-Service", "Generate-Final-Response")

  .addEdge("Handle-Forbidden-Operation", END)

  .addEdge("Generate-Final-Response", END);

export const databaseGraph = databaseGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(databaseGraph, path.join(__dirname, "database.graph.png"));
