import { getHex, getPancake, getPhiat, getPulsex, getWallet } from '@app-src/services/api';
import { RootState } from '@app-src/store/store';
import {
  HexResponse,
  PancakeResponse,
  PhiatResponse,
  PulsexResponse,
  WalletResponse
} from '@app-src/types/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HexDataComponentEnum,
  PancakeDataComponentEnum,
  PhiatDataComponentEnum,
  ProtocolEnum,
  ProtocolImgEnum,
  ProtocolsState,
  PulsexDataComponentEnum,
  WalletDataComponentEnum
} from './types';

const initialState: ProtocolsState = {
  address: '',
  hasFetched: false,
  [ProtocolEnum.WALLET]: {
    name: ProtocolEnum.WALLET,
    displayName: 'Wallet',
    id: '#wallet',
    img: ProtocolImgEnum.WALLET,
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
    name: ProtocolEnum.HEX,
    displayName: 'Hex',
    id: '#hex',
    img: ProtocolImgEnum.HEX,
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
    name: ProtocolEnum.PHIAT,
    displayName: 'Phiat',
    id: '#phiat',
    img: ProtocolImgEnum.PHIAT,
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
    name: ProtocolEnum.PULSEX,
    displayName: 'PulseX',
    id: '#pulsex',
    img: ProtocolImgEnum.PULSEX,
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
    name: ProtocolEnum.PANCAKE,
    displayName: 'Pancake',
    id: '#pancake',
    img: ProtocolImgEnum.PANCAKE,
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
  // [ProtocolEnum.UNISWAPV2]: {
  //   name: ProtocolEnum.UNISWAPV2,
  //   displayName: 'Uniswap V2',
  //   id: '#uniswapv2',
  //   img: ProtocolImgEnum.UNISWAPV2,
  //   total: {
  //     [UniswapV2DataComponentEnum.LIQUIDITY_POOL]: 0
  //   },
  //   loading: false,
  //   error: false,
  //   data: {
  //     [UniswapV2DataComponentEnum.LIQUIDITY_POOL]: []
  //   }
  // },
  // [ProtocolEnum.UNISWAPV3]: {
  //   name: ProtocolEnum.UNISWAPV3,
  //   displayName: 'Uniswap V3',
  //   id: '#uniswapv3',
  //   img: ProtocolImgEnum.UNISWAPV3,
  //   total: {
  //     [UniswapV3DataComponentEnum.LIQUIDITY_POOL]: 0
  //   },
  //   loading: false,
  //   error: false,
  //   data: {
  //     [UniswapV3DataComponentEnum.LIQUIDITY_POOL]: []
  //   }
  // }
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

    const data = getPancake([address]);

    return data;
  }
);

// const fetchEthereumLPData = createAsyncThunk<EthereumLPData[], string[], { state: RootState }>(
//   'protocols/fetchEthereumLPData',
//   async (addresses, thunkAPI) => {
//     const controller = new AbortController();

//     thunkAPI.signal.onabort = () => {
//       controller.abort();
//     };

//     const data = await Promise.all(
//       addresses.map((address) => {
//         return crypto.fetchEthereumLP(address, controller.signal);
//       })
//     );

//     return data;
//   }
// );

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

      state.WALLET.data.ETHEREUM = res.data.ETHEREUM.data;
      state.WALLET.data.BSC = res.data.BSC.data;
      state.WALLET.data.TPLS = res.data.TPLS.data;

      state.WALLET.total.ETHEREUM = res.data.ETHEREUM.totalValue;
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

      state.HEX.data.ETHEREUM = res.data.ETHEREUM.data;
      state.HEX.data.TPLS = res.data.TPLS.data;

      state.HEX.total.ETHEREUM = res.data.ETHEREUM.totalValue;
      state.HEX.total.TPLS = res.data.TPLS.totalValue;

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

    // builder.addCase(fetchEthereumLPData.pending, (state) => {
    //   state.UNISWAPV2.loading = true;
    //   state.UNISWAPV3.loading = true;
    // });

    // builder.addCase(fetchEthereumLPData.fulfilled, (state, action) => {
    //   const data = action.payload.reduce(
    //     (prev, cur) => {
    //       prev[ProtocolEnum.UNISWAPV2] = prev[ProtocolEnum.UNISWAPV2].concat(
    //         cur[ProtocolEnum.UNISWAPV2]
    //       );
    //       prev.UNISWAPV3 = prev.UNISWAPV3.concat(cur.UNISWAPV3);

    //       return prev;
    //     },
    //     {
    //       [ProtocolEnum.UNISWAPV2]: [],
    //       [ProtocolEnum.UNISWAPV3]: []
    //     } as EthereumLPData
    //   );

    //   // console.log(data);

    //   // state.UNISWAPV2.data.LIQUIDITY_POOL.push(data.UNISWAPV2);
    //   // state.UNISWAPV3.data.LIQUIDITY_POOL.push(data[ProtocolEnum.UNISWAPV3]);
    // });

    // builder.addCase(fetchEthereumLPData.rejected, (state) => {
    //   state.UNISWAPV2.error = true;
    //   state.UNISWAPV3.error = true;
    // });
  }
});

export const {
  reset,
  setAddress: setProfileAddress,
  setHasFetched: setProfileHasFetched
} = protocolsSlice.actions;

export { fetchWalletData, fetchHexData, fetchPhiatData, fetchPancakeData, fetchPulsexData };

export default protocolsSlice.reducer;
