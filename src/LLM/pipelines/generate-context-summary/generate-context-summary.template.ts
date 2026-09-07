import { ChatPromptTemplate } from "@langchain/core/prompts";

export const generateContextSummaryTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are maintaining a rolling summary of a conversation.

Your task is to maintain a persistent summary that allows future messages
to be understood even after older messages are removed from memory.

There are two possible situations:

1. NO EXISTING SUMMARY
   - If the existing summary is empty, create a new summary using the
     provided conversation history.

2. EXISTING SUMMARY
   - If an existing summary is provided, treat it as the accumulated
     memory of the conversation.
   - Extend and update the existing summary using the new conversation
     history.
   - Do NOT discard or replace important information from the existing
     summary.
   - Merge any new relevant information into the existing summary.
   - If the new history provides updated or corrected information,
     update the summary accordingly.

Preserve important information such as:

- User's goals and requests
- Important facts provided by the user
- Decisions already made
- Technical/project context
- Important constraints
- Tool results that affect future decisions
- Unresolved tasks or questions
- Important preferences
- Relevant identifiers or values
- Important conclusions from previous conversation

Do NOT include:

- Repetitive conversation
- Greetings
- Small talk
- Internal reasoning
- Unnecessary implementation details
- Information that has no future relevance

================ EXISTING SUMMARY ================

{previousSummary}

================ NEW CONVERSATION HISTORY ================

{history}

================ INSTRUCTIONS ================

If an existing summary is present:
    Extend the existing summary with the relevant information from the
    new conversation history.

If no existing summary is present:
    Create a new summary from the new conversation history.

The final result must contain the accumulated conversation context,
not just a summary of the latest history.

Return ONLY the updated summary.
`,
  ],
]);
