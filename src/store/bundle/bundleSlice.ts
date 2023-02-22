import bundle from '@app-src/server/bundle';
import { TReturnType } from '@app-src/utils/tapi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BundleState } from './types';

const initialState: BundleState = {
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

export const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBundles.pending, (state) => {});

    builder.addCase(fetchBundles.fulfilled, (state, action) => {
      state.bundles = action.payload;
    });

    builder.addCase(fetchBundles.rejected, (state, action) => {
      throw new Error(action.error.message);
    });
  }
});

export { fetchBundles };

export default bundleSlice.reducer;
