import prisma from '@app-src/lib/prisma';
import { ObjectIdSchema } from '@app-src/lib/zod';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { z } from 'zod';

export default withProtectedTypedApiRoute({
  POST: typedApiRoute(
    z.object({ userId: ObjectIdSchema }),
    z.object({ bundleId: ObjectIdSchema }),
    async ({ input }) => {
      const bundle = await prisma.bundle.create({
        data: {
          name: 'Test',
          user: {
            connect: {
              id: input.userId
            }
          }
        }
      });

      return {
        bundleId: bundle.id
      };
    }
  )
});
