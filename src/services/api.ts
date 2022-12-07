import { roundToPrecision } from '@app-src/common/utils/format';
import {
  ApiBaseResponse,
  AuthResponse,
  HedronResponse,
  HexResponse,
  PancakeResponse,
  PhamousItem,
  PhamousResponse,
  PhiatResponse,
  PulsexResponse,
  SushiResponse,
  UniV2Response,
  UniV3Response,
  WalletResponse,
  WalletTokenItem,
  XenResponse
} from '@app-src/types/api';
import { ProtocolData } from './protocol';

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

const getPaginatedData = async <T extends ApiBaseResponse>(URL: string, options?: RequestInit) => {
  const responses: T[] = [];

  let keepFetching = true;
  let page = 1;

  while (keepFetching) {
    const res = await fetch(
      `${URL}&page=${page}${options?.cache === 'reload' ? '&_vercel_no_cache=1' : ''}`,
      options
    );
    const data: T = await res.json();

    responses.push(data);

    if (data.next === null) keepFetching = false;
    else page = data.next;
  }

  return responses;
};

const getMultipleAddressData = async <T>(
  addresses: string[],
  apiEndpoint: string,
  options?: RequestInit
) => {
  const fetchPromises: Promise<Response>[] = [];
  const serializePromises: Promise<T>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(
      fetch(
        `${apiEndpoint}?address=${address}${
          options?.cache === 'reload' ? '&_vercel_no_cache=1' : ''
        }`,
        options
      )
    );
  });

  const responses = await Promise.all(fetchPromises);

  responses.forEach((response) => {
    serializePromises.push(response.json());
  });

  return Promise.all(serializePromises);
};

export const getSeaCreature = (p: number) => {
  if (p <= 0.000001) {
    return {
      icon: '🐚',
      name: 'Shell',
      sum: `${roundToPrecision(p, 7)}%`
    };
  } else if (p <= 0.00001) {
    return {
      icon: '🦐',
      name: 'Shrimp',
      sum: `${roundToPrecision(p, 6)}%`
    };
  } else if (p <= 0.0001) {
    return {
      icon: '🦀',
      name: 'Crab',
      sum: `${roundToPrecision(p, 5)}%`
    };
  } else if (p <= 0.001) {
    return {
      icon: '🐢',
      name: 'Turtle',
      sum: `${roundToPrecision(p, 4)}%`
    };
  } else if (p <= 0.01) {
    return {
      icon: '🦑',
      name: 'Squid',
      sum: `${roundToPrecision(p, 3)}%`
    };
  } else if (p <= 0.1) {
    return {
      icon: '🐬',
      name: 'Dolphin',
      sum: `${roundToPrecision(p, 2)}%`
    };
  } else if (p <= 1) {
    return {
      icon: '🦈',
      name: 'Shark',
      sum: `${roundToPrecision(p, 2)}%`
    };
  } else if (p <= 10) {
    return {
      icon: '🐋',
      name: 'Whale',
      sum: `${roundToPrecision(p, 2)}%`
    };
  } else {
    return {
      icon: '🔱',
      name: 'Poseidon',
      sum: `${roundToPrecision(p, 2)}%`
    };
  }
};

export const getWallet = async (addresses: string[], refresh: boolean) => {
  const walletData = await getMultipleAddressData<WalletResponse>(addresses, '/api/wallet', {
    cache: refresh ? 'reload' : 'default'
  });

  if (walletData.length === 1) return walletData[0];

  const collatedRes = {
    data: {
      ETH: {
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
      },
      MATIC: {
        data: [],
        totalValue: 0
      },
      AVAX: {
        data: [],
        totalValue: 0
      },
      FTM: {
        data: [],
        totalValue: 0
      }
    }
  } as WalletResponse;

  const protocolData = new ProtocolData<WalletTokenItem>(
    6,
    (item) => item.chain + item.name,
    (existingItem, item) => {
      existingItem.balance += item.balance;
      existingItem.usdValue += item.usdValue;
    }
  );

  walletData.forEach((wallet) => {
    protocolData.collate([
      wallet.data.ETH.data,
      wallet.data.BSC.data,
      wallet.data.TPLS.data,
      wallet.data.MATIC.data,
      wallet.data.AVAX.data,
      wallet.data.FTM.data
    ]);

    collatedRes.data.ETH.totalValue += wallet.data.ETH.totalValue;
    collatedRes.data.BSC.totalValue += wallet.data.BSC.totalValue;
    collatedRes.data.TPLS.totalValue += wallet.data.TPLS.totalValue;
    collatedRes.data.MATIC.totalValue += wallet.data.MATIC.totalValue;
    collatedRes.data.AVAX.totalValue += wallet.data.AVAX.totalValue;
    collatedRes.data.FTM.totalValue += wallet.data.FTM.totalValue;
  });

  const collatedData = protocolData.data;

  collatedRes.data.ETH.data = collatedData[0];
  collatedRes.data.BSC.data = collatedData[1];
  collatedRes.data.TPLS.data = collatedData[2];
  collatedRes.data.MATIC.data = collatedData[3];
  collatedRes.data.AVAX.data = collatedData[4];
  collatedRes.data.FTM.data = collatedData[5];

  return collatedRes;
};

export const getHex = async (addresses: string[], refresh: boolean) => {
  const fetchPromises: Promise<HexResponse[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(
      getPaginatedData(`/api/hex?address=${address}`, {
        cache: refresh ? 'reload' : 'default'
      })
    );
  });

  const hexDataArr = await Promise.all(fetchPromises);

  if (hexDataArr.length === 1 && hexDataArr[0].length === 1) return hexDataArr[0][0];

  const collatedRes = {
    data: {
      ETHEREUM: {
        data: [],
        totalValue: 0,
        totalTSharesPercentage: 0
      },
      TPLS: {
        data: [],
        totalValue: 0,
        totalTSharesPercentage: 0
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
      collatedRes.data.ETHEREUM.totalTSharesPercentage += hex.data.ETHEREUM.totalTSharesPercentage;

      collatedRes.data.TPLS.data = collatedRes.data.TPLS.data.concat(hex.data.TPLS.data);
      collatedRes.data.TPLS.totalValue += hex.data.TPLS.totalValue;
      collatedRes.data.TPLS.totalTSharesPercentage += hex.data.TPLS.totalTSharesPercentage;
    });
  });

  return collatedRes;
};

export const getPhiat = async (addresses: string[], refresh: boolean) => {
  const fetchPromises: Promise<PhiatResponse[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(
      getPaginatedData(`/api/phiat?address=${address}`, {
        cache: refresh ? 'reload' : 'default'
      })
    );
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

export const getPulsex = async (addresses: string[], refresh: boolean) => {
  const pulsexData = await getMultipleAddressData<PulsexResponse>(addresses, '/api/pulsex', {
    cache: refresh ? 'reload' : 'default'
  });

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

export const getPancake = async (addresses: string[], refresh: boolean) => {
  const pancakeData = await getMultipleAddressData<PancakeResponse>(addresses, '/api/pancake', {
    cache: refresh ? 'reload' : 'default'
  });

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

export const getSushi = async (addresses: string[], refresh: boolean) => {
  const sushiData = await getMultipleAddressData<SushiResponse>(addresses, '/api/sushi', {
    cache: refresh ? 'reload' : 'default'
  });

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

export const getUniV2 = async (addresses: string[], refresh: boolean) => {
  const uniV2Data = await getMultipleAddressData<UniV2Response>(addresses, '/api/univ2', {
    cache: refresh ? 'reload' : 'default'
  });

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

export const getUniV3 = async (addresses: string[], refresh: boolean) => {
  const fetchPromises: Promise<UniV3Response[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(
      getPaginatedData(`/api/univ3?address=${address}`, { cache: refresh ? 'reload' : 'default' })
    );
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

export const getHedron = async (addresses: string[], refresh: boolean) => {
  const hedronData = await getMultipleAddressData<HedronResponse>(addresses, '/api/hedron', {
    cache: refresh ? 'reload' : 'default'
  });

  if (hedronData.length === 1) return hedronData[0];

  const collatedRes = {
    data: {
      ETH: {
        data: [],
        totalValue: 0
      },
      TPLS: {
        data: [],
        totalValue: 0
      }
    }
  } as HedronResponse;

  hedronData.forEach((hedron) => {
    collatedRes.data.ETH.data = collatedRes.data.ETH.data.concat(hedron.data.ETH.data);
    collatedRes.data.ETH.totalValue += hedron.data.ETH.totalValue;

    collatedRes.data.TPLS.data = collatedRes.data.TPLS.data.concat(hedron.data.TPLS.data);
    collatedRes.data.TPLS.totalValue += hedron.data.TPLS.totalValue;
  });

  return collatedRes;
};

export const getPhamous = async (addresses: string[], refresh: boolean) => {
  const phamousData = await getMultipleAddressData<PhamousResponse>(addresses, '/api/phamous', {
    cache: refresh ? 'reload' : 'default'
  });

  if (phamousData.length === 1) return phamousData[0];

  const collatedRes = {
    data: {
      LIQUIDITY_PROVIDING: {
        data: [],
        totalValue: 0
      },
      STAKING: {
        data: [],
        totalValue: 0
      },
      REWARD: {
        data: [],
        totalValue: 0
      }
    }
  } as PhamousResponse;

  const protocolData = new ProtocolData<PhamousItem>(
    3,
    (item) => item.symbol,
    (existingItem, item) => {
      existingItem.balance += item.balance;
      existingItem.usdValue += item.usdValue;
    }
  );

  phamousData.forEach((phamous) => {
    protocolData.collate([
      phamous.data.LIQUIDITY_PROVIDING.data,
      phamous.data.STAKING.data,
      phamous.data.REWARD.data
    ]);

    collatedRes.data.LIQUIDITY_PROVIDING.totalValue += phamous.data.LIQUIDITY_PROVIDING.totalValue;
    collatedRes.data.STAKING.totalValue += phamous.data.STAKING.totalValue;
    collatedRes.data.REWARD.totalValue += phamous.data.REWARD.totalValue;
  });

  const collatedData = protocolData.data;

  collatedRes.data.LIQUIDITY_PROVIDING.data = collatedData[0];
  collatedRes.data.STAKING.data = collatedData[1];
  collatedRes.data.REWARD.data = collatedData[2];

  return collatedRes;
};

export const getXen = async (addresses: string[], refresh: boolean) => {
  const fetchPromises: Promise<XenResponse[]>[] = [];

  addresses.forEach((address) => {
    fetchPromises.push(
      getPaginatedData(`/api/xen?address=${address}`, { cache: refresh ? 'reload' : 'default' })
    );
  });

  const xenDataArr = await Promise.all(fetchPromises);

  if (xenDataArr.length === 1 && xenDataArr[0].length === 1) return xenDataArr[0][0];

  const collatedRes = {
    data: {
      STAKING: {
        data: [],
        totalValue: 0
      },
      MINTING: {
        data: [],
        totalValue: 0
      }
    },
    next: null
  } as XenResponse;

  xenDataArr.forEach((arr) => {
    arr.forEach((xen) => {
      collatedRes.data.STAKING.data = collatedRes.data.STAKING.data.concat(xen.data.STAKING.data);
      collatedRes.data.MINTING.data = collatedRes.data.MINTING.data.concat(xen.data.MINTING.data);

      collatedRes.data.MINTING.totalValue += xen.data.MINTING.totalValue;
      collatedRes.data.STAKING.totalValue += xen.data.STAKING.totalValue;
    });
  });

  return collatedRes;
};
