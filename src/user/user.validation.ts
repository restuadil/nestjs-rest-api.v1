import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly UPDATE: ZodType = z.object({
    username: z.string().min(3).max(100),
    email: z.string().email().max(100),
    password: z.string().min(8).max(100),
    address: z.string().min(8).max(100),
  });
}
