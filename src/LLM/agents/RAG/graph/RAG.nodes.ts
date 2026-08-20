import { GraphState } from "../../../graphs/state";
import { appendAiMessageToState } from "../../../helpers/graph.helpers";
import { ragAgent } from "../RAG.agent";
import {
  COLLECTION_NAME,
  generateQueryEmbeddings,
  reRankChunks,
} from "../../../../utils/RAG.helpers";
import * as QdrantService from "../../../../services/qdrant.service";
import { ragAnswerReviewChain } from "../../../pipelines/rag-answer-review/rag-answer-review.chain";
import { queryRewriteChain } from "../../../pipelines/query-rewrite/query-rewrite.chain";
import { Command } from "@langchain/langgraph";

/* -------------------------------------------------------------------------- */
/*                                  Rag Node                                  */
/* -------------------------------------------------------------------------- */
export const ragNode = async (state: typeof GraphState.State) => {
  /* Get Last Message */
  const lastMessage: any = state.messages.at(-1);

  /* Generate Query Embeddings */
  const queryVectors = await generateQueryEmbeddings(lastMessage.content);

  /* Search from Qudrant DB */
  const searchedResult = await QdrantService.searchData(
    queryVectors,
    COLLECTION_NAME
  );

  /* All Chunks From DB */
  const allChunks = searchedResult.points
    .map((point) => point.payload?.text)
    .filter((text): text is string => Boolean(text));

  /* Re Rank Chunks */
  const reRankedResult = await reRankChunks(lastMessage.content, allChunks);

  /* Prepare Context */
  const context = reRankedResult
    .map((result) => allChunks[result.index])
    .join("\n\n");

  const result = await ragAgent.invoke({
    context,
    question: lastMessage.content,
  });

  return {
    ...appendAiMessageToState(result),
    rag: {
      ...state.rag,
      context,
      currentQuery: lastMessage.content,
    },
  };
};

/* -------------------------------------------------------------------------- */
/*                   Review Answer Node ( Conditional Func )                  */
/* -------------------------------------------------------------------------- */
export const reviewAnswerNode = async (state: typeof GraphState.State) => {
  const ragAnswer = state.messages.at(-1);

  const result = await ragAnswerReviewChain.invoke({
    question: state.rag.currentQuery,
    context: state.rag.context,
    answer: ragAnswer?.content,
  });

  console.log("RAG REVIEW:", result);

  return result.relevant ? "PASS" : "REWRITE_QUERY";
};

/* -------------------------------------------------------------------------- */
/*                             Query Rewrite Node                             */
/* -------------------------------------------------------------------------- */
export const queryRewriteNode = async (state: typeof GraphState.State) => {
  if (state.rag.queryRewriteCount >= 2) {
    return new Command({
      update: {
        rag: {
          currentQuery: "",
          context: "",
          answerReviewResult: "",
          rewrittenQuery: "",
          queryRewriteCount: 0,
        },
      },
      goto: "END",
    });
  }

  const previousAnswer = state.messages.at(-1);

  const result = await queryRewriteChain.invoke({
    question: state.rag.currentQuery,
    context: state.rag.context,
    previousAnswer: previousAnswer?.content,
  });

  return new Command({
    update: {
      rag: {
        ...state.rag,
        currentQuery: result.rewrittenQuery,
        queryRewriteCount: state.rag.queryRewriteCount + 1,
      },
    },
    goto: "RAG-Model",
    graph: Command.PARENT,
  });
};

/* -------------------------------------------------------------------------- */
/*                               Reset RAG State                              */
/* -------------------------------------------------------------------------- */
export const resetRagStateNode = async () => {
  return {
    rag: {
      currentQuery: "",
      context: "",
      rewrittenQuery: "",
      answerReviewResult: "",
      queryRewriteCount: 0,
    },
  };
};
