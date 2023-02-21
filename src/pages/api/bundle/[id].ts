import { AuthorizationError, NotFoundError } from '@app-src/lib/error';
import prisma from '@app-src/lib/prisma';
import { objectIdSchema, web3AddressSchema } from '@app-src/lib/zod';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { Bundle } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';
import { z } from 'zod';

const isUserAuthorized = (token: JWT | null, bundle: Bundle) => {
  if (!token || bundle.userId !== token.user.id) return false;

  return true;
};

export default withProtectedTypedApiRoute({
  GET: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    output: z.object({ addresses: z.array(z.string()) }),
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundle = await prisma.bundle.findUnique({
        where: { id: query.id }
      });

      if (!bundle) throw new NotFoundError('Requested bundle does not exist');
      if (!isUserAuthorized(token, bundle))
        throw new AuthorizationError('Tried to access unauthorized bundle');

      return {
        addresses: bundle.addresses
      };
    }
  }),
  PATCH: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    body: z.object({ addresses: z.array(web3AddressSchema) }),
    output: z.object({
      id: objectIdSchema,
      addresses: z.array(web3AddressSchema),
      userId: objectIdSchema
    }),
    isProtected: true,
    handler: async ({ query, body, token }) => {
      const bundle = await prisma.bundle.findUnique({
        where: { id: query.id }
      });

      if (!bundle) throw new NotFoundError('Requested bundle does not exist');
      if (!isUserAuthorized(token, bundle))
        throw new AuthorizationError('Tried to access unauthorized bundle');

      const updatedBundle = await prisma.bundle.update({
        where: {
          id: query.id
        },
        data: {
          addresses: body.addresses
        }
      });

      return {
        id: updatedBundle.id,
        addresses: updatedBundle.addresses,
        userId: updatedBundle.userId
      };
    }
  }),
  DELETE: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundle = await prisma.bundle.findUnique({
        where: { id: query.id }
      });

      if (!bundle) throw new NotFoundError('Requested bundle does not exist');
      if (!isUserAuthorized(token, bundle))
        throw new AuthorizationError('Tried to access unauthorized bundle');

      await prisma.bundle.delete({
        where: {
          id: query.id
        }
      });
    }
  })
});
