import { HttpError } from '@app-src/lib/error';
import prisma from '@app-src/lib/prisma';
import { objectIdSchema } from '@app-src/lib/zod';
import { BundleSchema } from '@app-src/server/bundle';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { Bundle } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';
import { z } from 'zod';

const isUserBundle = (token: JWT, bundle: Bundle) => {
  if (bundle.userId === token.user.id) return true;

  return false;
};

export default withProtectedTypedApiRoute({
  GET: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    output: BundleSchema,
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundle = await prisma.bundle.findUnique({
        where: { id: query.id }
      });

      if (!bundle) throw new HttpError('NOT_FOUND', 'Requested bundle does not exist');
      if (!isUserBundle(token, bundle) && bundle.visibility !== 'PUBLIC')
        throw new HttpError('FORBIDDEN', 'Tried to access unauthorized bundle');

      return bundle;
    }
  }),
  PATCH: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    body: BundleSchema.partial(),
    output: BundleSchema,
    isProtected: true,
    handler: async ({ query, body, token }) => {
      const bundle = await prisma.bundle.findUnique({
        where: { id: query.id }
      });

      if (!bundle) throw new HttpError('NOT_FOUND', 'Requested bundle does not exist');
      if (!isUserBundle(token, bundle))
        throw new HttpError('FORBIDDEN', 'Tried to access unauthorized bundle');

      const updatedData = {
        name: body.name || bundle.name,
        addresses: body.addresses || bundle.addresses,
        visibility: body.visibility || bundle.visibility
      };

      const updatedBundle = await prisma.bundle.update({
        where: {
          id: query.id
        },
        data: updatedData
      });

      return updatedBundle;
    }
  }),
  DELETE: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundle = await prisma.bundle.findUnique({
        where: { id: query.id }
      });

      if (!bundle) throw new HttpError('NOT_FOUND', 'Requested bundle does not exist');
      if (!isUserBundle(token, bundle))
        throw new HttpError('FORBIDDEN', 'Tried to access unauthorized bundle');

      await prisma.bundle.delete({
        where: {
          id: query.id
        }
      });
    }
  })
});
