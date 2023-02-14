import { CheckerResponse, getChecker } from '@app-src/server/checker';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CheckerData, CheckerState, Section, SectionEnum } from './types';

const initialCheckerData: CheckerData = {
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

const initialState: CheckerState = {
  [SectionEnum.PROFILE]: initialCheckerData,
  [SectionEnum.BUNDLE]: initialCheckerData
};

const fetchCheckerData = createAsyncThunk<
  { data: CheckerResponse; type: Section },
  { address: string; type: Section },
  { state: RootState }
>('checker/fetchCheckerData', async (input, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  const data = await getChecker(input.address, { signal: controller.signal });

  return {
    data,
    type: input.type
  };
});

export const checkerSlice = createSlice({
  name: 'checker',
  initialState,
  reducers: {
    setHasFetched: (state, action: PayloadAction<{ type: Section; fetched: boolean }>) => {
      state[action.payload.type].hasFetched = action.payload.fetched;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCheckerData.pending, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].loading = true;
      state[type].error = false;
    });

    builder.addCase(fetchCheckerData.fulfilled, (state, action) => {
      if (!action.payload) return;

      const type = action.payload.type;

      state[type].data = action.payload.data;
      state[type].loading = false;
    });

    builder.addCase(fetchCheckerData.rejected, (state, action) => {
      const type = typeof action.meta.arg === 'object' ? action.meta.arg.type : action.meta.arg;

      state[type].error = true;
      state[type].loading = false;
    });
  }
});

export const { setHasFetched: setCheckerHasFetched } = checkerSlice.actions;

export { fetchCheckerData };

export default checkerSlice.reducer;
