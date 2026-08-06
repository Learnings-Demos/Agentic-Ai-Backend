export const invoiceToolHandler = async () => {
  const invoiceId = Date.now();

  return {
    success: true,
    message: "Invoice generated successfully",
    invoiceId,
  };
};
