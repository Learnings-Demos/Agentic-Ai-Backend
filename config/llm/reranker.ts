import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const cohereClient = new CohereClientV2({ token: process.env.COHERE_API_KEY });

export default cohereClient;
