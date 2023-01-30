import { CheckerResponse, getChecker } from '@app-src/server/checker';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CheckerState } from './types';

const initialState: CheckerState = {
  hasFetched: false,
  loading: false,
  error: false,
  data: {
    phiatTransactions: [],
    phiatPoints: [],
    phameTransactions: [],
    phamePoints: [],
    phameTiers: []
  }
};

const fetchCheckerData = createAsyncThunk<CheckerResponse, string, { state: RootState }>(
  'checker/fetchCheckerData',
  async (address, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    const data = await getChecker(address, { signal: controller.signal });

    return data;
  }
);

export const checkerSlice = createSlice({
  name: 'checker',
  initialState,
  reducers: {
    setHasFetched: (state, action: PayloadAction<boolean>) => {
      state.hasFetched = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCheckerData.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    });

    builder.addCase(fetchCheckerData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchCheckerData.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });
  }
});

export const { setHasFetched: setCheckerHasFetched } = checkerSlice.actions;

export { fetchCheckerData };

export default checkerSlice.reducer;
