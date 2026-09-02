import { END, START, StateGraph } from "@langchain/langgraph";
import path from "path";
import {
  executeServiceNode,
  executeSqlQueryNode,
  generateSqlQueryNode,
  handleForbiddenNode,
  parseUserQueryNode,
  queryServiceDecisionRouter,
} from "./database.nodes";
import { checkpointer } from "../../../../../config/database/checkpointer";
import { GraphState } from "../../../graphs/state";
import {
  redirectToPlannerNode,
  visualizeGraph,
} from "../../../helpers/graph.helpers";

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
  .addNode("Handle-Forbidden-Operation", handleForbiddenNode)
  .addNode("Go-To-Planner", redirectToPlannerNode)

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

  .addEdge("Execute-SQL", "Go-To-Planner")

  .addEdge("Execute-Service", "Go-To-Planner")

  .addEdge("Handle-Forbidden-Operation", "Go-To-Planner");

export const databaseGraph = databaseGraphObject.compile({
  checkpointer: checkpointer,
});

void visualizeGraph(databaseGraph, path.join(__dirname, "database.graph.png"));
