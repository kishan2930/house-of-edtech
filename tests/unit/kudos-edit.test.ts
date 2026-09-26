import { describe, expect, it } from 'vitest';

import { canEditKudos, kudosEditWindowMs } from '@/lib/kudos/edit-window';
import { parseUpdateKudos } from '@/lib/validators/kudos';

describe('kudos edits', () => {
  it('allows a message change only during the first 30 minutes', () => {
    const sentAt = new Date('2026-09-27T02:00:00.000Z');

    expect(canEditKudos(sentAt, sentAt.getTime() + kudosEditWindowMs - 1)).toBe(
      true,
    );
    expect(canEditKudos(sentAt, sentAt.getTime() + kudosEditWindowMs)).toBe(
      false,
    );
  });

  it('accepts a message and ignores a template change', () => {
    const parsed = parseUpdateKudos({
      message: 'You made the launch calm for the whole team.',
      template: 'welcome',
    });

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data).toEqual({
        message: 'You made the launch calm for the whole team.',
      });
    }
  });

  it('rejects a short edit', () => {
    const parsed = parseUpdateKudos({ message: 'Too short' });

    expect(parsed.success).toBe(false);
  });
});
