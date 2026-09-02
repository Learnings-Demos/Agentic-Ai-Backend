import { Agents } from "../../utils/enums";
import { createEmailAgent } from "./email/email.agent";

export let availableAgents: any = {};

/* -------------------------------------------------------------------------- */
/*                              Initialize Agent                              */
/* -------------------------------------------------------------------------- */
export const initializeAgents = async () => {
  try {
    const emailAgent = await createEmailAgent();

    availableAgents = {
      [Agents.EMAIL]: emailAgent,
    };

    console.log("✅ Agents Initialized");
  } catch (error) {
    console.error("❌ Failed to initialize agents:", (error as Error).message);

    throw error;
  }
};
