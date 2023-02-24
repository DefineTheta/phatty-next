import { objectIdSchema, web3AddressSchema } from '@app-src/lib/zod';
import { typedFetch } from '@app-src/utils/tapi';
import { z } from 'zod';

const BundleVisibilityEnum = z.enum(['PRIVATE', 'PUBLIC', 'HIDDEN']);

export const BundleSchema = z.object({
  id: objectIdSchema,
  addresses: z.array(web3AddressSchema),
  name: z.string(),
  visibility: BundleVisibilityEnum,
  likes: z.number(),
  dislikes: z.number()
});

export type Bundle = z.infer<typeof BundleSchema>;

const bundle = {
  fetch: (bundleId: string, fetchOptions?: RequestInit) =>
    typedFetch(BundleSchema, fetch(`/api/bundles/${bundleId}`, { ...fetchOptions, method: 'GET' })),
  fetchAll: (showPublic: boolean, fetchOptions?: RequestInit) =>
    typedFetch(
      z.array(BundleSchema),
      fetch(`/api/bundles${showPublic ? '?public=true' : ''}`, fetchOptions)
    ),
  create: (
    bundle: Omit<Bundle, 'id' | 'likes' | 'dislikes'>,
    fetchOptions?: Omit<RequestInit, 'method'>
  ) =>
    typedFetch(
      BundleSchema,
      fetch('/api/bundles', {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(bundle),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
      })
    ),
  update: (bundleId: string, bundle: Partial<Bundle>, fetchOptions?: Omit<RequestInit, 'method'>) =>
    typedFetch(
      BundleSchema,
      fetch(`/api/bundles/${bundleId}`, {
        ...fetchOptions,
        method: 'PATCH',
        body: JSON.stringify(bundle)
      })
    ),
  delete: (bundleId: string, fetchOptions?: Omit<RequestInit, 'method'>) =>
    typedFetch(z.void(), fetch(`/api/bundles/${bundleId}`, { ...fetchOptions, method: 'DELETE' })),
  like: (bundleId: string, fetchOptions?: Omit<RequestInit, 'method'>) =>
    typedFetch(
      BundleSchema,
      fetch(`/api/bundles/${bundleId}/like`, { ...fetchOptions, method: 'POST' })
    ),
  dislike: (bundleId: string, fetchOptions?: Omit<RequestInit, 'method'>) =>
    typedFetch(
      BundleSchema,
      fetch(`/api/bundles/${bundleId}/dislike`, { ...fetchOptions, method: 'POST' })
    )
};

export default bundle;
