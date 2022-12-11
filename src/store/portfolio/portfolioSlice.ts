import {
  AuthenticationError,
  getAccountFromMetamask,
  getHedron,
  getHex,
  getPancake,
  getPhamous,
  getPhiat,
  getPulsex,
  getSushi,
  getUniV2,
  getUniV3,
  getWallet,
  getWithAuthentication,
  getXen
} from '@app-src/services/api';
import { AppDispatch, RootState } from '@app-src/store/store';
import {
  AuthResponse,
  BundleResponse,
  HedronResponse,
  HexResponse,
  PancakeResponse,
  PhamousResponse,
  PhiatResponse,
  PublicBundleResponse,
  PulsexResponse,
  SushiResponse,
  UniV2Response,
  UniV3Response,
  WalletResponse,
  XenResponse
} from '@app-src/types/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChainEnum,
  HedronDataComponentEnum,
  HexDataComponentEnum,
  PancakeDataComponentEnum,
  PhamousDataComponentEnum,
  PhiatDataComponentEnum,
  Portfolio,
  PortfolioData,
  PortfolioEnum,
  PortfolioState,
  ProtocolEnum,
  PulsexDataComponentEnum,
  SushiDataComponentEnum,
  UniswapV2DataComponentEnum,
  UniswapV3DataComponentEnum,
  XenDataComponentEnum
} from './types';

type FetchDataInput = { addresses: string[]; refresh: boolean; type: Portfolio } | Portfolio;

const initialPortfolioData: PortfolioData = {
  displayAddress: '',
  addresses: [],
  hasFetched: false,
  [ProtocolEnum.WALLET]: {
    total: {
      [ChainEnum.ETH]: 0,
      [ChainEnum.TPLS]: 0,
      [ChainEnum.BSC]: 0,
      [ChainEnum.MATIC]: 0,
      [ChainEnum.AVAX]: 0,
      [ChainEnum.FTM]: 0,
      [ChainEnum.ARBI]: 0
    },
    loading: true,
    error: false,
    data: {
      [ChainEnum.ETH]: [],
      [ChainEnum.TPLS]: [],
      [ChainEnum.BSC]: [],
      [ChainEnum.MATIC]: [],
      [ChainEnum.AVAX]: [],
      [ChainEnum.FTM]: [],
      [ChainEnum.ARBI]: []
    }
  },
  [ProtocolEnum.HEX]: {
    total: {
      [HexDataComponentEnum.ETH]: 0,
      [HexDataComponentEnum.TPLS]: 0
    },
    totalTSharesPercentage: {
      [HexDataComponentEnum.ETH]: 0,
      [HexDataComponentEnum.TPLS]: 0
    },
    loading: true,
    error: false,
    data: {
      [HexDataComponentEnum.ETH]: [],
      [HexDataComponentEnum.TPLS]: []
    }
  },
  [ProtocolEnum.PHIAT]: {
    total: {
      TPLS: 0
    },
    balance: {
      STAKING: 0
    },
    loading: true,
    error: false,
    data: {
      [PhiatDataComponentEnum.LENDING]: [],
      [PhiatDataComponentEnum.STAKING]: [],
      [PhiatDataComponentEnum.STABLE_DEBT]: [],
      [PhiatDataComponentEnum.VARIABLE_DEBT]: [],
      [PhiatDataComponentEnum.PH_TOKENS]: [],
      STAKING_APY: 0
    }
  },
  [ProtocolEnum.PULSEX]: {
    total: {
      [PulsexDataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: true,
    error: false,
    data: {
      [PulsexDataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.PANCAKE]: {
    total: {
      [PancakeDataComponentEnum.FARMING]: 0,
      [PancakeDataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: true,
    error: false,
    data: {
      [PancakeDataComponentEnum.FARMING]: [],
      [PancakeDataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.SUSHI]: {
    total: {
      [SushiDataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: true,
    error: false,
    data: {
      [SushiDataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.UNISWAPV2]: {
    total: {
      [UniswapV2DataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: true,
    error: false,
    data: {
      [UniswapV2DataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.UNISWAPV3]: {
    total: {
      [UniswapV3DataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: true,
    error: false,
    data: {
      [UniswapV3DataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.HEDRON]: {
    total: {
      [HedronDataComponentEnum.ETH]: 0,
      [HedronDataComponentEnum.TPLS]: 0
    },
    loading: true,
    error: false,
    data: {
      [HedronDataComponentEnum.ETH]: [],
      [HedronDataComponentEnum.TPLS]: []
    }
  },
  [ProtocolEnum.PHAMOUS]: {
    total: {
      TPLS: 0
    },
    balance: {
      STAKING: 0
    },
    loading: true,
    error: false,
    data: {
      [PhamousDataComponentEnum.LIQUIDITY_PROVIDING]: [],
      [PhamousDataComponentEnum.STAKING]: [],
      [PhamousDataComponentEnum.REWARD]: []
    }
  },
  [ProtocolEnum.XEN]: {
    total: {
      ETH: 0
    },
    loading: true,
    error: false,
    data: {
      [XenDataComponentEnum.MINTING]: [],
      [XenDataComponentEnum.STAKING]: []
    }
  }
};

const initialState: PortfolioState = {
  [PortfolioEnum.PROFILE]: initialPortfolioData,
  [PortfolioEnum.BUNDLE]: initialPortfolioData,
  [PortfolioEnum.PUBLIC]: initialPortfolioData
};

const fetchBundleAddresses = createAsyncThunk<BundleResponse, void, { state: RootState }>(
  'portfolio/fetchBundleAddresses',
  async (_, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getWithAuthentication<BundleResponse>(async (signal: AbortSignal) => {
      const address = await getAccountFromMetamask();
      const res = await fetch(`/api/bundle/${address}`, { signal, cache: 'no-store' });

      if (res.status === 401) {
        throw new AuthenticationError('Unauthorized');
      }

      const data: BundleResponse = await res.json();

      return data;
    }, controller.signal);

    if (!data) throw new Error('Unable to fetch bundle addresses');

    return data;
  }
);

const addAddressToBundle = createAsyncThunk<BundleResponse, string, { state: RootState }>(
  'portfolio/addAddressToBundle',
  async (wallet, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getWithAuthentication<BundleResponse>(async (signal: AbortSignal) => {
      const address = await getAccountFromMetamask();
      const res = await fetch(`/api/bundle/${address}`, {
        signal,
        method: 'POST',
        body: JSON.stringify({ wallet }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json'
        })
      });

      if (res.status === 401) {
        throw new AuthenticationError('Unauthorized');
      }

      const data: BundleResponse = await res.json();

      return data;
    }, controller.signal);

    if (!data) throw new Error('Unable to fetch bundle addresses');

    return data;
  }
);

const removeAddressFromBundle = createAsyncThunk<BundleResponse, string, { state: RootState }>(
  'portfolio/removeAddressFromBundle',
  async (wallet, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getWithAuthentication<BundleResponse>(async (signal: AbortSignal) => {
      const address = await getAccountFromMetamask();
      const res = await fetch(`/api/bundle/${address}`, {
        signal,
        method: 'PUT',
        body: JSON.stringify({ wallet }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json'
        })
      });

      if (res.status === 401) {
        throw new AuthenticationError('Unauthorized');
      }

      const data: BundleResponse = await res.json();

      return data;
    }, controller.signal);

    if (!data) throw new Error('Unable to fetch bundle addresses');

    return data;
  }
);

const deleteBundleSession = createAsyncThunk<AuthResponse, void, { state: RootState }>(
  'portfolio/deleteBundleSession',
  async (_, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const res = await fetch('/api/auth/verify', { method: 'DELETE' });
    const data = await res.json();

    return data;
  }
);

const fetchPublicBundleData = createAsyncThunk<PublicBundleResponse, number, { state: RootState }>(
  'portfolio/fetchPublicBundleData',
  async (index, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = [
      {
        name: 'Dummy Bundle',
        addresses: [
          '0x431e81e5dfb5a24541b5ff8762bdef3f32f96354',
          '0xeec0591c07000e41e88efd153801c3fc0a11f7f4',
          '0x3ddfa8ec3052539b6c9549f12cea2c295cff5296'
        ]
      },
      {
        name: 'GodWhale',
        addresses: [
          '0xAF10cC6C50dEFFF901B535691550D7AF208939c5',
          '0x2BDE3b9C0129be4689E245Ba689b9b0Ae4AC666D',
          '0xf1Bd8E36a0e48650bdB28056277B05e851EBbAe8',
          '0x828FD91d3e3a9FFa6305e78B9aE2Cfbc5B5D9f6B',
          '0x1706D193862DA7f8C746aae63d514Df93Dfa5dbf',
          '0xdDf744374B46Aa980ddcE4a5AA216478bf925cD1',
          '0x2fD56159F4C8664a1de5c75E430338CFa58cd5b9',
          '0x807dc01d44407D3EfA0171F6De39076a27F20338',
          '0x3930F94249A66535bc0F177Bc567152320dd7e6c',
          '0x41b20fBb9E38AbeAef31Fa45a9B760D251180A5b',
          '0xF5D7B1B20288B9052E9CbdBf877A19077EdB34d8'
        ]
      },
      {
        name: 'PhiatSac',
        addresses: [
          '0xab502a6fb9b9984341e77716b36484ac13dddc62',
          '0xb7be6284b4f8b808f5204c03dc9b5419840ad73d'
        ]
      },
      {
        name: 'PhameSac',
        addresses: [
          '0xa5bD947Bc9Bb9215c3290FF43f11F708b1d5B263',
          '0xB8bC81524338C84d9BBe6b07B50F4702a7Bb7230'
        ]
      }
    ];

    return { data: data[index] };
  }
);

const fetchWalletData = createAsyncThunk<
  { data: WalletResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchWalletData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getWallet(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getWallet(addresses, false, controller.signal), type: input };
});

const fetchHexData = createAsyncThunk<
  { data: HexResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchHexData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getHex(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getHex(addresses, false, controller.signal), type: input };
});

const fetchPhiatData = createAsyncThunk<
  { data: PhiatResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchPhiatData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getPhiat(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getPhiat(addresses, false, controller.signal), type: input };
});

const fetchPulsexData = createAsyncThunk<
  { data: PulsexResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchPulsexData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getPulsex(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getPulsex(addresses, false, controller.signal), type: input };
});

const fetchPancakeData = createAsyncThunk<
  { data: PancakeResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchPancakeData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getPancake(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getPancake(addresses, false, controller.signal), type: input };
});

const fetchSushiData = createAsyncThunk<
  { data: SushiResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchSushiData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getSushi(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getSushi(addresses, false, controller.signal), type: input };
});

const fetchUniV2Data = createAsyncThunk<
  { data: UniV2Response; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchUniV2Data', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getUniV2(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getUniV2(addresses, false, controller.signal), type: input };
});

const fetchUniV3Data = createAsyncThunk<
  { data: UniV3Response; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchUniV3Data', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getUniV3(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getUniV3(addresses, false, controller.signal), type: input };
});

const fetchHedronData = createAsyncThunk<
  { data: HedronResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchHedronData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getHedron(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getHedron(addresses, false, controller.signal), type: input };
});

const fetchPhamousData = createAsyncThunk<
  { data: PhamousResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchPhamousData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getPhamous(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getPhamous(addresses, false, controller.signal), type: input };
});

const fetchXenData = createAsyncThunk<
  { data: XenResponse; type: Portfolio },
  FetchDataInput,
  { state: RootState }
>('portfolio/fetchXenData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (typeof input === 'object')
    return {
      data: await getXen(input.addresses, input.refresh, controller.signal),
      type: input.type
    };

  const addresses = thunkAPI.getState().portfolio[input].addresses;

  if (!addresses || addresses.length === 0) thunkAPI.rejectWithValue(null);

  return { data: await getXen(addresses, false, controller.signal), type: input };
});

// const fetchPortfolioData = createAsyncThunk<
//   void,
//   { addresses: string[]; type: Portfolio; refresh: boolean; signal: AbortSignal },
//   { state: RootState }
// >('portfolio/fetchPortfolioData', async (input, thunkAPI) => {
//   const promises = [
//     thunkAPI.dispatch(
//       fetchWalletData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchHexData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchPhiatData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchPulsexData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchPancakeData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchSushiData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchUniV2Data({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchUniV3Data({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchHedronData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchPhamousData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     ),
//     thunkAPI.dispatch(
//       fetchXenData({ addresses: input.addresses, refresh: input.refresh, type: input.type })
//     )
//   ];

//   input.signal.onabort = () => {
//     promises.forEach((promise) => promise.abort());
//   };

//   await Promise.all(promises);

//   if (input.signal.aborted) return thunkAPI.rejectWithValue('');
// });

const fetchPortfolioData = (
  dispatch: AppDispatch,
  addresses: string[],
  type: Portfolio,
  signal: AbortSignal,
  refresh = false
) => {
  const promises = [
    dispatch(fetchWalletData({ addresses, refresh, type })),
    dispatch(fetchHexData({ addresses, refresh, type })),
    dispatch(fetchPhiatData({ addresses, refresh, type })),
    dispatch(fetchPulsexData({ addresses, refresh, type })),
    dispatch(fetchPancakeData({ addresses, refresh, type })),
    dispatch(fetchSushiData({ addresses, refresh, type })),
    dispatch(fetchUniV2Data({ addresses, refresh, type })),
    dispatch(fetchUniV3Data({ addresses, refresh, type })),
    dispatch(fetchHedronData({ addresses, refresh, type })),
    dispatch(fetchPhamousData({ addresses, refresh, type })),
    dispatch(fetchXenData({ addresses, refresh, type }))
  ];

  signal.onabort = () => {
    // throw new DOMException('ETH token wallet data aborted!', 'AbortError');
    console.log('ABORT CALLED');
    promises.forEach((promise) => promise.abort());
  };

  return Promise.all(promises);
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    reset: () => initialState,
    clearAddresses: (state, action: PayloadAction<Portfolio>) => {
      state[action.payload].addresses = [];
    },
    clearPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state[action.payload] = initialPortfolioData;
    },
    clearBundlePortfolio: (state) => {
      const { displayAddress, addresses, ...data } = initialPortfolioData;

      state.BUNDLE = { ...state.BUNDLE, ...data };
    },
    setDisplayAddress: (state, action: PayloadAction<{ address: string; type: Portfolio }>) => {
      state[action.payload.type].displayAddress = action.payload.address;
    },
    setAddresses: (state, action: PayloadAction<{ addresses: string[]; type: Portfolio }>) => {
      state[action.payload.type].addresses = action.payload.addresses;
    },
    setHasFetched: (state, action: PayloadAction<{ hasFetched: boolean; type: Portfolio }>) => {
      state[action.payload.type].hasFetched = action.payload.hasFetched;
    }
  },
  extraReducers: (builder) => {
    //Bundle address reducer functions
    builder.addCase(fetchBundleAddresses.pending, (state) => {
      // state.WALLET.loading = true;
    });

    builder.addCase(fetchBundleAddresses.fulfilled, (state, action) => {
      const res = action.payload;

      state.BUNDLE.displayAddress = res.data[0];
      state.BUNDLE.addresses = res.data;

      sessionStorage.setItem('connected', 'true');

      // state.WALLET.loading = false;
      // state.WALLET.error = false;
    });

    builder.addCase(fetchBundleAddresses.rejected, (state) => {
      // state.WALLET.loading = false;
      // state.WALLET.error = true;
    });

    //Add address to bundle reducer functions
    builder.addCase(addAddressToBundle.pending, (state) => {
      // state.WALLET.loading = true;
    });

    builder.addCase(addAddressToBundle.fulfilled, (state, action) => {
      const res = action.payload;

      state.BUNDLE.addresses = res.data;
      state.BUNDLE.hasFetched = false;

      // state.WALLET.loading = false;
      // state.WALLET.error = false;
    });

    builder.addCase(addAddressToBundle.rejected, (state) => {
      // state.WALLET.loading = false;
      // state.WALLET.error = true;
    });

    //Remove address from bundle reducer functions
    builder.addCase(removeAddressFromBundle.pending, (state) => {
      // state.WALLET.loading = true;
    });

    builder.addCase(removeAddressFromBundle.fulfilled, (state, action) => {
      const res = action.payload;

      state.BUNDLE.addresses = res.data;
      state.BUNDLE.hasFetched = false;

      // state.WALLET.loading = false;
      // state.WALLET.error = false;
    });

    builder.addCase(removeAddressFromBundle.rejected, (state) => {
      // state.WALLET.loading = false;
      // state.WALLET.error = true;
    });

    //Delete bundle session reducer functions
    builder.addCase(deleteBundleSession.pending, (state) => {
      // state.WALLET.loading = true;
    });

    //TODO: Fix this with right BUNDLE key
    builder.addCase(deleteBundleSession.fulfilled, (state, action) => {
      const res = action.payload;

      Object.assign(state, initialState);

      sessionStorage.removeItem('connected');

      // state.WALLET.loading = false;
      // state.WALLET.error = false;
    });

    builder.addCase(deleteBundleSession.rejected, (state) => {
      // state.WALLET.loading = false;
      // state.WALLET.error = true;
    });

    // Public bundle data functions
    builder.addCase(fetchPublicBundleData.pending, (state) => {
      // state.WALLET.loading = true;
    });

    builder.addCase(fetchPublicBundleData.fulfilled, (state, action) => {
      const res = action.payload.data;

      state.PUBLIC.displayAddress = res.name;
      state.PUBLIC.addresses = res.addresses;

      // state.WALLET.loading = false;
      // state.WALLET.error = false;
    });

    builder.addCase(fetchPublicBundleData.rejected, (state) => {
      // state.WALLET.loading = false;
      // state.WALLET.error = true;
    });

    // Portfolio data functions
    // builder.addCase(fetchPortfolioData.pending, (state) => {
    //   // state.WALLET.loading = true;
    // });

    // builder.addCase(fetchPortfolioData.fulfilled, (state, action) => {
    //   // const res = action.payload.data;
    //   // state.PUBLIC.displayAddress = res.name;
    //   // state.PUBLIC.addresses = res.addresses;
    //   // state.WALLET.loading = false;
    //   // state.WALLET.error = false;
    // });

    // builder.addCase(fetchPortfolioData.rejected, (state, action) => {
    //   const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

    //   state[type] = initialPortfolioData;
    //   // state.WALLET.loading = false;
    //   // state.WALLET.error = true;
    // });

    //Wallet reducer functions
    builder.addCase(fetchWalletData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].WALLET.loading = true;
      state[type].WALLET.error = false;
    });

    builder.addCase(fetchWalletData.fulfilled, (state, action) => {
      const res = action.payload.data;
      const type = action.payload.type;

      state[type].WALLET.data.ETH = res.data.ETH.data;
      state[type].WALLET.data.BSC = res.data.BSC.data;
      state[type].WALLET.data.TPLS = res.data.TPLS.data;
      state[type].WALLET.data.MATIC = res.data.MATIC.data;
      state[type].WALLET.data.AVAX = res.data.AVAX.data;
      state[type].WALLET.data.FTM = res.data.FTM.data;
      state[type].WALLET.data.ARBI = res.data.ARBI.data;

      state[type].WALLET.total.ETH = res.data.ETH.totalValue;
      state[type].WALLET.total.BSC = res.data.BSC.totalValue;
      state[type].WALLET.total.TPLS = res.data.TPLS.totalValue;
      state[type].WALLET.total.MATIC = res.data.MATIC.totalValue;
      state[type].WALLET.total.AVAX = res.data.AVAX.totalValue;
      state[type].WALLET.total.FTM = res.data.FTM.totalValue;
      state[type].WALLET.total.ARBI = res.data.ARBI.totalValue;

      state[type].WALLET.loading = false;
      state[type].WALLET.error = false;
    });

    builder.addCase(fetchWalletData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].WALLET.loading = false;
      state[type].WALLET.error = true;
    });

    //Hex reducer functions
    builder.addCase(fetchHexData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].HEX.loading = true;
      state[type].HEX.error = false;
    });

    builder.addCase(fetchHexData.fulfilled, (state, action) => {
      const res = action.payload.data;
      const type = action.payload.type;

      state[type].HEX.data.ETH = res.data.ETHEREUM.data;
      state[type].HEX.data.TPLS = res.data.TPLS.data;

      state[type].HEX.total.ETH = res.data.ETHEREUM.totalValue;
      state[type].HEX.total.TPLS = res.data.TPLS.totalValue;

      state[type].HEX.totalTSharesPercentage.ETH = res.data.ETHEREUM.totalTSharesPercentage;
      state[type].HEX.totalTSharesPercentage.TPLS = res.data.TPLS.totalTSharesPercentage;

      state[type].HEX.loading = false;
      state[type].HEX.error = false;
    });

    builder.addCase(fetchHexData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].HEX.loading = false;
      state[type].HEX.error = true;
    });

    //Phiat reducer functions
    builder.addCase(fetchPhiatData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].PHIAT.loading = true;
      state[type].PHIAT.error = false;
    });

    builder.addCase(fetchPhiatData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload.data;
      const type = action.payload.type;

      state[type].PHIAT.data.LENDING = res.data.LENDING.data;
      state[type].PHIAT.data.STABLE_DEBT = res.data.STABLE_DEBT.data;
      state[type].PHIAT.data.VARIABLE_DEBT = res.data.VARIABLE_DEBT.data;
      state[type].PHIAT.data.STAKING = res.data.STAKING.data;
      state[type].PHIAT.data.PH_TOKENS = res.data.PH_TOKENS.data;

      state[type].PHIAT.data.STAKING_APY = res.data.STAKING_APY;

      state[type].PHIAT.balance.STAKING = res.data.STAKING.data.reduce(
        (prev, cur) => prev + cur.balance,
        0
      );

      state[type].PHIAT.total.TPLS =
        res.data.LENDING.totalValue +
        res.data.STAKING.totalValue -
        res.data.VARIABLE_DEBT.totalValue -
        res.data.STABLE_DEBT.totalValue;

      state[type].PHIAT.loading = false;
      state[type].PHIAT.error = false;
    });

    builder.addCase(fetchPhiatData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].PHIAT.loading = false;
      state[type].PHIAT.error = true;
    });

    // Pulsex reducer functions
    builder.addCase(fetchPulsexData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].PULSEX.loading = true;
      state[type].PULSEX.error = false;
    });

    builder.addCase(fetchPulsexData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload.data;
      const type = action.payload.type;

      state[type].PULSEX.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state[type].PULSEX.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state[type].PULSEX.loading = false;
      state[type].PULSEX.error = false;
    });

    builder.addCase(fetchPulsexData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].PULSEX.loading = false;
      state[type].PULSEX.error = true;
    });

    // Pancake reducer functions
    builder.addCase(fetchPancakeData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].PANCAKE.loading = true;
      state[type].PANCAKE.error = false;
    });

    builder.addCase(fetchPancakeData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload.data;
      const type = action.payload.type;

      state[type].PANCAKE.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;
      state[type].PANCAKE.data.FARMING = res.data.FARMING.data;

      state[type].PANCAKE.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;
      state[type].PANCAKE.total.FARMING = res.data.FARMING.totalValue;

      state[type].PANCAKE.loading = false;
      state[type].PANCAKE.error = false;
    });

    builder.addCase(fetchPancakeData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].PANCAKE.loading = false;
      state[type].PANCAKE.error = true;
    });
    // Sushi reducer functions
    builder.addCase(fetchSushiData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].SUSHI.loading = true;
      state[type].SUSHI.error = false;
    });

    builder.addCase(fetchSushiData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload.data;
      const type = action.payload.type;

      state[type].SUSHI.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state[type].SUSHI.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state[type].SUSHI.loading = false;
      state[type].SUSHI.error = false;
    });

    builder.addCase(fetchSushiData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].SUSHI.loading = false;
      state[type].SUSHI.error = true;
    });

    // UniV2 reducer functions
    builder.addCase(fetchUniV2Data.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].UNISWAPV2.loading = true;
      state[type].UNISWAPV2.error = false;
    });

    builder.addCase(fetchUniV2Data.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload.data;
      const type = action.payload.type;

      state[type].UNISWAPV2.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state[type].UNISWAPV2.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state[type].UNISWAPV2.loading = false;
      state[type].UNISWAPV2.error = false;
    });

    builder.addCase(fetchUniV2Data.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].UNISWAPV2.loading = false;
      state[type].UNISWAPV2.error = true;
    });

    // UniV3 reducer functions
    builder.addCase(fetchUniV3Data.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].UNISWAPV3.loading = true;
      state[type].UNISWAPV3.error = false;
    });

    builder.addCase(fetchUniV3Data.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload.data;
      const type = action.payload.type;

      state[type].UNISWAPV3.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state[type].UNISWAPV3.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state[type].UNISWAPV3.loading = false;
      state[type].UNISWAPV3.error = false;
    });

    builder.addCase(fetchUniV3Data.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].UNISWAPV3.loading = false;
      state[type].UNISWAPV3.error = true;
    });

    //Hedron reducer functions
    builder.addCase(fetchHedronData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].HEDRON.loading = true;
      state[type].HEDRON.error = false;
    });

    builder.addCase(fetchHedronData.fulfilled, (state, action) => {
      const res = action.payload.data;
      const type = action.payload.type;

      state[type].HEDRON.data.ETH = res.data.ETH.data;
      state[type].HEDRON.data.TPLS = res.data.TPLS.data;

      state[type].HEDRON.total.ETH = res.data.ETH.totalValue;
      state[type].HEDRON.total.TPLS = res.data.TPLS.totalValue;

      state[type].HEDRON.loading = false;
      state[type].HEDRON.error = false;
    });

    builder.addCase(fetchHedronData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].HEDRON.loading = false;
      state[type].HEDRON.error = true;
    });

    //Phamous reducer functions
    builder.addCase(fetchPhamousData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].PHAMOUS.loading = true;
      state[type].PHAMOUS.error = false;
    });

    builder.addCase(fetchPhamousData.fulfilled, (state, action) => {
      const res = action.payload.data;
      const type = action.payload.type;

      state[type].PHAMOUS.data.LIQUIDITY_PROVIDING = res.data.LIQUIDITY_PROVIDING.data;
      state[type].PHAMOUS.data.STAKING = res.data.STAKING.data;
      state[type].PHAMOUS.data.REWARD = res.data.REWARD.data;

      state[type].PHAMOUS.total.TPLS =
        res.data.LIQUIDITY_PROVIDING.totalValue +
        res.data.STAKING.totalValue +
        res.data.REWARD.totalValue;

      state[type].PHAMOUS.balance.STAKING = res.data.STAKING.data.reduce(
        (prev, cur) => prev + cur.balance,
        0
      );

      state[type].PHAMOUS.loading = false;
      state[type].PHAMOUS.error = false;
    });

    builder.addCase(fetchPhamousData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].PHAMOUS.loading = false;
      state[type].PHAMOUS.error = true;
    });

    //Xen reducer functions
    builder.addCase(fetchXenData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].XEN.loading = true;
      state[type].XEN.error = false;
    });

    builder.addCase(fetchXenData.fulfilled, (state, action) => {
      const res = action.payload.data;
      const type = action.payload.type;

      state[type].XEN.data.STAKING = res.data.STAKING.data;
      state[type].XEN.data.MINTING = res.data.MINTING.data;

      state[type].XEN.total.ETH = res.data.STAKING.totalValue + res.data.MINTING.totalValue;

      state[type].XEN.loading = false;
      state[type].XEN.error = false;
    });

    builder.addCase(fetchXenData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      // state[type].XEN.loading = false;
      state[type].XEN.error = true;
    });
  }
});

export const {
  reset,
  setHasFetched,
  setDisplayAddress,
  setAddresses,
  clearAddresses,
  clearPortfolio,
  clearBundlePortfolio
} = portfolioSlice.actions;

export {
  fetchBundleAddresses,
  addAddressToBundle,
  removeAddressFromBundle,
  deleteBundleSession,
  fetchPublicBundleData,
  fetchWalletData,
  fetchHexData,
  fetchPhiatData,
  fetchPancakeData,
  fetchPulsexData,
  fetchSushiData,
  fetchUniV2Data,
  fetchUniV3Data,
  fetchHedronData,
  fetchPhamousData,
  fetchXenData,
  fetchPortfolioData
};

export default portfolioSlice.reducer;
