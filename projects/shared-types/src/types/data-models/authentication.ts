import { z } from 'zod';
import { ResponseStructure, RequestStructure } from '../utils';
import { userSchema } from './user';

export const authenticationAuthenticateResponseSchema = z.object({
  user: userSchema,
  launchDarklyHash: z.string(),
});

export type AuthenticationAuthenticateResponse = ResponseStructure<
  z.infer<typeof authenticationAuthenticateResponseSchema>
>;

export const authenticationAuthenticateRequestSchema = z.object({
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(1, 'Password is required'),
});

export type AuthenticationAuthenticateRequest = RequestStructure<
  z.infer<typeof authenticationAuthenticateRequestSchema>
>;

export const authenticationCheckResponseSchema = z.object({
  isAuthenticated: z.boolean(),
});

export const authenticationCheckRequestSchema = z.object({
  status: z.string(),
  launchDarklyHash: z.string(),
});

export type AuthenticationCheckResponse = ResponseStructure<z.infer<typeof authenticationCheckRequestSchema>>;
