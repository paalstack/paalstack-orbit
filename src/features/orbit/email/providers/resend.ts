import { Resend } from 'resend';

import type { EmailProvider, SendEmailInput, SendEmailResult } from '../types';

export class ResendEmailProvider implements EmailProvider {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: input.from ?? 'Orbit <noreply@paalstack.com>',
        to: input.to,
        subject: input.subject,
        html: input.html,
      });

      if (error) return { success: false, error: error.message };
      return { success: true, messageId: data?.id };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }
}
