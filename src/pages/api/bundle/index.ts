import prisma from '@app-src/lib/prisma';
import { objectIdSchema } from '@app-src/lib/zod';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { z } from 'zod';

export default withProtectedTypedApiRoute({
  POST: typedApiRoute({
    body: z.object({ name: z.string() }),
    output: z.object({ bundleId: objectIdSchema }),
    isProtected: true,
    handler: async ({ body, token }) => {
      const bundle = await prisma.bundle.create({
        data: {
          name: body.name,
          user: {
            connect: {
              id: token.user.id
            }
          }
        }
      });

      return {
        bundleId: bundle.id
      };
    }
  })
});
