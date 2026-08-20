import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const qdrantClient = new QdrantClient({
  host: process.env.QDRANT_HOST,
  port: Number(process.env.QDRANT_PORT),
  apiKey: process.env.QDRANT_API_KEY,
  https: false,
});

export default qdrantClient;
