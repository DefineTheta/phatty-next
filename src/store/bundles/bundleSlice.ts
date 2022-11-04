import {
  AuthenticationError,
  getAccountFromMetamask,
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
import { RootState } from '@app-src/store/store';
import {
  AuthResponse,
  BundleResponse,
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

const fetchBundleWalletData = createAsyncThunk<WalletResponse, string[], { state: RootState }>(
  'bundles/fetchBundleWalletData',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getWallet(addresses);

    return data;
  }
);

const fetchBundleHexData = createAsyncThunk<
  HexResponse,
  string[],
  { state: RootState; signal: AbortSignal }
>('bundles/fetchBundleHexData', async (addresses, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  const data = await getHex(addresses);

  return data;
});

const fetchBundlePhiatData = createAsyncThunk<PhiatResponse, string[], { state: RootState }>(
  'bundles/fetchBundlePhiatData',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getPhiat(addresses);

    return data;
  }
);

const fetchBundlePulsexData = createAsyncThunk<PulsexResponse, string[], { state: RootState }>(
  'bundles/fetchBundlePulsexData',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getPulsex(addresses);

    return data;
  }
);

const fetchBundlePancakeData = createAsyncThunk<PancakeResponse, string[], { state: RootState }>(
  'bundles/fetchPancakeData',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getPancake(addresses);

    return data;
  }
);

const fetchBundleSushiData = createAsyncThunk<SushiResponse, string[], { state: RootState }>(
  'bundles/fetchSushiData',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getSushi(addresses);

    return data;
  }
);

const fetchBundleUniV2Data = createAsyncThunk<UniV2Response, string[], { state: RootState }>(
  'bundles/fetchUniV2Data',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getUniV2(addresses);

    return data;
  }
);

const fetchBundleUniV3Data = createAsyncThunk<UniV3Response, string[], { state: RootState }>(
  'bundles/fetchUniV3Data',
  async (addresses, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getUniV3(addresses);

    return data;
  }
);

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
  fetchBundleUniV3Data
};

export default bundlesSlice.reducer;
