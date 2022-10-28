// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { addObjectValue } from 'src/helpers/misc';
// import { crypto } from 'src/helpers/web3';
// import {
//   EthereumLPData,
//   HexData,
//   PancakeData,
//   PhiatData,
//   PulsexData,
//   WalletData
// } from 'src/types/api';
// import {
//   HexDataComponentEnum,
//   PancakeDataComponentEnum,
//   PhiatDataComponentEnum,
//   ProtocolEnum,
//   ProtocolImgEnum,
//   PulsexDataComponentEnum,
//   UniswapV2DataComponentEnum,
//   UniswapV3DataComponentEnum,
//   WalletDataComponentEnum
// } from 'src/types/crypto';
// import { RootState } from '../store';
// import { ProtocolsState } from './types';

import { RootState } from '@app-src/store/store';
import {
  HexResponse,
  PancakeResponse,
  PhiatResponse,
  PulsexResponse,
  WalletResponse
} from '@app-src/types/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

const fetchWalletData = createAsyncThunk<WalletResponse, string, { state: RootState }>(
  'protocols/fetchWalletData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const res = await fetch(`/api/wallet?address=${address}&gt=0`);
    const data: WalletResponse = await res.json();

    // const data = await Promise.all(
    //   addresses.map((address) => {
    //     return Promise.all([
    //       crypto.fetchEthTokenWalletData(address, controller.signal),
    //       crypto.fetchTplsTokenWalletData(address, controller.signal),
    //       crypto.fetchBscTokenWalletData(address, controller.signal)
    //     ]);
    //   })
    // );

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

  const responses: HexResponse[] = [];
  let fetchMore = true;
  let page = 1;

  while (fetchMore) {
    const res = await fetch(`/api/hex?address=${address}&page=${page}`);
    const data: HexResponse = await res.json();
    responses.push(data);

    if (data.next === null) fetchMore = false;
    else page = data.next;
  }

  if (responses.length === 1) return responses[0];

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

  for (let i = 0; i < responses.length; i++) {
    collatedRes.data.ETHEREUM.data = collatedRes.data.ETHEREUM.data.concat(
      responses[i].data.ETHEREUM.data
    );
    collatedRes.data.ETHEREUM.totalValue += responses[i].data.ETHEREUM.totalValue;

    collatedRes.data.TPLS.data = collatedRes.data.TPLS.data.concat(responses[i].data.TPLS.data);
    collatedRes.data.TPLS.totalValue += responses[i].data.TPLS.totalValue;
  }

  // const data = await Promise.all(
  //   addresses.map((address) => {
  //     return crypto.fetchHexStakeData(address, controller.signal);
  //   })
  // );

  return collatedRes;
});

const fetchPhiatData = createAsyncThunk<PhiatResponse, string, { state: RootState }>(
  'protocols/fetchPhiatData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    // const data = await Promise.all(
    //   addresses.map((address) => {
    //     return crypto.fetchPhiatData(address, controller.signal);
    //   })
    // );

    const responses: PhiatResponse[] = [];
    let fetchMore = true;
    let page = 1;

    while (fetchMore) {
      const res = await fetch(`/api/phiat?address=${address}&page=${page}`);
      const data: PhiatResponse = await res.json();
      responses.push(data);

      if (data.next === null) fetchMore = false;
      else page = data.next;
    }

    if (responses.length === 1) return responses[0];

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

    for (let i = 0; i < responses.length; i++) {
      collatedRes.data.STABLE_DEBT.data = collatedRes.data.STABLE_DEBT.data.concat(
        responses[i].data.STABLE_DEBT.data
      );
      collatedRes.data.VARIABLE_DEBT.data = collatedRes.data.VARIABLE_DEBT.data.concat(
        responses[i].data.VARIABLE_DEBT.data
      );
      collatedRes.data.LENDING.data = collatedRes.data.LENDING.data.concat(
        responses[i].data.LENDING.data
      );
      collatedRes.data.STAKING.data = collatedRes.data.STAKING.data.concat(
        responses[i].data.STAKING.data
      );
      collatedRes.data.PH_TOKENS.data = collatedRes.data.PH_TOKENS.data.concat(
        responses[i].data.PH_TOKENS.data
      );

      collatedRes.data.STABLE_DEBT.totalValue += responses[i].data.STABLE_DEBT.totalValue;
      collatedRes.data.VARIABLE_DEBT.totalValue += responses[i].data.VARIABLE_DEBT.totalValue;
      collatedRes.data.LENDING.totalValue += responses[i].data.LENDING.totalValue;
      collatedRes.data.STAKING.totalValue += responses[i].data.STAKING.totalValue;
      collatedRes.data.PH_TOKENS.totalValue += responses[i].data.PH_TOKENS.totalValue;

      collatedRes.data.STAKING_APY = responses[i].data.STAKING_APY;
      // collatedRes.data.ETHEREUM.totalValue += responses[i].data.ETHEREUM.totalValue;

      // collatedRes.data.TPLS.data = collatedRes.data.TPLS.data.concat(responses[i].data.TPLS.data);
      // collatedRes.data.TPLS.totalValue += responses[i].data.TPLS.totalValue;
    }

    return collatedRes;
  }
);

const fetchPulsexData = createAsyncThunk<PulsexResponse, string, { state: RootState }>(
  'protocols/fetchPulsexData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const res = await fetch(`/api/pulsex?address=${address}`);
    const data: PulsexResponse = await res.json();

    // const data = await Promise.all(
    //   addresses.map((address) => {
    //     return crypto.fetchPulsexData(address, controller.signal);
    //   })
    // );

    // const data = await crypto.fetchPulsexData(address, controller.signal);

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

    const res = await fetch(`/api/pancake?address=${address}`);
    const data: PancakeResponse = await res.json();

    // const data = await Promise.all(
    //   addresses.map((address) => {
    //     return crypto.fetchPancakeData(address, controller.signal);
    //   })
    // );

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
    reset: () => initialState
  },
  extraReducers: (builder) => {
    //Wallet reducer functions
    builder.addCase(fetchWalletData.pending, (state) => {
      state.WALLET.loading = true;
    });

    builder.addCase(fetchWalletData.fulfilled, (state, action) => {
      // const data = action.payload.reduce(
      //   (prev, cur) => {
      //     prev[0] = prev[0].concat(cur[0]);
      //     prev[1] = prev[1].concat(cur[1]);
      //     prev[2] = prev[2].concat(cur[2]);

      //     return prev;
      //   },
      //   [[], [], []] as WalletData[]
      // );

      const data = action.payload;

      state.WALLET.data.ETHEREUM.push(data.ETHEREUM.data);
      state.WALLET.data.BSC.push(data.BSC.data);
      state.WALLET.data.TPLS.push(data.TPLS.data);

      state.WALLET.total.ETHEREUM += data.ETHEREUM.totalValue;
      state.WALLET.total.BSC += data.BSC.totalValue;
      state.WALLET.total.TPLS += data.TPLS.totalValue;

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
      // if (!action.payload) return;

      // const data = action.payload.reduce(
      //   (prev, cur) => {
      //     prev.ETHEREUM = prev.ETHEREUM.concat(cur.ETHEREUM);
      //     prev.TPLS = prev.TPLS.concat(cur.TPLS);

      //     return prev;
      //   },
      //   {
      //     [HexDataComponentEnum.ETHEREUM]: [],
      //     [HexDataComponentEnum.TPLS]: []
      //   } as HexData
      // );

      const res = action.payload;

      state.HEX.data.ETHEREUM.push(res.data.ETHEREUM.data);
      state.HEX.data.TPLS.push(res.data.TPLS.data);

      state.HEX.total.ETHEREUM += res.data.ETHEREUM.totalValue;
      state.HEX.total.TPLS += res.data.TPLS.totalValue;

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

      state.PHIAT.data.LENDING.push(res.data.LENDING.data);
      state.PHIAT.data.STABLE_DEBT.push(res.data.STABLE_DEBT.data);
      state.PHIAT.data.VARIABLE_DEBT.push(res.data.VARIABLE_DEBT.data);
      state.PHIAT.data.STAKING.push(res.data.STAKING.data);
      state.PHIAT.data.PH_TOKENS.push(res.data.PH_TOKENS.data);

      state.PHIAT.data.STAKING_APY = res.data.STAKING_APY;

      state.PHIAT.total.TPLS =
        res.data.LENDING.totalValue +
        res.data.PH_TOKENS.totalValue +
        res.data.STABLE_DEBT.totalValue +
        res.data.STAKING.totalValue +
        res.data.VARIABLE_DEBT.totalValue;

      // const data = action.payload.reduce(
      //   (prev, cur) => {
      //     prev.PHIAT_LENDING = prev.PHIAT_LENDING.concat(cur.PHIAT_LENDING);
      //     prev.PHIAT_STAKING = prev.PHIAT_STAKING.concat(cur.PHIAT_STAKING);
      //     prev.PHIAT_STABLE_DEBT = prev.PHIAT_STABLE_DEBT.concat(cur.PHIAT_STABLE_DEBT);
      //     prev.PHIAT_VARIABLE_DEBT = prev.PHIAT_VARIABLE_DEBT.concat(cur.PHIAT_VARIABLE_DEBT);
      //     prev.PHIAT_TOKENS = prev.PHIAT_TOKENS.concat(cur.PHIAT_TOKENS);

      //     return prev;
      //   },
      //   {
      //     [PhiatDataComponentEnum.PHIAT_LENDING]: [],
      //     [PhiatDataComponentEnum.PHIAT_STAKING]: [],
      //     [PhiatDataComponentEnum.PHIAT_STABLE_DEBT]: [],
      //     [PhiatDataComponentEnum.PHIAT_VARIABLE_DEBT]: [],
      //     [PhiatDataComponentEnum.PHIAT_TOKENS]: []
      //   } as PhiatData
      // );

      // state.PHIAT.data.PHIAT_LENDING.push(data.PHIAT_LENDING);
      // state.PHIAT.data.PHIAT_STAKING.push(data.PHIAT_STAKING);
      // state.PHIAT.data.PHIAT_STABLE_DEBT.push(data.PHIAT_STABLE_DEBT);
      // state.PHIAT.data.PHIAT_VARIABLE_DEBT.push(data.PHIAT_VARIABLE_DEBT);
      // state.PHIAT.data.PHIAT_TOKENS.push(data.PHIAT_TOKENS);

      // state.PHIAT.total.PHIAT +=
      //   addObjectValue(data.PHIAT_LENDING, 'usdValue') +
      //   addObjectValue(data.PHIAT_STAKING, 'usdValue') -
      //   addObjectValue(data.PHIAT_VARIABLE_DEBT, 'usdValue') -
      //   addObjectValue(data.PHIAT_STABLE_DEBT, 'usdValue');

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

      state.PULSEX.data.LIQUIDITY_POOL.push(res.data.LIQUIDITY_POOL.data);

      state.PULSEX.total.LIQUIDITY_POOL += res.data.LIQUIDITY_POOL.totalValue;

      // const data = action.payload.reduce((prev, cur) => {
      //   return prev.concat(cur);
      // }, [] as PulsexData);

      // state.PULSEX.data.PULSEX.push(data);
      // state.PULSEX.total.PULSEX += addObjectValue(data, 'usdValue');

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

export const { reset } = protocolsSlice.actions;

export { fetchWalletData, fetchHexData, fetchPhiatData, fetchPancakeData, fetchPulsexData };

export default protocolsSlice.reducer;
