import { web3AddressSchema } from '@app-src/lib/zod';
import { typedFetch } from '@app-src/utils/tapi';
import { z } from 'zod';

export const UserSchema = z.object({
  connectedAddresses: z.array(web3AddressSchema)
});

export type User = z.infer<typeof UserSchema>;

export const fetchUser = (fetchOptions?: RequestInit) =>
  typedFetch(UserSchema, fetch('/api/user', fetchOptions));
