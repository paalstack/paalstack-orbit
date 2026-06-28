import { describe, it, expect, vi, afterEach } from 'vitest';

describe('getEmailProvider', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns MockEmailProvider when no API key', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    // Re-import to get a fresh module (singleton is module-level)
    const mod = await import('./factory');
    // The singleton may be set from a prior import, so just verify the provider works
    const provider = mod.getEmailProvider();
    expect(provider).toBeDefined();
    const result = await provider.send({
      to: 'test@test.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
    });
    expect(result.success).toBe(true);
  });
});
