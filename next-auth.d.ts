import { User } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth/core/types' {
  interface Session {
    user: {
      connectedAddress: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}
