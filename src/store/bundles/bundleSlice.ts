import {
  AuthenticationError,
  getAccountFromMetamask,
  getHedron,
  getHex,
  getPancake,
  getPhiat,
  getPulsex,
  getSushi,
  getUniV2,
  getUniV3,
  getWallet,
  getWithAuthentication
} from '@app-src/services/api';
import { AppDispatch, RootState } from '@app-src/store/store';
import {
  AuthResponse,
  BundleResponse,
  HedronResponse,
  HexResponse,
  PancakeResponse,
  PhiatResponse,
  PulsexResponse,
  SushiResponse,
  UniV2Response,
  UniV3Response,
  WalletResponse
} from '@app-src/types/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BundlesState,
  HedronDataComponentEnum,
  HexDataComponentEnum,
  PancakeDataComponentEnum,
  PhiatDataComponentEnum,
  ProtocolEnum,
  PulsexDataComponentEnum,
  SushiDataComponentEnum,
  UniswapV2DataComponentEnum,
  UniswapV3DataComponentEnum,
  WalletDataComponentEnum
} from './types';

const initialState: BundlesState = {
  bundleAddress: '',
  addresses: [],
  hasFetched: false,
  [ProtocolEnum.WALLET]: {
    total: {
      [WalletDataComponentEnum.ETH]: 0,
      [WalletDataComponentEnum.TPLS]: 0,
      [WalletDataComponentEnum.BSC]: 0
    },
    loading: false,
    error: false,
    data: {
      [WalletDataComponentEnum.ETH]: [],
      [WalletDataComponentEnum.TPLS]: [],
      [WalletDataComponentEnum.BSC]: []
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
    loading: false,
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
    loading: false,
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
    loading: false,
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
    loading: false,
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
    loading: false,
    error: false,
    data: {
      [SushiDataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.UNISWAPV2]: {
    total: {
      [UniswapV2DataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: false,
    error: false,
    data: {
      [UniswapV2DataComponentEnum.LIQUIDITY_POOL]: []
    }
  },
  [ProtocolEnum.UNISWAPV3]: {
    total: {
      [UniswapV3DataComponentEnum.LIQUIDITY_POOL]: 0
    },
    loading: false,
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
    loading: false,
    error: false,
    data: {
      [HedronDataComponentEnum.ETH]: [],
      [HedronDataComponentEnum.TPLS]: []
    }
  }
};

const fetchBundleAddresses = createAsyncThunk<BundleResponse, void, { state: RootState }>(
  'bundles/fetchBundleAddresses',
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
  'bundles/addAddressToBundle',
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
  'bundles/removeAddressFromBundle',
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
  'bundles/deleteBundleSession',
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

const fetchBundleWalletData = createAsyncThunk<
  WalletResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchBundleWalletData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getWallet(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getWallet(bundleAddresses, false);
});

const fetchBundleHexData = createAsyncThunk<
  HexResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState; signal: AbortSignal }
>('bundles/fetchBundleHexData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getHex(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getHex(bundleAddresses, false);
});

const fetchBundlePhiatData = createAsyncThunk<
  PhiatResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchBundlePhiatData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getPhiat(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getPhiat(bundleAddresses, false);
});

const fetchBundlePulsexData = createAsyncThunk<
  PulsexResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchBundlePulsexData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getPulsex(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getPulsex(bundleAddresses, false);
});

const fetchBundlePancakeData = createAsyncThunk<
  PancakeResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchPancakeData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getPancake(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getPancake(bundleAddresses, false);
});

const fetchBundleSushiData = createAsyncThunk<
  SushiResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchSushiData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getSushi(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getSushi(bundleAddresses, false);
});

const fetchBundleUniV2Data = createAsyncThunk<
  UniV2Response,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchUniV2Data', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getUniV2(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getUniV2(bundleAddresses, false);
});

const fetchBundleUniV3Data = createAsyncThunk<
  UniV3Response,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchUniV3Data', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getUniV3(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getUniV3(bundleAddresses, false);
});

const fetchBundleHedronData = createAsyncThunk<
  HedronResponse,
  { addresses: string[]; refresh: boolean } | undefined,
  { state: RootState }
>('bundles/fetchHedronData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  if (input) return await getHedron(input.addresses, input.refresh);

  const bundleAddresses = thunkAPI.getState().bundles.addresses;

  if (!bundleAddresses || bundleAddresses.length === 0) thunkAPI.rejectWithValue(null);

  return await getHedron(bundleAddresses, false);
});

const fetchBundlePortfolioData = (dispatch: AppDispatch, addresses: string[], refresh = false) => {
  return Promise.all([
    dispatch(fetchBundleWalletData({ addresses, refresh })),
    dispatch(fetchBundleHexData({ addresses, refresh })),
    dispatch(fetchBundlePhiatData({ addresses, refresh })),
    dispatch(fetchBundlePulsexData({ addresses, refresh })),
    dispatch(fetchBundlePancakeData({ addresses, refresh })),
    dispatch(fetchBundleSushiData({ addresses, refresh })),
    dispatch(fetchBundleUniV2Data({ addresses, refresh })),
    dispatch(fetchBundleUniV3Data({ addresses, refresh })),
    dispatch(fetchBundleHedronData({ addresses, refresh }))
  ]);
};

export const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    reset: () => initialState,
    clearBundleAddresses: (state) => {
      state.addresses = [];
    },
    setBundleAddress: (state, action: PayloadAction<string>) => {
      state.bundleAddress = action.payload;
    },
    setFetched: (state, action: PayloadAction<boolean>) => {
      state.hasFetched = action.payload;
    }
  },
  extraReducers: (builder) => {
    //Bundle address reducer functions
    builder.addCase(fetchBundleAddresses.pending, (state) => {
      // state.WALLET.loading = true;
    });

    builder.addCase(fetchBundleAddresses.fulfilled, (state, action) => {
      const res = action.payload;

      state.bundleAddress = res.data[0];
      state.addresses = res.data;

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

      state.addresses = res.data;
      state.hasFetched = false;

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

      state.addresses = res.data;
      state.hasFetched = false;

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

    //Wallet reducer functions
    builder.addCase(fetchBundleWalletData.pending, (state) => {
      state.WALLET.loading = true;
    });

    builder.addCase(fetchBundleWalletData.fulfilled, (state, action) => {
      const res = action.payload;

      state.WALLET.data.ETH = res.data.ETH.data;
      state.WALLET.data.BSC = res.data.BSC.data;
      state.WALLET.data.TPLS = res.data.TPLS.data;

      state.WALLET.total.ETH = res.data.ETH.totalValue;
      state.WALLET.total.BSC = res.data.BSC.totalValue;
      state.WALLET.total.TPLS = res.data.TPLS.totalValue;

      state.WALLET.loading = false;
      state.WALLET.error = false;
    });

    builder.addCase(fetchBundleWalletData.rejected, (state) => {
      state.WALLET.loading = false;
      state.WALLET.error = true;
    });

    //Hex reducer functions
    builder.addCase(fetchBundleHexData.pending, (state) => {
      state.HEX.loading = true;
      state.HEX.error = false;
    });

    builder.addCase(fetchBundleHexData.fulfilled, (state, action) => {
      const res = action.payload;

      state.HEX.data.ETH = res.data.ETHEREUM.data;
      state.HEX.data.TPLS = res.data.TPLS.data;

      state.HEX.total.ETH = res.data.ETHEREUM.totalValue;
      state.HEX.total.TPLS = res.data.TPLS.totalValue;

      state.HEX.totalTSharesPercentage.ETH = res.data.ETHEREUM.totalTSharesPercentage;
      state.HEX.totalTSharesPercentage.TPLS = res.data.TPLS.totalTSharesPercentage;

      state.HEX.loading = false;
      state.HEX.error = false;
    });

    builder.addCase(fetchBundleHexData.rejected, (state) => {
      // state.HEX.loading = false;
      state.HEX.error = true;
    });

    //Phiat reducer functions
    builder.addCase(fetchBundlePhiatData.pending, (state) => {
      state.PHIAT.loading = true;
    });

    builder.addCase(fetchBundlePhiatData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.PHIAT.data.LENDING = res.data.LENDING.data;
      state.PHIAT.data.STABLE_DEBT = res.data.STABLE_DEBT.data;
      state.PHIAT.data.VARIABLE_DEBT = res.data.VARIABLE_DEBT.data;
      state.PHIAT.data.STAKING = res.data.STAKING.data;
      state.PHIAT.data.PH_TOKENS = res.data.PH_TOKENS.data;

      state.PHIAT.data.STAKING_APY = res.data.STAKING_APY;

      state.PHIAT.balance.STAKING = res.data.STAKING.data.reduce(
        (prev, cur) => prev + cur.balance,
        0
      );

      state.PHIAT.total.TPLS =
        res.data.LENDING.totalValue +
        res.data.STAKING.totalValue -
        res.data.VARIABLE_DEBT.totalValue -
        res.data.STABLE_DEBT.totalValue;

      state.PHIAT.loading = false;
      state.PHIAT.error = false;
    });

    builder.addCase(fetchBundlePhiatData.rejected, (state) => {
      // state.PHIAT.loading = false;
      state.PHIAT.error = true;
    });

    // Pulsex reducer functions
    builder.addCase(fetchBundlePulsexData.pending, (state) => {
      state.PULSEX.loading = true;
    });

    builder.addCase(fetchBundlePulsexData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.PULSEX.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.PULSEX.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.PULSEX.loading = false;
      state.PULSEX.error = false;
    });

    builder.addCase(fetchBundlePulsexData.rejected, (state) => {
      // state.PULSEX.loading = false;
      state.PULSEX.error = true;
    });

    // Pancake reducer functions
    builder.addCase(fetchBundlePancakeData.pending, (state) => {
      state.PANCAKE.loading = true;
    });

    builder.addCase(fetchBundlePancakeData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.PANCAKE.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;
      state.PANCAKE.data.FARMING = res.data.FARMING.data;

      state.PANCAKE.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;
      state.PANCAKE.total.FARMING = res.data.FARMING.totalValue;

      state.PANCAKE.loading = false;
      state.PANCAKE.error = false;
    });

    builder.addCase(fetchBundlePancakeData.rejected, (state) => {
      // state.PANCAKE.loading = false;
      state.PANCAKE.error = true;
    });
    // Sushi reducer functions
    builder.addCase(fetchBundleSushiData.pending, (state) => {
      state.SUSHI.loading = true;
      state.SUSHI.error = false;
    });

    builder.addCase(fetchBundleSushiData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.SUSHI.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.SUSHI.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.SUSHI.loading = false;
      state.SUSHI.error = false;
    });

    builder.addCase(fetchBundleSushiData.rejected, (state) => {
      // state.SUSHI.loading = false;
      state.SUSHI.error = true;
    });

    // UniV2 reducer functions
    builder.addCase(fetchBundleUniV2Data.pending, (state) => {
      state.UNISWAPV2.loading = true;
      state.UNISWAPV2.error = false;
    });

    builder.addCase(fetchBundleUniV2Data.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.UNISWAPV2.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.UNISWAPV2.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.UNISWAPV2.loading = false;
      state.UNISWAPV2.error = false;
    });

    builder.addCase(fetchBundleUniV2Data.rejected, (state) => {
      // state.UNISWAPV2.loading = false;
      state.UNISWAPV2.error = true;
    });

    // UniV3 reducer functions
    builder.addCase(fetchBundleUniV3Data.pending, (state) => {
      state.UNISWAPV3.loading = true;
      state.UNISWAPV3.error = false;
    });

    builder.addCase(fetchBundleUniV3Data.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.UNISWAPV3.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.UNISWAPV3.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.UNISWAPV3.loading = false;
      state.UNISWAPV3.error = false;
    });

    builder.addCase(fetchBundleUniV3Data.rejected, (state) => {
      // state.UNISWAPV3.loading = false;
      state.UNISWAPV3.error = true;
    });

    //Hedron reducer functions
    builder.addCase(fetchBundleHedronData.pending, (state) => {
      state.HEDRON.loading = true;
      state.HEDRON.error = false;
    });

    builder.addCase(fetchBundleHedronData.fulfilled, (state, action) => {
      const res = action.payload;

      state.HEDRON.data.ETH = res.data.ETH.data;
      state.HEDRON.data.TPLS = res.data.TPLS.data;

      state.HEDRON.total.ETH = res.data.ETH.totalValue;
      state.HEDRON.total.TPLS = res.data.TPLS.totalValue;

      state.HEDRON.loading = false;
      state.HEDRON.error = false;
    });

    builder.addCase(fetchBundleHedronData.rejected, (state) => {
      // state.HEDRON.loading = false;
      state.HEDRON.error = true;
    });
  }
});

export const {
  reset,
  setFetched: setBundleFetched,
  setBundleAddress,
  clearBundleAddresses
} = bundlesSlice.actions;

export {
  fetchBundleAddresses,
  addAddressToBundle,
  removeAddressFromBundle,
  deleteBundleSession,
  fetchBundleWalletData,
  fetchBundleHexData,
  fetchBundlePhiatData,
  fetchBundlePancakeData,
  fetchBundlePulsexData,
  fetchBundleSushiData,
  fetchBundleUniV2Data,
  fetchBundleUniV3Data,
  fetchBundleHedronData,
  fetchBundlePortfolioData
};

export default bundlesSlice.reducer;
