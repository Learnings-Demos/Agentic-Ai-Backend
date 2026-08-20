import fs from "fs";
import path from "path";
import { traceable } from "langsmith/traceable";
import {
  AIMessage,
  AIMessageChunk,
  ToolMessage,
} from "@langchain/core/messages";

/* -------------------------------------------------------------------------- */
/*                                 Empty Node                                 */
/* -------------------------------------------------------------------------- */
export const emptyNode = () => {
  return {};
};

/* -------------------------------------------------------------------------- */
/*                                 Draw Graph                                 */
/* -------------------------------------------------------------------------- */
export const visualizeGraph = async (
  graph: any,
  currentPath?: string | null
) => {
  try {
    const png = await graph
      .getGraph({
        xray: true,
      })
      .drawMermaidPng();

    fs.writeFileSync(
      currentPath ? currentPath : path.join(__dirname, "graph.png"),
      new Uint8Array(await png.arrayBuffer())
    );
  } catch (e) {
    console.log(e);
  }
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
