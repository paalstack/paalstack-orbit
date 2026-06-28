import { MockEmailProvider } from './providers/mock';
import { ResendEmailProvider } from './providers/resend';

import type { EmailProvider } from './types';

let _provider: EmailProvider | null = null;

export const getEmailProvider = (): EmailProvider => {
  if (_provider) return _provider;

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    _provider = new ResendEmailProvider(apiKey);
  } else {
    _provider = new MockEmailProvider();
  }

  return _provider;
};
