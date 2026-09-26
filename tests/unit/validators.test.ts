import { describe, expect, it } from 'vitest';

import { signUpSchema } from '@/lib/validators/auth';
import { isObjectId, parseCreateKudos } from '@/lib/validators/kudos';
import { addReactionSchema, isReactionType } from '@/lib/validators/reaction';

const validSignup = {
  name: 'Rahul Mehta',
  email: 'Rahul@Example.com',
  password: 'User@1234',
  confirmPassword: 'User@1234',
};

describe('validators', () => {
  it('accepts a valid email and stores it in lowercase', () => {
    const parsed = signUpSchema.safeParse(validSignup);

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.email).toBe('rahul@example.com');
    }
  });

  it('rejects a short password', () => {
    const parsed = signUpSchema.safeParse({
      ...validSignup,
      password: 'Ab1',
      confirmPassword: 'Ab1',
    });

    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        'Use at least 8 characters.',
      );
    }
  });

  it('rejects a password without a number', () => {
    const parsed = signUpSchema.safeParse({
      ...validSignup,
      password: 'Password',
      confirmPassword: 'Password',
    });

    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      expect(
        parsed.error.issues.some(
          (issue) => issue.message === 'Include at least one number.',
        ),
      ).toBe(true);
    }
  });

  it('rejects a confirm password that does not match', () => {
    const parsed = signUpSchema.safeParse({
      ...validSignup,
      confirmPassword: 'User@12345',
    });

    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe('Passwords do not match.');
    }
  });

  it('rejects a short message and an unknown template', () => {
    const parsed = parseCreateKudos({
      recipientId: '66f0c3c0e1b2a3d4e5f60711',
      message: 'Too short',
      template: 'party',
      senderId: '66f0c3c0e1b2a3d4e5f60710',
    });

    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message);
      expect(messages).toContain('Write at least 10 characters.');
      expect(messages).toContain('Choose a template.');
    }
  });

  it('drops a client sender id', () => {
    const parsed = parseCreateKudos({
      recipientId: '66f0c3c0e1b2a3d4e5f60711',
      message: 'Amazing work on the latest release today.',
      template: 'celebration',
      senderId: '66f0c3c0e1b2a3d4e5f60710',
    });

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data).not.toHaveProperty('senderId');
    }
  });

  it('accepts a known reaction and rejects an unknown one', () => {
    expect(addReactionSchema.safeParse({ type: 'heart' }).success).toBe(true);
    expect(addReactionSchema.safeParse({ type: 'sparkle' }).success).toBe(
      false,
    );
    expect(isReactionType('clap')).toBe(true);
    expect(isReactionType('sparkle')).toBe(false);
  });

  it('checks ObjectId strings', () => {
    expect(isObjectId('66f0c3c0e1b2a3d4e5f60711')).toBe(true);
    expect(isObjectId('not-an-id')).toBe(false);
  });
});
