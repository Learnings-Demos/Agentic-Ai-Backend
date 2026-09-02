import { EmailToolInput } from "./schema";

export const emailToolHandler = async ({ request }: EmailToolInput) => {
  return {
    type: "route_to_email_agent",
    request,
  };
};
