import type { EmailProvider, SendEmailInput, SendEmailResult } from '../types';

export class MockEmailProvider implements EmailProvider {
  send(input: SendEmailInput): Promise<SendEmailResult> {
    console.warn('[MockEmailProvider] Would send email:', {
      to: input.to,
      subject: input.subject,
    });
    return Promise.resolve({ success: true, messageId: `mock_${Date.now()}` });
  }
}
