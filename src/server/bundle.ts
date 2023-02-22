import { objectIdSchema, web3AddressSchema } from '@app-src/lib/zod';
import { typedFetch } from '@app-src/utils/tapi';
import { z } from 'zod';

const BundleVisibilityEnum = z.enum(['PRIVATE', 'PUBLIC', 'HIDDEN']);

export const BundleSchema = z.object({
  id: objectIdSchema,
  addresses: z.array(web3AddressSchema),
  name: z.string(),
  visibility: BundleVisibilityEnum
});

export type Bundle = z.infer<typeof BundleSchema>;

const bundle = {
  fetchAll: (fetchOptions?: RequestInit) =>
    typedFetch(z.array(BundleSchema), fetch('/api/bundles', fetchOptions)),
  create: (name: string, fetchOptions?: Omit<RequestInit, 'method'>) =>
    typedFetch(BundleSchema, fetch('api/bundles', { ...fetchOptions, method: 'POST' }))
};

export default bundle;
