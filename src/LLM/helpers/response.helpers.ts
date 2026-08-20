import { GraphState } from "../graphs/state";
import { generateFinalizeResponseChain } from "../pipelines/generate-natural-answer/generate-natural-answer.chain";
import { generateThreadTitleChain } from "../pipelines/generate-thread-title/generate-thread-title.chain";

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
