import {z} from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;