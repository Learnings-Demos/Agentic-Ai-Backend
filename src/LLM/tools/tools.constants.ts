export const toolNames = {
  calculator: "calculator",
  weather: "weather",
  database: "database",
};

export const toolDescriptions = {
  calculator:
    "Use this tool to perform mathematical calculations such as addition, subtraction, multiplication, and division.",
  weather:
    "Get the current weather for a city, including temperature and apparent temperature. Use this tool when the user asks about current weather or temperature.",
  database: `
    "Use this tool ONLY for READ operations.

Allowed Examples:
- getAllUsers
- getUserById
- getUserByEmail

NOT allowed:
- delete, update, insert

If user asks for data modification:
→ DO NOT use this tool
→ fallback to SQL generation`,
};
