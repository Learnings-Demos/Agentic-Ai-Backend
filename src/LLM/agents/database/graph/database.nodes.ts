import {
  AIMessage,
  AIMessageChunk,
  ToolMessage,
} from "@langchain/core/messages";
import {
  databaseAgent,
  databaseAgentContext,
  databaseSchema,
} from "../database.agent";
import { DatabaseServices, Tools } from "../../../../utils/enums";
import { GraphState } from "../../../graphs/state";
import { appendAiMessageToState } from "../../../helpers/graph.helpers";
import { generateSqlQueryChain } from "../../../pipelines/generate-sql-query/generate-sql-query.chain";
import { Command } from "@langchain/langgraph";
import { databaseTool } from "../../../tools/database/tool";
import { withHITL } from "../../../tools/tools.registry";
import * as DatabaseService from "../../../../services/database.service";
import { encodeToon } from "../../../helpers/token.helpers";

/* -------------------------------------------------------------------------- */
/*                            Parse User Query Node                           */
/* -------------------------------------------------------------------------- */
export const parseUserQueryNode = async (state: typeof GraphState.State) => {
  const result = await databaseAgent.invoke({
    messages: encodeToon(state.messages),
    ...databaseAgentContext,
  });

  return appendAiMessageToState(result as AIMessageChunk);
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
    (tool) => tool.name === Tools.DATABASE
  );

  if (!toolCall) {
    return {};
  }

  const sqlQuery = await generateSqlQueryChain.invoke({
    request: toolCall.args.payload.request,
    databaseSchema,
  });

  return {
    database: {
      generatedSqlQuery: sqlQuery.content,
      toolCallId: toolCall.id,
    },
  };
};

/* -------------------------------------------------------------------------- */
/*                           Execute Sql Query Node                           */
/* -------------------------------------------------------------------------- */
export const executeSqlQueryNode = async (state: any) => {
  const toolCall = {
    name: Tools.DATABASE,
    args: {
      query: state.database.generatedSqlQuery,
    },
  };

  const executeSQLQuery = withHITL(async (toolCall: any) => {
    return await DatabaseService.executeRawQuery(toolCall.args.query);
  });

  const result = await executeSQLQuery(toolCall);

  const toolMessage = new ToolMessage({
    content:
      typeof result === "object" ? JSON.stringify(result) : String(result),
    tool_call_id: state.database.toolCallId,
    name: toolCall.name,
  });

  return new Command({
    update: {
      messages: [toolMessage],
    },
    goto: "Manage-Conversation-Memory",
    graph: Command.PARENT,
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
    (tool) => tool.name === Tools.DATABASE
  );

  if (!toolCall) {
    return {};
  }

  // Execute database tool
  const executeDatabaseService = withHITL(async (toolCall: any) => {
    return await databaseTool.invoke(toolCall.args as any);
  });

  const result = await executeDatabaseService(toolCall);

  const toolMessage = new ToolMessage({
    content:
      typeof result === "object" ? JSON.stringify(result) : String(result),
    tool_call_id: toolCall?.id!,
    name: toolCall.name,
  });

  return new Command({
    update: {
      messages: [toolMessage],
    },

    goto: "Manage-Conversation-Memory",
    graph: Command.PARENT,
  });
};

/* -------------------------------------------------------------------------- */
/*                         Handle Forbidden Operation                         */
/* -------------------------------------------------------------------------- */
export const handleForbiddenNode = (state: typeof GraphState.State) => {
  const rejectionMessage = new AIMessage(
    "This operation is not allowed. Only read operations are permitted."
  );

  return appendAiMessageToState(rejectionMessage);
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
  const databaseTool = tool_calls.find((i) => i.name === Tools.DATABASE);

  if (!databaseTool) {
    return "end";
  }

  // Check service & operation that needs to be performed
  const service = databaseTool?.args?.service;
  const operation = databaseTool?.args?.operation;

  if (!service) {
    return "end";
  }

  if (
    service === DatabaseServices.FORBIDDEN_SERVICE ||
    operation === "forbidden_operation"
  ) {
    return "forbidden_service";
  }

  if (service === DatabaseServices.OTHER_SERVICE) {
    return "generate_sql";
  }

  return "execute_service";
};
