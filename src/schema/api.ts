import { z } from 'zod';

export const PaginatedApiSchema = z.object({
  next: z.number().nullable()
});

export type PaginatedApi = z.infer<typeof PaginatedApiSchema>;
