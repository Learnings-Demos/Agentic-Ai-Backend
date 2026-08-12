import { Agents } from "../../../utils/enums";
import { createEmailAgent } from "./email/email.agent";

let agents: any = {};

export const initializeAgents = async () => {
  try {
    const emailAgent = await createEmailAgent();

    agents = {
      [Agents.EMAIL]: emailAgent,
    };

    console.log("✅ Agents Initialized");
  } catch (error) {
    console.error("❌ Failed to initialize agents:", (error as Error).message);

    throw error;
  }
};

export const getAgent = (agentName: Agents) => {
  return agents[agentName];
};
