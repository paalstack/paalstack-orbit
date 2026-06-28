export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export type SendEmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export type EmailProvider = {
  send(input: SendEmailInput): Promise<SendEmailResult>;
};
