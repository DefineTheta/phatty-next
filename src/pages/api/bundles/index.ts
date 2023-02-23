import prisma from '@app-src/lib/prisma';
import { BundleSchema } from '@app-src/server/bundle';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { z } from 'zod';

export default withProtectedTypedApiRoute({
  GET: typedApiRoute({
    query: z.object({ public: z.coerce.boolean().optional() }),
    output: z.array(BundleSchema),
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundles = await prisma.bundle.findMany({
        where: query.public ? { visibility: 'PUBLIC' } : { userId: token.user.id }
      });

      return bundles;
    }
  }),
  POST: typedApiRoute({
    body: BundleSchema.omit({ id: true }),
    output: BundleSchema,
    isProtected: true,
    handler: async ({ body, token }) => {
      const bundle = await prisma.bundle.create({
        data: {
          ...body,
          user: {
            connect: {
              id: token.user.id
            }
          }
        }
      });

      return bundle;
    }
  })
});
