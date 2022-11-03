import {
  ApiBaseResponse,
  AuthResponse,
  HexResponse,
  PancakeResponse,
  PhiatResponse,
  PulsexResponse,
  SushiResponse,
  UniV2Response,
  UniV3Response,
  WalletResponse
} from '@app-src/types/api';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.message = 'AuthenticationError';
  }
}

export const getAccountFromMetamask = async () => {
  const accounts = await window.ethereum?.request<string[]>({ method: 'eth_requestAccounts' });

  if (!accounts) throw new Error('Could not get address from metamask');

  return accounts[0] as string;
};

export const authorize = async (signal: AbortSignal) => {
  try {
    signal.onabort = () => {
      throw new DOMException('Authorization aborted');
    };

    console.log('REAUTHORIZING');

    const address = await getAccountFromMetamask();

    const date = new Date();
    const dateStr = date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100;
    const msg = `${dateStr}${address}`;

    const sign = await window.ethereum?.request<string>({
      method: 'personal_sign',
      params: [msg, address]
    });

    const response = await fetch(`/api/auth/verify?address=${address}&sign=${sign}`, {
      signal,
      cache: 'no-store'
    });
    const data: AuthResponse = await response.json();

    if (!data.success) {
      alert('Error occured trying to authorize');
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
  }
};

export const getWithAuthentication = async <T>(
  apiRequestFn: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal
) => {
  try {
    return await apiRequestFn(signal);
  } catch (err) {
    if (err instanceof AuthenticationError) {
      console.warn(
        'Tried to acced an authenticated API route when not authenticated. Atempting to authenticate.'
      );

      const isAuthroized = await authorize(signal);

      if (!isAuthroized) return;

      return await apiRequestFn(signal);
    }
  }
};

const getPaginatedData = async <T extends ApiBaseResponse>(URL: string) => {
  const responses: T[] = [];

  let keepFetching = true;
  let page = 1;

  while (keepFetching) {
    const res = await fetch(`${URL}&page=${page}`);
    const data: T = await res.json();

    responses.push(data);

    if (data.next === null) keepFetching = false;
    else page = data.next;
  }

  return responses;
};

const getMultipleAddressData = async <T>(addresses: string[], apiEndpoint: string) => {
  const fetchPromises: Promise<Response>[] = [];
  const serializePromises: Promise<T>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(fetch(`${apiEndpoint}?address=${address}`));
  });

  const responses = await Promise.all(fetchPromises);

  responses.forEach((response) => {
    serializePromises.push(response.json());
  });

  return Promise.all(serializePromises);
};

export const getWallet = async (addresses: string[]) => {
  const fetchPromises: Promise<Response>[] = [];
  const serializePromises: Promise<WalletResponse>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(fetch(`/api/wallet?address=${address}&gt=0`));
  });

  const responses = await Promise.all(fetchPromises);

  responses.forEach((response) => {
    serializePromises.push(response.json());
  });

  const walletData = await Promise.all(serializePromises);

  if (walletData.length === 1) return walletData[0];

  const collatedRes = {
    data: {
      ETHEREUM: {
        data: [],
        totalValue: 0
      },
      BSC: {
        data: [],
        totalValue: 0
      },
      TPLS: {
        data: [],
        totalValue: 0
      }
    }
  } as WalletResponse;

  walletData.forEach((wallet) => {
    collatedRes.data.ETHEREUM.data = collatedRes.data.ETHEREUM.data.concat(
      wallet.data.ETHEREUM.data
    );
    collatedRes.data.BSC.data = collatedRes.data.BSC.data.concat(wallet.data.BSC.data);
    collatedRes.data.TPLS.data = collatedRes.data.TPLS.data.concat(wallet.data.TPLS.data);

    collatedRes.data.ETHEREUM.totalValue += wallet.data.ETHEREUM.totalValue;
    collatedRes.data.BSC.totalValue += wallet.data.BSC.totalValue;
    collatedRes.data.TPLS.totalValue += wallet.data.TPLS.totalValue;
  });

  return collatedRes;
};

export const getHex = async (addresses: string[]) => {
  const fetchPromises: Promise<HexResponse[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(getPaginatedData(`/api/hex?address=${address}`));
  });

  const hexDataArr = await Promise.all(fetchPromises);

  if (hexDataArr.length === 1 && hexDataArr[0].length === 1) return hexDataArr[0][0];

  const collatedRes = {
    data: {
      ETHEREUM: {
        data: [],
        totalValue: 0
      },
      TPLS: {
        data: [],
        totalValue: 0
      }
    },
    next: null
  } as HexResponse;

  hexDataArr.forEach((arr) => {
    arr.forEach((hex) => {
      collatedRes.data.ETHEREUM.data = collatedRes.data.ETHEREUM.data.concat(
        hex.data.ETHEREUM.data
      );
      collatedRes.data.ETHEREUM.totalValue += hex.data.ETHEREUM.totalValue;

      collatedRes.data.TPLS.data = collatedRes.data.TPLS.data.concat(hex.data.TPLS.data);
      collatedRes.data.TPLS.totalValue += hex.data.TPLS.totalValue;
    });
  });

  return collatedRes;
};

export const getPhiat = async (addresses: string[]) => {
  const fetchPromises: Promise<PhiatResponse[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(getPaginatedData(`/api/phiat?address=${address}`));
  });

  const phiatDataArr = await Promise.all(fetchPromises);

  if (phiatDataArr.length === 1 && phiatDataArr[0].length === 1) return phiatDataArr[0][0];

  const collatedRes = {
    data: {
      STABLE_DEBT: {
        data: [],
        totalValue: 0
      },
      VARIABLE_DEBT: {
        data: [],
        totalValue: 0
      },
      LENDING: {
        data: [],
        totalValue: 0
      },
      STAKING: {
        data: [],
        totalValue: 0
      },
      PH_TOKENS: {
        data: [],
        totalValue: 0
      },
      STAKING_APY: 0
    },
    next: null
  } as PhiatResponse;

  phiatDataArr.forEach((arr) => {
    arr.forEach((phiat) => {
      collatedRes.data.STABLE_DEBT.data = collatedRes.data.STABLE_DEBT.data.concat(
        phiat.data.STABLE_DEBT.data
      );
      collatedRes.data.VARIABLE_DEBT.data = collatedRes.data.VARIABLE_DEBT.data.concat(
        phiat.data.VARIABLE_DEBT.data
      );
      collatedRes.data.LENDING.data = collatedRes.data.LENDING.data.concat(phiat.data.LENDING.data);
      collatedRes.data.STAKING.data = collatedRes.data.STAKING.data.concat(phiat.data.STAKING.data);
      collatedRes.data.PH_TOKENS.data = collatedRes.data.PH_TOKENS.data.concat(
        phiat.data.PH_TOKENS.data
      );

      collatedRes.data.STABLE_DEBT.totalValue += phiat.data.STABLE_DEBT.totalValue;
      collatedRes.data.VARIABLE_DEBT.totalValue += phiat.data.VARIABLE_DEBT.totalValue;
      collatedRes.data.LENDING.totalValue += phiat.data.LENDING.totalValue;
      collatedRes.data.STAKING.totalValue += phiat.data.STAKING.totalValue;
      collatedRes.data.PH_TOKENS.totalValue += phiat.data.PH_TOKENS.totalValue;

      collatedRes.data.STAKING_APY = phiat.data.STAKING_APY;
    });
  });

  return collatedRes;
};

export const getPulsex = async (addresses: string[]) => {
  const fetchPromises: Promise<Response>[] = [];
  const serializePromises: Promise<PulsexResponse>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(fetch(`/api/pulsex?address=${address}`));
  });

  const responses = await Promise.all(fetchPromises);

  responses.forEach((response) => {
    serializePromises.push(response.json());
  });

  const pulsexData = await Promise.all(serializePromises);

  if (pulsexData.length === 1) return pulsexData[0];

  const collatedRes = {
    data: {
      LIQUIDITY_POOL: {
        data: [],
        totalValue: 0
      }
    }
  } as PulsexResponse;

  pulsexData.forEach((pulsex) => {
    collatedRes.data.LIQUIDITY_POOL.data = collatedRes.data.LIQUIDITY_POOL.data.concat(
      pulsex.data.LIQUIDITY_POOL.data
    );
    collatedRes.data.LIQUIDITY_POOL.totalValue += pulsex.data.LIQUIDITY_POOL.totalValue;
  });

  return collatedRes;
};

export const getPancake = async (addresses: string[]) => {
  const fetchPromises: Promise<Response>[] = [];
  const serializePromises: Promise<PancakeResponse>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(fetch(`/api/pancake?address=${address}`));
  });

  const responses = await Promise.all(fetchPromises);

  responses.forEach((response) => {
    serializePromises.push(response.json());
  });

  const pancakeData = await Promise.all(serializePromises);

  if (pancakeData.length === 1) return pancakeData[0];

  const collatedRes = {
    data: {
      LIQUIDITY_POOL: {
        data: [],
        totalValue: 0
      },
      FARMING: {
        data: [],
        totalValue: 0
      }
    }
  } as PancakeResponse;

  pancakeData.forEach((pancake) => {
    collatedRes.data.LIQUIDITY_POOL.data = collatedRes.data.LIQUIDITY_POOL.data.concat(
      pancake.data.LIQUIDITY_POOL.data
    );
    collatedRes.data.FARMING.data = collatedRes.data.FARMING.data.concat(pancake.data.FARMING.data);

    collatedRes.data.LIQUIDITY_POOL.totalValue += pancake.data.LIQUIDITY_POOL.totalValue;
    collatedRes.data.FARMING.totalValue += pancake.data.FARMING.totalValue;
  });

  return collatedRes;
};

export const getSushi = async (addresses: string[]) => {
  const sushiData = await getMultipleAddressData<SushiResponse>(addresses, '/api/sushi');

  if (sushiData.length === 1) return sushiData[0];

  const collatedRes = {
    data: {
      LIQUIDITY_POOL: {
        data: [],
        totalValue: 0
      }
    }
  } as SushiResponse;

  sushiData.forEach((sushi) => {
    collatedRes.data.LIQUIDITY_POOL.data = collatedRes.data.LIQUIDITY_POOL.data.concat(
      sushi.data.LIQUIDITY_POOL.data
    );

    collatedRes.data.LIQUIDITY_POOL.totalValue += sushi.data.LIQUIDITY_POOL.totalValue;
  });

  return collatedRes;
};

export const getUniV2 = async (addresses: string[]) => {
  const uniV2Data = await getMultipleAddressData<UniV2Response>(addresses, '/api/univ2');

  if (uniV2Data.length === 1) return uniV2Data[0];

  const collatedRes = {
    data: {
      LIQUIDITY_POOL: {
        data: [],
        totalValue: 0
      }
    }
  } as UniV2Response;

  uniV2Data.forEach((uniV2) => {
    collatedRes.data.LIQUIDITY_POOL.data = collatedRes.data.LIQUIDITY_POOL.data.concat(
      uniV2.data.LIQUIDITY_POOL.data
    );

    collatedRes.data.LIQUIDITY_POOL.totalValue += uniV2.data.LIQUIDITY_POOL.totalValue;
  });

  return collatedRes;
};

export const getUniV3 = async (addresses: string[]) => {
  const fetchPromises: Promise<UniV3Response[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(getPaginatedData(`/api/univ3?address=${address}`));
  });

  const uniV3DataArr = await Promise.all(fetchPromises);

  if (uniV3DataArr.length === 1 && uniV3DataArr[0].length === 1) return uniV3DataArr[0][0];

  const collatedRes = {
    data: {
      LIQUIDITY_POOL: {
        data: [],
        totalValue: 0
      }
    },
    next: null
  } as UniV3Response;

  uniV3DataArr.forEach((arr) => {
    arr.forEach((uniV3) => {
      collatedRes.data.LIQUIDITY_POOL.data = collatedRes.data.LIQUIDITY_POOL.data.concat(
        uniV3.data.LIQUIDITY_POOL.data
      );

      collatedRes.data.LIQUIDITY_POOL.totalValue += uniV3.data.LIQUIDITY_POOL.totalValue;
    });
  });

  return collatedRes;
};
