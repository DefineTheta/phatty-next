import bundle, { Bundle } from '@app-src/server/bundle';
import { TReturnType } from '@app-src/utils/tapi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BundleState } from './types';

const initialState: BundleState = {
  bundlesIndex: {},
  bundles: []
};

const fetchBundles = createAsyncThunk<
  TReturnType<typeof bundle.fetchAll>,
  void,
  { state: RootState }
>('bundle/fetchBundles', async (_, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.fetchAll({ signal: controller.signal, cache: 'no-store' });
});

const updateBundle = createAsyncThunk<
  TReturnType<typeof bundle.update>,
  Bundle,
  { state: RootState }
>('bundle/updateBundle', async (data, thunkAPI) => {
  const controller = new AbortController();
  console.log(data);

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.update(data.id, data, { signal: controller.signal, cache: 'no-store' });
});
export const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBundles.pending, (state) => {});

    builder.addCase(fetchBundles.fulfilled, (state, action) => {
      const bundlesIndex: { [k: string]: number } = {};
      action.payload.forEach((bundle, index) => {
        bundlesIndex[bundle.id] = index;
      });

      state.bundles = action.payload;
      state.bundlesIndex = bundlesIndex;
    });

    builder.addCase(fetchBundles.rejected, (state, action) => {
      throw new Error(action.error.message);
    });

    builder.addCase(updateBundle.pending, (state) => {});

    builder.addCase(updateBundle.fulfilled, (state, action) => {
      const index = state.bundlesIndex[action.payload.id];

      state.bundles[index] = action.payload;
    });

    builder.addCase(updateBundle.rejected, (state, action) => {
      console.log(action);
      throw new Error(action.error.message);
    });
  }
});

export { fetchBundles, updateBundle };

export default bundleSlice.reducer;
