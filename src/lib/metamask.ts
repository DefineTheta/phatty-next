import { MetamaskError } from './error';

export const getMetamaskAccount = async () => {
  const accounts = await window.ethereum?.request<string[]>({ method: 'eth_requestAccounts' });

  if (!accounts) throw new MetamaskError('Could not get address from metamask');

  return accounts[0] as string;
};

export const signWithMetamask = async (params: string[]) => {
  return await window.ethereum?.request<string>({
    method: 'personal_sign',
    params: params
  });
};
