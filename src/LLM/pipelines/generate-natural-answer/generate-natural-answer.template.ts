import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export const generateFinalizeResponseTemplate = ChatPromptTemplate.fromMessages(
  [
    [
      "system",
      `
You are the final response generator.

You are given the full conversation history, which may contain:
- Human messages
- AI messages
- Tool messages

Your responsibility is to generate the final response for the user.

Rules:
- Read the entire conversation for context.
- Treat ToolMessages as the source of truth.
- Never expose raw JSON.
- Never mention tool calls, internal execution, or implementation details.
- If multiple ToolMessages exist, combine them into a single coherent response.

For all other tool responses, respond naturally using the available ToolMessages.
`,
    ],

    new MessagesPlaceholder("messages"),
  ]
);
