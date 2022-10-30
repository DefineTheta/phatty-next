import {
  AuthenticationError,
  getAccountFromMetamask,
  getHex,
  getPancake,
  getPhiat,
  getPulsex,
  getWallet,
  getWithAuthentication
} from '@app-src/services/api';
import { RootState } from '@app-src/store/store';
import {
  BundleResponse,
  HexResponse,
  PancakeResponse,
  PhiatResponse,
  PulsexResponse,
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
  WalletDataComponentEnum
} from './types';

const initialState: BundlesState = {
  bundleAddress: '',
  addresses: [],
  hasFetched: false,
  [ProtocolEnum.WALLET]: {
    total: {
      [WalletDataComponentEnum.ETHEREUM]: 0,
      [WalletDataComponentEnum.TPLS]: 0,
      [WalletDataComponentEnum.BSC]: 0
    },
    loading: false,
    error: false,
    data: {
      [WalletDataComponentEnum.ETHEREUM]: [],
      [WalletDataComponentEnum.TPLS]: [],
      [WalletDataComponentEnum.BSC]: []
    }
  },
  [ProtocolEnum.HEX]: {
    total: {
      [HexDataComponentEnum.ETHEREUM]: 0,
      [HexDataComponentEnum.TPLS]: 0
    },
    loading: false,
    error: false,
    data: {
      [HexDataComponentEnum.ETHEREUM]: [],
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
      const res = await fetch(`/api/bundle/${address}`, { signal });

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

    const data = getPancake(addresses);

    return data;
  }
);

export const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    reset: () => initialState,
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

      state.addresses = res.data;

      // state.WALLET.loading = false;
      // state.WALLET.error = false;
    });

    builder.addCase(fetchBundleAddresses.rejected, (state) => {
      // state.WALLET.loading = false;
      // state.WALLET.error = true;
    });

    //Wallet reducer functions
    builder.addCase(fetchBundleWalletData.pending, (state) => {
      state.WALLET.loading = true;
    });

    builder.addCase(fetchBundleWalletData.fulfilled, (state, action) => {
      const res = action.payload;

      state.WALLET.data.ETHEREUM = res.data.ETHEREUM.data;
      state.WALLET.data.BSC = res.data.BSC.data;
      state.WALLET.data.TPLS = res.data.TPLS.data;

      state.WALLET.total.ETHEREUM = res.data.ETHEREUM.totalValue;
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

      state.HEX.data.ETHEREUM = res.data.ETHEREUM.data;
      state.HEX.data.TPLS = res.data.TPLS.data;

      state.HEX.total.ETHEREUM = res.data.ETHEREUM.totalValue;
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
  }
});

export const { reset, setFetched: setBundleFetched, setBundleAddress } = bundlesSlice.actions;

export {
  fetchBundleAddresses,
  fetchBundleWalletData,
  fetchBundleHexData,
  fetchBundlePhiatData,
  fetchBundlePancakeData,
  fetchBundlePulsexData
};

export default bundlesSlice.reducer;
