import { z } from 'zod';

import { kudosTemplates } from '@/lib/kudos/templates';

const objectIdPattern = /^[a-f\d]{24}$/i;

export function isObjectId(value: string) {
  return objectIdPattern.test(value);
}

export const createKudosSchema = z.object({
  recipientId: z.string().regex(objectIdPattern, 'Choose a teammate.'),
  message: z
    .string()
    .trim()
    .min(10, 'Write at least 10 characters.')
    .max(500, 'Use at most 500 characters.'),
  template: z.enum(kudosTemplates, { error: 'Choose a template.' }),
});

export type CreateKudosInput = z.infer<typeof createKudosSchema>;

export function parseCreateKudos(body: unknown) {
  return createKudosSchema.safeParse(omitSenderId(body));
}

function omitSenderId(body: unknown) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return body;
  }

  const rest = { ...(body as Record<string, unknown>) };
  delete rest.senderId;
  return rest;
}
