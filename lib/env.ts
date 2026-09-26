import { z } from 'zod';

const serverEnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required. Copy .env.example to .env.local.')
    .refine(
      (value) => /^mongodb(\+srv)?:\/\/.+/.test(value),
      'MONGODB_URI must start with mongodb:// or mongodb+srv://',
    ),
  AUTH_SECRET: z
    .string()
    .min(
      32,
      'AUTH_SECRET must be at least 32 characters. Generate with: openssl rand -base64 32',
    ),
  AUTH_URL: z.string().url('AUTH_URL must be a valid URL'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = serverEnvSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
  });

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid server environment:\n${formatted}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
