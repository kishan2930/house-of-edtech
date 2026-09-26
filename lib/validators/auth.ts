import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(128, 'Use at most 128 characters.')
  .regex(/[A-Za-z]/, 'Include at least one letter.')
  .regex(/\d/, 'Include at least one number.');

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email.')
  .transform((value) => value.toLowerCase());

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Enter at least 2 characters.')
      .max(80, 'Use at most 80 characters.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
