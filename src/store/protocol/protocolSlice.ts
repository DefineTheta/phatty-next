import {
  getHex,
  getPancake,
  getPhiat,
  getPulsex,
  getSushi,
  getUniV2,
  getUniV3,
  getWallet
} from '@app-src/services/api';
import { RootState } from '@app-src/store/store';
import {
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
  HexDataComponentEnum,
  PancakeDataComponentEnum,
  PhiatDataComponentEnum,
  ProtocolEnum,
  ProtocolsState,
  PulsexDataComponentEnum,
  SushiDataComponentEnum,
  UniswapV2DataComponentEnum,
  UniswapV3DataComponentEnum,
  WalletDataComponentEnum
} from './types';

const initialState: ProtocolsState = {
  address: '',
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
  }
};

const fetchWalletData = createAsyncThunk<WalletResponse, string | undefined, { state: RootState }>(
  'protocols/fetchWalletData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const profileAddress = address || thunkAPI.getState().protocols.address;

    if (!profileAddress || profileAddress == '') thunkAPI.rejectWithValue(null);

    const data = await getWallet([profileAddress]);

    return data;
  }
);

const fetchHexData = createAsyncThunk<
  HexResponse,
  string,
  { state: RootState; signal: AbortSignal }
>('protocols/fetchHexData', async (address, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  const data = await getHex([address]);

  return data;
});

const fetchPhiatData = createAsyncThunk<PhiatResponse, string, { state: RootState }>(
  'protocols/fetchPhiatData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getPhiat([address]);

    return data;
  }
);

const fetchPulsexData = createAsyncThunk<PulsexResponse, string, { state: RootState }>(
  'protocols/fetchPulsexData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getPulsex([address]);

    return data;
  }
);

const fetchPancakeData = createAsyncThunk<PancakeResponse, string, { state: RootState }>(
  'protocols/fetchPancakeData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getPancake([address]);

    return data;
  }
);

const fetchSushiData = createAsyncThunk<SushiResponse, string, { state: RootState }>(
  'protocols/fetchSushiData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getSushi([address]);

    return data;
  }
);

const fetchUniV2Data = createAsyncThunk<UniV2Response, string, { state: RootState }>(
  'protocols/fetchUniV2Data',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getUniV2([address]);

    return data;
  }
);

const fetchUniV3Data = createAsyncThunk<UniV3Response, string, { state: RootState }>(
  'protocols/fetchUniV3Data',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getUniV3([address]);

    return data;
  }
);

export const protocolsSlice = createSlice({
  name: 'protocols',
  initialState,
  reducers: {
    reset: () => initialState,
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setHasFetched: (state, action: PayloadAction<boolean>) => {
      state.hasFetched = action.payload;
    }
  },
  extraReducers: (builder) => {
    //Wallet reducer functions
    builder.addCase(fetchWalletData.pending, (state) => {
      state.WALLET.loading = true;
      state.WALLET.error = false;
    });

    builder.addCase(fetchWalletData.fulfilled, (state, action) => {
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

    builder.addCase(fetchWalletData.rejected, (state) => {
      state.WALLET.loading = false;
      state.WALLET.error = true;
    });

    //Hex reducer functions
    builder.addCase(fetchHexData.pending, (state) => {
      state.HEX.loading = true;
      state.HEX.error = false;
    });

    builder.addCase(fetchHexData.fulfilled, (state, action) => {
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

    builder.addCase(fetchHexData.rejected, (state) => {
      // state.HEX.loading = false;
      state.HEX.error = true;
    });

    //Phiat reducer functions
    builder.addCase(fetchPhiatData.pending, (state) => {
      state.PHIAT.loading = true;
    });

    builder.addCase(fetchPhiatData.fulfilled, (state, action) => {
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

    builder.addCase(fetchPhiatData.rejected, (state) => {
      // state.PHIAT.loading = false;
      state.PHIAT.error = true;
    });

    // Pulsex reducer functions
    builder.addCase(fetchPulsexData.pending, (state) => {
      state.PULSEX.loading = true;
    });

    builder.addCase(fetchPulsexData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.PULSEX.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.PULSEX.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.PULSEX.loading = false;
      state.PULSEX.error = false;
    });

    builder.addCase(fetchPulsexData.rejected, (state) => {
      // state.PULSEX.loading = false;
      state.PULSEX.error = true;
    });

    // Pancake reducer functions
    builder.addCase(fetchPancakeData.pending, (state) => {
      state.PANCAKE.loading = true;
    });

    builder.addCase(fetchPancakeData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.PANCAKE.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;
      state.PANCAKE.data.FARMING = res.data.FARMING.data;

      state.PANCAKE.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;
      state.PANCAKE.total.FARMING = res.data.FARMING.totalValue;

      // const data = action.payload.reduce(
      //   (prev, cur) => {
      //     prev.FARMING = prev.FARMING.concat(cur.FARMING);
      //     prev.LIQUIDITY_POOL = prev.LIQUIDITY_POOL.concat(cur.LIQUIDITY_POOL);

      //     return prev;
      //   },
      //   {
      //     [PancakeDataComponentEnum.FARMING]: [],
      //     [PancakeDataComponentEnum.LIQUIDITY_POOL]: []
      //   } as PancakeData
      // );

      // state.PANCAKE.data.FARMING.push(data.FARMING);
      // state.PANCAKE.data.LIQUIDITY_POOL.push(data.LIQUIDITY_POOL);

      // state.PANCAKE.total.FARMING += addObjectValue(data.FARMING, 'usdValue');
      // state.PANCAKE.total.LIQUIDITY_POOL += addObjectValue(data.LIQUIDITY_POOL, 'usdValue');

      state.PANCAKE.loading = false;
      state.PANCAKE.error = false;
    });

    builder.addCase(fetchPancakeData.rejected, (state) => {
      // state.PANCAKE.loading = false;
      state.PANCAKE.error = true;
    });

    // Sushi reducer functions
    builder.addCase(fetchSushiData.pending, (state) => {
      state.SUSHI.loading = true;
      state.SUSHI.error = false;
    });

    builder.addCase(fetchSushiData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.SUSHI.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.SUSHI.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.SUSHI.loading = false;
      state.SUSHI.error = false;
    });

    builder.addCase(fetchSushiData.rejected, (state) => {
      // state.SUSHI.loading = false;
      state.SUSHI.error = true;
    });

    // UniV2 reducer functions
    builder.addCase(fetchUniV2Data.pending, (state) => {
      state.UNISWAPV2.loading = true;
      state.UNISWAPV2.error = false;
    });

    builder.addCase(fetchUniV2Data.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.UNISWAPV2.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.UNISWAPV2.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.UNISWAPV2.loading = false;
      state.UNISWAPV2.error = false;
    });

    builder.addCase(fetchUniV2Data.rejected, (state) => {
      // state.UNISWAPV2.loading = false;
      state.UNISWAPV2.error = true;
    });

    // UniV3 reducer functions
    builder.addCase(fetchUniV3Data.pending, (state) => {
      state.UNISWAPV3.loading = true;
      state.UNISWAPV3.error = false;
    });

    builder.addCase(fetchUniV3Data.fulfilled, (state, action) => {
      if (!action.payload) return;

      const res = action.payload;

      state.UNISWAPV3.data.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.data;

      state.UNISWAPV3.total.LIQUIDITY_POOL = res.data.LIQUIDITY_POOL.totalValue;

      state.UNISWAPV3.loading = false;
      state.UNISWAPV3.error = false;
    });

    builder.addCase(fetchUniV3Data.rejected, (state) => {
      // state.UNISWAPV3.loading = false;
      state.UNISWAPV3.error = true;
    });
  }
});

export const {
  reset,
  setAddress: setProfileAddress,
  setHasFetched: setProfileHasFetched
} = protocolsSlice.actions;

export {
  fetchWalletData,
  fetchHexData,
  fetchPhiatData,
  fetchPancakeData,
  fetchPulsexData,
  fetchSushiData,
  fetchUniV2Data,
  fetchUniV3Data
};

export default protocolsSlice.reducer;
