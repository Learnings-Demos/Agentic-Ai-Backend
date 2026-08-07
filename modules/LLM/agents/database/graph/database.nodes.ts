import { AIMessageChunk } from "@langchain/core/messages";
import { GraphState } from "../../../graphs/state";
import {
  databaseAgent,
  databaseAgentContext,
  databaseSchema,
} from "../database.agent";
import { databaseTool } from "../../../tools/database/database.tool";
import { DatabaseServices } from "../../../../../utils/enums";
import { executeRawQuery } from "../../../tools/database/database.service";
import { generateSqlQueryChain } from "../../../pipelines/generate-sql-query/generate-sql-query.chain";
import {
  appendAiMessageToState,
  createToolMessageAndAppendToState,
} from "../../../LLM.helpers";

/* -------------------------------------------------------------------------- */
/*                            Parse User Query Node                           */
/* -------------------------------------------------------------------------- */
export const parseUserQueryNode = async (state: typeof GraphState.State) => {
  const result = await databaseAgent.invoke({
    messages: state.messages,
    ...databaseAgentContext,
  });

  return appendAiMessageToState(result);
};

/* -------------------------------------------------------------------------- */
/*                           Generate Sql Query Node                          */
/* -------------------------------------------------------------------------- */
export const generateSqlQueryNode = async (state: typeof GraphState.State) => {
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "database"
  );

  if (!toolCall) {
    return {};
  }

  const sqlQuery = await generateSqlQueryChain.invoke({
    request: toolCall.args.payload.request,
    databaseSchema,
  });

  return {
    generatedSqlQuery: sqlQuery.content,
  };
};

/* -------------------------------------------------------------------------- */
/*                           Execute Sql Query Node                           */
/* -------------------------------------------------------------------------- */
export const executeSqlQueryNode = async (state: typeof GraphState.State) => {
  const result = await executeRawQuery(state.generatedSqlQuery);

  return createToolMessageAndAppendToState({
    tool_call_id: "generate_sql",
    name: "database",
    content: typeof result === "string" ? result : JSON.stringify(result),
  });
};

/* -------------------------------------------------------------------------- */
/*                        Execute Existing Service Node                       */
/* -------------------------------------------------------------------------- */
export const executeServiceNode = async (state: typeof GraphState.State) => {
  // Get last AI message
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  // Find database tool call
  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "database"
  );

  if (!toolCall) {
    return {};
  }

  // Execute database tool
  const result = await databaseTool.invoke(toolCall.args as any);

  // Create Tool Message to append in state
  return createToolMessageAndAppendToState({
    content:
      typeof result === "object" ? JSON.stringify(result) : String(result),
    tool_call_id: toolCall.id!,
    name: toolCall.name,
  });
};

/* -------------------------------------------------------------------------- */
/*                        Prepare SQL Metadata for HITL                       */
/* -------------------------------------------------------------------------- */
export const prepareSqlMetadataNode = async (
  state: typeof GraphState.State
) => {
  const payload = {
    title: "Database Permission",
    question: "Do you want this SQL query to execute ?",
    options: ["Approve", "Reject"],
    metadata: {
      type: "sql",
      sql_query: state.generatedSqlQuery,
    },
  };

  return {
    approval_required_payload: payload,
  };
};

/* -------------------------------------------------------------------------- */
/*                 Prepare Database Service Metadata for HITL                 */
/* -------------------------------------------------------------------------- */
export const prepareDatabaseServiceMetadataNode = async (
  state: typeof GraphState.State
) => {
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "database"
  );

  if (!toolCall) {
    return {};
  }

  const payload = {
    title: "Database Permission",
    question: "Do you want this service to execute ?",
    options: ["Approve", "Reject"],
    metadata: {
      type: "service",
      service: toolCall?.args.service,
      operation: toolCall?.args.operation,
    },
  };

  return {
    approval_required_payload: payload,
  };
};

/* -------------------------------------------------------------------------- */
/*                    Handle Human Response of Interruption                   */
/* -------------------------------------------------------------------------- */
export const handleHumanResponseOfInterruption = (
  state: typeof GraphState.State
) => {
  return {
    humanApproved: state.humanApproved,
  };
};

/* -------------------------------------------------------------------------- */
/*                       Handle Human Rejection Node                          */
/* -------------------------------------------------------------------------- */
export const handleRejectionNode = (state: typeof GraphState.State) => {
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return {};
  }

  const toolCall = lastMessage.tool_calls?.find(
    (tool) => tool.name === "database"
  );

  if (!toolCall) {
    return {};
  }

  return createToolMessageAndAppendToState({
    tool_call_id: toolCall.id!,
    name: toolCall.name,
    content:
      "The user rejected this action. It was not executed. Do not attempt it again.",
  });
};

/* -------------------------------------------------------------------------- */
/*                 Query Service Decision ( Conditional Func )                */
/* -------------------------------------------------------------------------- */
export const queryServiceDecisionRouter = async (
  state: typeof GraphState.State
) => {
  // Get the last message from the state
  const lastMessage = state.messages.at(-1);

  if (!(lastMessage instanceof AIMessageChunk)) {
    return "end";
  }

  // Check if tool required
  const tool_calls = lastMessage?.tool_calls;

  if (!tool_calls || tool_calls.length === 0) {
    return "end";
  }

  // Check if it is database tool
  const databaseTool = tool_calls.find((i) => i.name === "database");

  if (!databaseTool) {
    return "end";
  }

  // Check service in tool args
  const service = databaseTool?.args?.service;

  if (!service) {
    return "end";
  }

  if (service === DatabaseServices.OTHER_SERVICE) {
    return "generate_sql";
  }

  return "execute_service";
};

/* -------------------------------------------------------------------------- */
/*         Check If SQL or Service to be executed ( Conditional Func )        */
/* -------------------------------------------------------------------------- */
export const checkIfSQLOrServiceExecution = (
  state: typeof GraphState.State
) => {
  const type = state.approval_required_payload?.metadata?.type;

  if (type === "sql") return "execute_sql";
  if (type === "service") return "execute_service";

  throw new Error("Unknown execution type");
};

/* -------------------------------------------------------------------------- */
/*              Handle Human Response Router ( Conditional Func )             */
/* -------------------------------------------------------------------------- */
export const handleHumanResponseRouter = (state: typeof GraphState.State) => {
  return state.humanApproved ? "approved" : "rejected";
};
