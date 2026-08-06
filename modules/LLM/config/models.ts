import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";

dotenv.config({ path: ".env.local" });

export const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.LLM_MODEL as string,
  streaming: true,
});
