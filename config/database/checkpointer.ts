import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  database: process.env.DATABASE as string,
  user: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
  host: process.env.DATABASE_HOST as string,
  port: 5432,
});

export const checkpointer = new PostgresSaver(pool);

const initializeCheckpointer = async () => {
  await checkpointer.setup();
}

initializeCheckpointer();
