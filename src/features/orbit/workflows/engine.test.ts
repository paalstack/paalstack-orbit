import { describe, it, expect } from 'vitest';
import { evaluateCondition } from './engine';

describe('evaluateCondition', () => {
  it('eq matches equal value', () => {
    expect(
      evaluateCondition({ field: 'status', operator: 'eq', value: 'won' }, { status: 'won' })
    ).toBe(true);
  });
  it('eq fails unequal value', () => {
    expect(
      evaluateCondition({ field: 'status', operator: 'eq', value: 'won' }, { status: 'new' })
    ).toBe(false);
  });
  it('neq matches different value', () => {
    expect(
      evaluateCondition({ field: 'status', operator: 'neq', value: 'lost' }, { status: 'won' })
    ).toBe(true);
  });
  it('in matches value in array', () => {
    expect(
      evaluateCondition(
        { field: 'status', operator: 'in', value: ['won', 'qualified'] },
        { status: 'won' }
      )
    ).toBe(true);
  });
  it('not_in rejects value in array', () => {
    expect(
      evaluateCondition({ field: 'status', operator: 'not_in', value: ['lost'] }, { status: 'won' })
    ).toBe(true);
  });
  it('returns false for unknown field', () => {
    expect(evaluateCondition({ field: 'unknown_field', operator: 'eq', value: 'x' }, {})).toBe(
      false
    );
  });
});
