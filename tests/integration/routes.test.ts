import mongoose from 'mongoose';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { Kudos } from '@/models/Kudos';
import { Reaction } from '@/models/Reaction';
import { User } from '@/models/User';

const origin = 'http://localhost:3000';
const stamp = Date.now();
const emailA = `phase6-a-${stamp}@example.com`;
const emailB = `phase6-b-${stamp}@example.com`;
let checksReady = false;

class ApiClient {
  cookie = '';

  async request(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);

    if (this.cookie) {
      headers.set('cookie', this.cookie);
    }

    const response = await fetch(`${origin}${path}`, {
      ...init,
      headers,
      redirect: 'manual',
    });
    const setCookies = response.headers.getSetCookie?.() ?? [];
    const jar = new Map(
      this.cookie
        .split('; ')
        .filter(Boolean)
        .map((pair) => {
          const separator = pair.indexOf('=');
          return [pair.slice(0, separator), pair.slice(separator + 1)] as const;
        }),
    );

    for (const item of setCookies) {
      const pair = item.split(';')[0] ?? '';
      const separator = pair.indexOf('=');
      jar.set(pair.slice(0, separator), pair.slice(separator + 1));
    }

    this.cookie = [...jar.entries()]
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');

    return response;
  }
}

async function signIn(client: ApiClient, email: string, password: string) {
  const csrfResponse = await client.request('/api/auth/csrf');
  const csrf = (await csrfResponse.json()) as { csrfToken: string };
  const body = new URLSearchParams({
    csrfToken: csrf.csrfToken,
    email,
    password,
    callbackUrl: `${origin}/`,
  });

  return client.request('/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body,
  });
}

describe('route checks', () => {
  beforeAll(async () => {
    try {
      const response = await fetch(`${origin}/api/health/db`, {
        signal: AbortSignal.timeout(2500),
      });
      const body = (await response.json()) as { connected?: boolean };
      checksReady = response.ok && body.connected === true;
    } catch {
      checksReady = false;
    }

    if (!checksReady) {
      console.warn(
        'Skipping route checks: MongoDB is not reachable from the app server.',
      );
    }
  }, 10000);

  afterAll(async () => {
    if (!checksReady) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI ?? '', {
      serverSelectionTimeoutMS: 2500,
    });

    const people = await User.find({
      email: { $in: [emailA, emailB] },
    }).select('_id');
    const ids = people.map((person) => person._id);

    await Reaction.deleteMany({ userId: { $in: ids } });
    await Kudos.deleteMany({
      $or: [{ senderId: { $in: ids } }, { recipientId: { $in: ids } }],
    });
    await User.deleteMany({ _id: { $in: ids } });
    await mongoose.disconnect();
  });

  it('signs up, rejects a duplicate email, and rejects a bad email', async (context) => {
    if (!checksReady) {
      context.skip();
    }

    const client = new ApiClient();
    const created = await client.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase Six A',
        email: emailA,
        password: 'User@1234',
        confirmPassword: 'User@1234',
      }),
    });
    const createdBody = await created.json();

    expect(created.status).toBe(201);
    expect(createdBody.user.email).toBe(emailA);
    expect(JSON.stringify(createdBody)).not.toContain('passwordHash');

    const duplicate = await client.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase Six A',
        email: emailA,
        password: 'User@1234',
        confirmPassword: 'User@1234',
      }),
    });

    expect(duplicate.status).toBe(409);

    const invalid = await client.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase Six A',
        email: 'not-an-email',
        password: 'User@1234',
        confirmPassword: 'User@1234',
      }),
    });

    expect(invalid.status).toBe(400);
  });

  it('signs in with the right password and rejects the wrong one', async (context) => {
    if (!checksReady) {
      context.skip();
    }

    const invalid = new ApiClient();
    await signIn(invalid, emailA, 'Wrong@1234');
    const invalidSession = await invalid.request('/api/auth/session');
    const invalidBody = await invalidSession.json();

    expect(invalidBody?.user).toBeFalsy();

    const valid = new ApiClient();
    await signIn(valid, emailA, 'User@1234');
    const session = await valid.request('/api/auth/session');
    const sessionBody = await session.json();

    expect(sessionBody.user.email).toBe(emailA);
    expect(JSON.stringify(sessionBody)).not.toContain('passwordHash');
  });

  it('creates Kudos only for the signed-in sender and toggles reactions', async (context) => {
    if (!checksReady) {
      context.skip();
    }

    const guest = new ApiClient();
    const recipient = await guest.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase Six B',
        email: emailB,
        password: 'User@1234',
        confirmPassword: 'User@1234',
      }),
    });
    const recipientBody = await recipient.json();
    const sender = new ApiClient();

    await signIn(sender, emailA, 'User@1234');

    const anonymous = await guest.request('/api/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId: recipientBody.user.id,
        message: 'Amazing work on the latest release today.',
        template: 'achievement',
      }),
    });

    expect(anonymous.status).toBe(401);

    const me = await sender.request('/api/users/me');
    const meBody = await me.json();
    const created = await sender.request('/api/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: recipientBody.user.id,
        recipientId: recipientBody.user.id,
        message: 'Amazing work on the latest release today.',
        template: 'achievement',
      }),
    });
    const createdBody = await created.json();

    expect(created.status).toBe(201);
    expect(createdBody.kudos.sender.id).toBe(meBody.user.id);
    expect(JSON.stringify(createdBody)).not.toContain('passwordHash');

    const self = await sender.request('/api/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId: meBody.user.id,
        message: 'Amazing work on the latest release today.',
        template: 'achievement',
      }),
    });
    const missing = await sender.request('/api/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId: '66f0c3c0e1b2a3d4e5f60711',
        message: 'Amazing work on the latest release today.',
        template: 'achievement',
      }),
    });
    const badTemplate = await sender.request('/api/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId: recipientBody.user.id,
        message: 'Amazing work on the latest release today.',
        template: 'party',
      }),
    });

    expect(self.status).toBe(400);
    expect(missing.status).toBe(404);
    expect(badTemplate.status).toBe(400);

    const kudosId = createdBody.kudos.id as string;
    const heart = await sender.request(`/api/kudos/${kudosId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'heart' }),
    });
    const clap = await sender.request(`/api/kudos/${kudosId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'clap' }),
    });
    const heartAgain = await sender.request(`/api/kudos/${kudosId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'heart' }),
    });
    const heartBody = await heart.json();
    const clapBody = await clap.json();
    const heartAgainBody = await heartAgain.json();

    expect(heart.status).toBe(201);
    expect(heartBody.reactions.counts.heart).toBe(1);
    expect(clap.status).toBe(201);
    expect(clapBody.reactions.counts).toMatchObject({ heart: 1, clap: 1 });
    expect(heartAgain.status).toBe(200);
    expect(heartAgainBody.reactions.counts.heart).toBe(1);

    const removed = await sender.request(
      `/api/kudos/${kudosId}/reactions/heart`,
      { method: 'DELETE' },
    );
    const removedBody = await removed.json();

    expect(removed.status).toBe(200);
    expect(removedBody.reactions.counts.heart).toBe(0);
    expect(removedBody.reactions.counts.clap).toBe(1);
  });
});
