/* eslint-disable vitest/no-conditional-expect */
import { describe, expect, it } from 'vitest';

import { createExampleSchema } from './schema';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const validData = {
  title: 'My Example',
  description: 'A short description',
};

// ─── createExampleSchema ─────────────────────────────────────────────────────

describe('createExampleSchema', () => {
  describe('valid data', () => {
    it('accepts a valid title and description', () => {
      const result = createExampleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts a title without a description (description is optional)', () => {
      const result = createExampleSchema.safeParse({ title: 'Just a title' });
      expect(result.success).toBe(true);
    });

    it('accepts an empty string description', () => {
      const result = createExampleSchema.safeParse({ ...validData, description: '' });
      expect(result.success).toBe(true);
    });

    it('accepts description at the max allowed length (500 chars)', () => {
      const result = createExampleSchema.safeParse({
        title: 'Title',
        description: 'a'.repeat(500),
      });
      expect(result.success).toBe(true);
    });

    it('accepts title at the max allowed length (100 chars)', () => {
      const result = createExampleSchema.safeParse({
        title: 'a'.repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('title validation', () => {
    it('fails when title is empty', () => {
      const result = createExampleSchema.safeParse({ ...validData, title: '' });
      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((i) => i.path.includes('title'));
      expect(titleError?.message).toBe('Title is required');
    });

    it('fails when title exceeds 100 characters', () => {
      const result = createExampleSchema.safeParse({
        ...validData,
        title: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((i) => i.path.includes('title'));
      expect(titleError?.message).toBe('Title must be 100 characters or less');
    });

    it('fails when title is missing entirely', () => {
      const result = createExampleSchema.safeParse({ description: 'desc' });
      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    it('fails when description exceeds 500 characters', () => {
      const result = createExampleSchema.safeParse({
        title: 'Title',
        description: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
      const descError = result.error?.issues.find((i) => i.path.includes('description'));
      expect(descError?.message).toBe('Description must be 500 characters or less');
    });
  });

  describe('parsed output shape', () => {
    it('returns the parsed values when valid', () => {
      const result = createExampleSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('My Example');
        expect(result.data.description).toBe('A short description');
      }
    });
  });
});
