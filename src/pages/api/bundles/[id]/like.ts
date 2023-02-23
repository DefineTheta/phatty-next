import { HttpError } from '@app-src/lib/error';
import prisma from '@app-src/lib/prisma';
import { objectIdSchema } from '@app-src/lib/zod';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { z } from 'zod';

export default withProtectedTypedApiRoute({
  POST: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundle = await prisma.bundle.findFirst({
        where: {
          id: query.id,
          visibility: 'PUBLIC'
        }
      });

      if (!bundle) throw new HttpError('NOT_FOUND', 'Requested bundle does not exist');

      const isLikedByUser = bundle.likedBy.find((id) => id === token.user.id);
    }
  })
});
