import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from '@/lib/auth/password';

describe('password hashing', () => {
  it('verifies the right password and rejects the wrong one', async () => {
    const stored = await hashPassword('User@1234');

    expect(stored).not.toBe('User@1234');
    expect(stored.startsWith('scrypt$')).toBe(true);
    expect(await verifyPassword('User@1234', stored)).toBe(true);
    expect(await verifyPassword('Wrong@1234', stored)).toBe(false);
  });
});
