import { databaseModels, serviceRegistry } from "../registries";
import { DatabaseServices } from "../../utils/enums";

/* -------------------------------------------------------------------------- */
/*                Service Registries Description For Tempelate                */
/* -------------------------------------------------------------------------- */
export const buildServiceRegistryDescription = () => {
  const services = Object.entries(serviceRegistry)
    .map(([service, registry]) => {
      return `
Service: ${service}

Handles:
- ${registry.entity}

Available Operations:
${Object.keys(registry.operations)
  .map((method) => `- ${method}`)
  .join("\n")}
`;
    })
    .join("\n");

  return `
=====================================================
SERVICE REGISTRY
=====================================================

${services}

-----------------------------------------------------

Service: ${DatabaseServices.OTHER_SERVICE}

Handles:
- Any database entity that does not have a dedicated service.

Available Operations:
- generate_sql
`;
};

/* -------------------------------------------------------------------------- */
/*                        Database Schema For Template                        */
/* -------------------------------------------------------------------------- */
export const buildDatabaseSchemaDescription = () => {
  const models = databaseModels
    .map((model) => {
      const attributes = model.getAttributes();

      const columns = Object.entries(attributes)
        .map(([column, attribute]: [string, any]) => {
          return `  - ${column}: ${attribute.type.toString()}${
            attribute.allowNull === false ? " NOT NULL" : ""
          }${attribute.primaryKey ? " PRIMARY KEY" : ""}`;
        })
        .join("\n");

      return `Table: "${model.tableName}"
Columns:
${columns}`;
    })
    .join("\n\n");

  return models;
};

/* -------------------------------------------------------------------------- */
/*                            MCP Tools Description                           */
/* -------------------------------------------------------------------------- */
export const buildMCPToolsDescription = (tools: any) => {
  return tools
    .map((tool: { name: string; description: string; schema: any }) => {
      const properties = tool.schema?.properties ?? {};
      const required: string[] = tool.schema?.required ?? [];

      const fields = Object.entries(properties)
        .map(([field, def]: [string, any]) => {
          const type =
            def.type === "array"
              ? `${def.items?.type ?? "string"}[]`
              : def.type;

          return `${field}: ${type}${required.includes(field) ? " (required)" : ""}`;
        })
        .join(", ");

      return `- ${tool.name}: ${tool.description}\n  Fields: ${fields}`;
    })
    .join("\n\n");
};
