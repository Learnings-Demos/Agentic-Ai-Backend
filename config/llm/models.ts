import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config({ path: ".env.local" });

export const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_LLM_MODEL as string,
  streaming: true,
});

export const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: process.env.GOOGLE_LLM_MODEL as string,
  streaming: true,
});
