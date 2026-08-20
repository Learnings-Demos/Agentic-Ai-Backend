import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { randomUUID } from "crypto";
import * as QdrantService from "../services/qdrant.service";
import cohereClient from "../../config/llm/reranker";

dotenv.config({ path: ".env.local" });

export const COLLECTION_NAME = "documents";

/* -------------------------------------------------------------------------- */
/*                          Supported Document Types                          */
/* -------------------------------------------------------------------------- */
export const SUPPORTED_MIME_TYPES = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
} as const;

export type SupportedDocumentType =
  (typeof SUPPORTED_MIME_TYPES)[keyof typeof SUPPORTED_MIME_TYPES];

/* -------------------------------------------------------------------------- */
/*                               Embedding Model                              */
/* -------------------------------------------------------------------------- */
export const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

/* -------------------------------------------------------------- */
/*                        Load Document                            */
/* -------------------------------------------------------------- */

const loadDocument = async (
  fileBuffer: Buffer,
  type: SupportedDocumentType
) => {
  const blob = new Blob([new Uint8Array(fileBuffer)]);

  const loader =
    type === "pdf" ? new PDFLoader(blob) : new DocxLoader(blob, { type });

  const documents = await loader.load();

  console.log(`${type.toUpperCase()} sections loaded: ${documents.length}`);

  return documents;
};

/* -------------------------------------------------------------------------- */
/*                         Split Document into Chunks                         */
/* -------------------------------------------------------------------------- */
const splitDocument = async (
  documents: Awaited<ReturnType<typeof loadDocument>>
) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(documents);

  console.log(`Chunks created: ${chunks.length}`);

  return chunks;
};

/* -------------------------------------------------------------------------- */
/*                        Generate Document Embeddings                        */
/* -------------------------------------------------------------------------- */
const generateDocumentEmbeddings = async (
  chunks: Awaited<ReturnType<typeof splitDocument>>
) => {
  const texts = chunks.map((chunk) => chunk.pageContent);

  const vectors = await embeddingsModel.embedDocuments(texts);

  console.log(`Embeddings generated: ${vectors.length}`);

  if (!vectors.length) {
    throw new Error("No embeddings generated from document");
  }

  return vectors;
};

/* -------------------------------------------------------------------------- */
/*                          Generate Query Embeddings                         */
/* -------------------------------------------------------------------------- */
export const generateQueryEmbeddings = async (query: string) => {
  const queryVector = await embeddingsModel.embedQuery(query);

  return queryVector;
};

/* -------------------------------------------------------------- */
/*                       Store in Qdrant                            */
/* -------------------------------------------------------------- */
const storeInQdrant = async (
  chunks: Awaited<ReturnType<typeof splitDocument>>,
  vectors: number[][]
) => {
  const vectorSize = vectors[0].length;

  await QdrantService.createCollection(vectorSize, COLLECTION_NAME);

  const points = chunks.map((chunk, index) => ({
    id: randomUUID(),
    vector: vectors[index],
    payload: {
      text: chunk.pageContent,
      metadata: chunk.metadata,
    },
  }));

  const result = await QdrantService.storeData(points, COLLECTION_NAME);

  return {
    result,
    vectorSize,
  };
};

/* -------------------------------------------------------------- */
/*                     Main Document Processor                      */
/* -------------------------------------------------------------- */
export const processDocument = async (fileBuffer: Buffer, mimetype: string) => {
  const type = SUPPORTED_MIME_TYPES[mimetype as keyof typeof SUPPORTED_MIME_TYPES];

  if (!type) {
    throw new Error(
      "Unsupported document type. Only PDF, DOC, and DOCX files are allowed."
    );
  }

  // 1. Load document
  const documents = await loadDocument(fileBuffer, type);

  // 2. Split into chunks
  const chunks = await splitDocument(documents);

  // 3. Generate embeddings
  const vectors = await generateDocumentEmbeddings(chunks);

  // 4. Store vectors in Qdrant
  const { result, vectorSize } = await storeInQdrant(chunks, vectors);

  return {
    pages: documents.length,
    chunks: chunks.length,
    vectorSize,
    collectionName: COLLECTION_NAME,
    qdrant: result,
  };
};

/* -------------------------------------------------------------------------- */
/*                               Re-Rank Chunks                               */
/* -------------------------------------------------------------------------- */
export const reRankChunks = async (
  query: string,
  chunks: string[],
  limit = 3
) => {
  const rerankedResult = await cohereClient.rerank({
    model: process.env.COHERE_MODEL as string,
    query: query,
    documents: chunks,
    topN: limit,
  });

  return rerankedResult.results;
};
