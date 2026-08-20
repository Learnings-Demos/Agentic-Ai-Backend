import { DatabaseServices } from "../../../utils/enums";
import { serviceRegistry } from "../../registries";
import { DatabaseInput } from "./database.schema";

export const databaseToolHandler = async ({
  service,
  operation,
  payload,
}: DatabaseInput) => {
  if (
    service === DatabaseServices.OTHER_SERVICE &&
    operation === "generate_sql"
  ) {
    return {
      type: "generate_sql",
      request: payload.request,
    };
  }

  const registry = (serviceRegistry as any)[service];

  if (!registry) {
    throw new Error(`Unknown service: ${service}`);
  }

  const serviceOperation = registry.operations[operation];

  if (!serviceOperation) {
    throw new Error(
      `Operation '${operation}' is not available in service '${service}'.`
    );
  }

  return await serviceOperation(payload);
};
