import { HttpError } from '@app-src/lib/error';
import prisma from '@app-src/lib/prisma';
import { objectIdSchema } from '@app-src/lib/zod';
import { BundleSchema } from '@app-src/server/bundle';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';
import { z } from 'zod';

export default withProtectedTypedApiRoute({
  POST: typedApiRoute({
    query: z.object({ id: objectIdSchema }),
    output: BundleSchema,
    isProtected: true,
    handler: async ({ query, token }) => {
      const bundle = await prisma.bundle.findFirst({
        where: {
          id: query.id,
          visibility: 'PUBLIC'
        }
      });

      if (!bundle) throw new HttpError('NOT_FOUND', 'Requested bundle does not exist');

      const isDislikedByUser = bundle.dislikedByUserIds.find((id) => id === token.user.id);
      if (isDislikedByUser) return bundle;

      const isLikedByUser = bundle.likedByUserIds.find((id) => id === token.user.id);

      const updatedBundle = await prisma.bundle.update({
        where: {
          id: query.id
        },
        data: {
          dislikes: {
            increment: 1
          },
          likes: {
            decrement: isLikedByUser ? 1 : 0
          },
          dislikedByUsers: {
            connect: {
              id: token.user.id
            }
          },
          likedByUsers: isLikedByUser
            ? {
                disconnect: {
                  id: token.user.id
                }
              }
            : undefined
        }
      });

      return updatedBundle;
    }
  })
});
