import { RagToolInput } from "./schema";

export const ragToolHandler = async ({ request }: RagToolInput) => {
  return {
    type: "route_to_rag_agent",
    request,
  };
};
