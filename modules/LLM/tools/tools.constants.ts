export const toolsMapping = {
  calculator: "calculator",
  weather: "weather",
  email: "email",
  invoice: "invoice",
  database: "database",
};

export const toolsDescription = {
  calculator:
    "Use this tool to perform mathematical calculations such as addition, subtraction, multiplication, and division.",
  weather:
    "Get the current weather for a city, including temperature and apparent temperature. Use this tool when the user asks about current weather or temperature.",
  email:
    "Send an email to a recipient. Use this tool only when the user explicitly asks to send an email.",
  invoice: `Create an invoice.

Use this tool whenever the user asks to create an invoice.

If the user also asks to send/email the newly created invoice,
set sendEmail=true.

Do NOT call email separately for sending an invoice that is
being created by this tool.`,
  database:
    "Perform database operations by invoking existing business services or executing approved SQL queries for analytical requests.",
};
