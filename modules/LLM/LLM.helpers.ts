import fs from "fs";
import path from "path";
import { traceable } from "langsmith/traceable";
import { GraphState } from "./graphs/state";
import { generateFinalizeResponseChain } from "./pipelines/generate-natural-answer/generate-natural-answer.chain";
import { databaseModels, serviceRegistry } from "./registries";
import { DatabaseServices } from "../../utils/enums";
import { generateThreadTitleChain } from "./pipelines/generate-thread-title/generate-thread-title.chain";
import {
  AIMessage,
  AIMessageChunk,
  ToolMessage,
} from "@langchain/core/messages";

/* -------------------------------------------------------------------------- */
/*                                 Draw Graph                                 */
/* -------------------------------------------------------------------------- */
export const visualizeGraph = async (
  graph: any,
  currentPath?: string | null
) => {
  const png = await graph
    .getGraph({
      xray: true,
    })
    .drawMermaidPng();

  fs.writeFileSync(
    currentPath ? currentPath : path.join(__dirname, "graph.png"),
    new Uint8Array(await png.arrayBuffer())
  );
};

/* -------------------------------------------------------------------------- */
/*                        Langsmith Traceable Function                        */
/* -------------------------------------------------------------------------- */
type TraceOptions = {
  name: string;
  run_type?: "chain" | "tool" | "llm" | "retriever";
  tags?: string[];
  metadata?: Record<string, any>;
};

export const withTrace = <TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: TraceOptions
) => {
  return traceable(fn, {
    name: options.name,
    run_type: options.run_type ?? "chain",
    tags: options.tags,
    metadata: options.metadata,
  });
};

/* -------------------------------------------------------------------------- */
/*                            Generate Thread Title                           */
/* -------------------------------------------------------------------------- */
export const generateThreadTitle = async (message: string) => {
  const result = await generateThreadTitleChain.invoke({
    input: message,
  });

  return result.content.toString().trim();
};

/* -------------------------------------------------------------------------- */
/*                           Generate Natural Answer                          */
/* -------------------------------------------------------------------------- */
export const generateFinalizeResponse = async (
  state: typeof GraphState.State
) => {
  const result = await generateFinalizeResponseChain.invoke({
    messages: state.messages,
  });

  return {
    messages: [result],
  };
};

/* -------------------------------------------------------------------------- */
/*                Service Registries Description For Tempelate                */
/* -------------------------------------------------------------------------- */
export const buildServiceRegistryDescription = () => {
  const services = Object.entries(serviceRegistry)
    .map(([service, registry]) => {
      return `
Service: ${service}

Handles:
- ${registry.entity}

Available Operations:
${Object.keys(registry.operations)
  .map((method) => `- ${method}`)
  .join("\n")}
`;
    })
    .join("\n");

  return `
=====================================================
SERVICE REGISTRY
=====================================================

${services}

-----------------------------------------------------

Service: ${DatabaseServices.OTHER_SERVICE}

Handles:
- Any database entity that does not have a dedicated service.

Available Operations:
- generate_sql
`;
};

/* -------------------------------------------------------------------------- */
/*                        Database Schema For Template                        */
/* -------------------------------------------------------------------------- */
export const buildDatabaseSchemaDescription = () => {
  const models = databaseModels
    .map((model) => {
      const attributes = model.getAttributes();

      const columns = Object.entries(attributes)
        .map(([column, attribute]: [string, any]) => {
          return `  - ${column}: ${attribute.type.toString()}${
            attribute.allowNull === false ? " NOT NULL" : ""
          }${attribute.primaryKey ? " PRIMARY KEY" : ""}`;
        })
        .join("\n");

      return `Table: "${model.tableName}"
Columns:
${columns}`;
    })
    .join("\n\n");

  return models;
};

/* -------------------------------------------------------------------------- */
/*                         Append Ai Message to State                         */
/* -------------------------------------------------------------------------- */
export const appendAiMessageToState = (result: AIMessage | AIMessageChunk) => {
  return {
    messages: [result],
  };
};

/* -------------------------------------------------------------------------- */
/*                    Create Tool Message & Append to State                   */
/* -------------------------------------------------------------------------- */
export const createToolMessageAndAppendToState = (params: any) => {
  const toolMessage = new ToolMessage(params);

  return {
    messages: [toolMessage],
  };
};
