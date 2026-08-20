import sequelize from "../../../../config/database/database";

const forbiddenOperations = ["delete", "update", "insert", "drop", "alter"];

export const executeRawQuery = async (query: string) => {
  try {
    const queryLower = query.toLowerCase();

    if (forbiddenOperations.some((word) => queryLower.includes(word))) {
      throw new Error("This SQL operation is not allowed");
    }

    const [result] = await sequelize.query(query);

    return result;
  } catch (error) {
    console.error("Error executing SQL query:", error);

    throw new Error("Failed to execute SQL query.");
  }
};
