import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRoutes from "./modules/Auth/auth.routes";
import UserRoutes from "./modules/User/user.routes";
import ChatRoutes from "./modules/Chat/chat.routes";
import dotenv from "dotenv";
import { initializeRedis } from "./config/database/redis";
import { initializeAgents } from "./src/LLM/agents";

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT || 4000;

const app = express();

/* -------------------------------------------------------------------------- */
/*                                 Middlewares                                */
/* -------------------------------------------------------------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

/* -------------------------------------------------------------------------- */
/*                                 Auth Routes                                */
/* -------------------------------------------------------------------------- */
app.use("/api/auth", AuthRoutes);

/* -------------------------------------------------------------------------- */
/*                                 User Routes                                */
/* -------------------------------------------------------------------------- */
app.use("/api/users", UserRoutes);

/* -------------------------------------------------------------------------- */
/*                                Chat Routes                                 */
/* -------------------------------------------------------------------------- */
app.use("/api/chats", ChatRoutes);

/* -------------------------------------------------------------------------- */
/*                                 Start Server                               */
/* -------------------------------------------------------------------------- */
export const startSever = async () => {
  await initializeRedis();
  await initializeAgents();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startSever();
