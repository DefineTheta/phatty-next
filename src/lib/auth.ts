import { signIn as authSignIn } from 'next-auth/react';
import { AuthenticationError, MetamaskError } from './error';
import { getMetamaskAccount, signWithMetamask } from './metamask';

export const getCsrfToken = async (signal: AbortSignal) => {
  const response = await fetch('/api/auth/csrf', {
    signal,
    cache: 'no-store'
  });
  const csrf: { csrfToken: string } = await response.json();

  return csrf.csrfToken;
};

export const signIn = async (signal: AbortSignal) => {
  try {
    const address = await getMetamaskAccount();

    const date = new Date();
    const dateStr = date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100;
    const msg = `${dateStr}${address}`;

    const sign = await signWithMetamask([msg, address]);

    if (typeof sign !== 'string')
      throw new MetamaskError('There was an error signing message with metamask');

    const csrfToken = await getCsrfToken(signal);

    const signInResponse = await authSignIn('metamask', { address, sign, redirect: false });

    if (signInResponse?.status !== 200)
      throw new AuthenticationError('There was an error authenticating during signin');
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
  }
};
