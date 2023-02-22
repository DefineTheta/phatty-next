import { User } from '@prisma/client';
import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}
