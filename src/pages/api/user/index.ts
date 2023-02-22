import { HttpError } from '@app-src/lib/error';
import prisma from '@app-src/lib/prisma';
import { UserSchema } from '@app-src/server/user';
import { typedApiRoute, withProtectedTypedApiRoute } from '@app-src/utils/tapi';

export default withProtectedTypedApiRoute({
  GET: typedApiRoute({
    output: UserSchema,
    isProtected: true,
    handler: async ({ token }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: token.user.id
        },
        select: {
          connectedAddresses: true
        }
      });

      if (!user) throw new HttpError('INTERNAL_SERVER_ERROR', 'Could not find the user');

      return user;
    }
  })
});
