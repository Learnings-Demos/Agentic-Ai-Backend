import sequelize from "../../../../config/database";

export const executeRawQuery = async (query: string) => {
  try {
    const [result] = await sequelize.query(query);

    return result;
  } catch (error) {
    console.error("Error executing SQL query:", error);

    throw new Error("Failed to execute SQL query.");
  }
};
