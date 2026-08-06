import { ChatPromptTemplate } from "@langchain/core/prompts";

export const generateThreadTitleTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You generate short titles for chat conversations.

Rules:
- Maximum 5 words
- Keep the title clear and relevant
- Do not use quotes
- Do not add explanations
- Return ONLY the title

Examples:

Input: I want to learn React JS from scratch
Output: Learn React From Scratch

Input: Explain PostgreSQL indexing
Output: PostgreSQL Indexing Explained

Input: How does LangGraph checkpointing work?
Output: LangGraph Checkpointing
`,
  ],

  ["human", "{input}"],
]);
