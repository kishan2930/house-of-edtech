import fs from 'node:fs';

import '@testing-library/jest-dom/vitest';

loadLocalEnv();

function loadLocalEnv() {
  if (
    !process.env.MONGODB_URI ||
    !process.env.AUTH_SECRET ||
    !process.env.AUTH_URL
  ) {
    try {
      const text = fs.readFileSync('.env.local', 'utf8');

      for (const line of text.split('\n')) {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);

        if (!match || process.env[match[1]]) {
          continue;
        }

        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    } catch {
      // Local secrets are optional. Route checks skip when the database is down.
    }
  }

  process.env.AUTH_SECRET ??= 'integration-test-secret-at-least-32-characters';
  process.env.AUTH_URL ??= 'http://localhost:3000';
  process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017/house-of-edtech-test';
}
