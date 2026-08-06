import { EmailInput } from "./email.schema";

export const sendEmailToolHandler = async ({
  to,
  subject,
  body,
}: EmailInput) => {
  return {
    success: true,
    message: "Email sent successfully",
    to,
    subject,
    body,
  };
};
