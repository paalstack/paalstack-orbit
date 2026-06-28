import { describe, it, expect } from 'vitest';
import { renderTemplate } from './template-renderer';

describe('renderTemplate', () => {
  it('replaces single variable', () => {
    expect(renderTemplate('Hello {{lead_name}}', { lead_name: 'Alice' })).toBe('Hello Alice');
  });

  it('replaces multiple variables', () => {
    expect(renderTemplate('{{company}} - {{status}}', { company: 'Acme', status: 'won' })).toBe(
      'Acme - won'
    );
  });

  it('leaves unknown variables empty', () => {
    expect(renderTemplate('Hello {{unknown}}', {})).toBe('Hello ');
  });

  it('handles template with no variables', () => {
    expect(renderTemplate('Hello World', {})).toBe('Hello World');
  });

  it('replaces the same variable multiple times', () => {
    expect(renderTemplate('{{name}} is {{name}}', { name: 'Alice' })).toBe('Alice is Alice');
  });
});
