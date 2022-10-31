import { tokenImages } from '@app-src/services/web3';
import { HistoryItem, HistoryResponse } from '@app-src/types/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { HistoryState } from './types';

const initialState: HistoryState = {
  hasFetched: false,
  loading: false,
  error: false,
  data: []
};

const fetchProfileHistory = createAsyncThunk<HistoryResponse, string, { state: RootState }>(
  'history/fetchProfileHistory',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    // const response = await fetch(`/api/history?address=${address}`, { signal: controller.signal });
    // const data: HistoryResponse = await response.json();

    const response = await fetch(`https://phiat.finance/history?add=${address}`, {
      signal: controller.signal
    });
    const data = await response.json();

    const resArr: HistoryItem[] = [];

    data.forEach((item: HistoryItem) => {
      resArr.push({
        chain: item.chain,
        image: tokenImages[item.chain],
        functionName: item.functionName,
        link: item.link,
        timeStamp: Number(item.timeStamp),
        tokens: item.tokens.map((token) => {
          token.image = tokenImages[token.token];
          return token;
        })
      });
    });

    return { data: resArr };
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHasFetched: (state, action: PayloadAction<boolean>) => {
      state.hasFetched = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfileHistory.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    });

    builder.addCase(fetchProfileHistory.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.loading = false;
    });

    builder.addCase(fetchProfileHistory.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });
  }
});

export const { setHasFetched: setHistoryHasFetched } = historySlice.actions;

export { fetchProfileHistory };

export default historySlice.reducer;
