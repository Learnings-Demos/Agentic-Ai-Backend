import { ChatPromptTemplate } from "@langchain/core/prompts";

export const ragAgentTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a RAG Agent.

Answer the user's question using ONLY the provided context.

If the answer cannot be found in the context,
say that the information is not available in the document.

Context:
{context}

User Question:
{question}
`,
  ],
]);
