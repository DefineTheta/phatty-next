import { JWT } from 'next-auth/jwt';

type Handler<T extends boolean> = ({ token }: { token: T extends true ? JWT : null }) => void;

// type Func = <T extends boolean>({
//   isProtected,
//   handler
// }: {
//   isProtected: T;
//   handler: Handler<T>;
// }) => void;

export function func({
  isProtected,
  handler
}: {
  isProtected: false;
  handler: Handler<false>;
}): void;
export function func({ isProtected, handler }: { isProtected: true; handler: Handler<true> }): void;

export function func({
  isProtected,
  handler
}: {
  isProtected: boolean;
  handler: Handler<boolean>;
}): void {
  const token = {
    sub: '63f3502f926a1d13b69c2a8d',
    user: { id: '63f3502f926a1d13b69c2a8d' },
    iat: 1676892597,
    exp: 1679484597,
    jti: 'f835b274-f4c2-40d6-9572-b8a2f067fe1b'
  } as JWT | null;

  if (isProtected) {
    const a = handler({ token });
  }
}

const bb = func({
  isProtected: false,
  handler: ({ token }) => {
    return;
  }
});

// export const func = ({ isProtected, handler }) => {
//   const token = {
//     sub: '63f3502f926a1d13b69c2a8d',
//     user: { id: '63f3502f926a1d13b69c2a8d' },
//     iat: 1676892597,
//     exp: 1679484597,
//     jti: 'f835b274-f4c2-40d6-9572-b8a2f067fe1b'
//   } as JWT | null;

//   if (token !== null) {
//     const a = handler({ token });
//   }
// };
