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

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.update(data.id, data, { signal: controller.signal, cache: 'no-store' });
});

const createBundle = createAsyncThunk<
  TReturnType<typeof bundle.create>,
  void,
  { state: RootState }
>('bundle/createBundle', async (_, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.create(
    { name: 'Untitled Bundle', addresses: [], visibility: 'PRIVATE' },
    { signal: controller.signal, cache: 'no-store' }
  );
});

const deleteBundle = createAsyncThunk<
  TReturnType<typeof bundle.delete>,
  string,
  { state: RootState }
>('bundle/deleteBundle', async (bundleId, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.delete(bundleId, { signal: controller.signal, cache: 'no-store' });
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
      throw new Error(action.error.message);
    });

    builder.addCase(createBundle.pending, (state) => {});

    builder.addCase(createBundle.fulfilled, (state, action) => {
      const index = state.bundles.length;
      state.bundles.push(action.payload);

      state.bundlesIndex[action.payload.id] = index;
    });

    builder.addCase(createBundle.rejected, (state, action) => {
      throw new Error(action.error.message);
    });

    builder.addCase(deleteBundle.pending, (state) => {});

    builder.addCase(deleteBundle.fulfilled, (state, action) => {
      const bundlesIndex: { [k: string]: number } = {};
      const bundles = state.bundles.filter((bundle) => bundle.id !== action.meta.arg);

      bundles.forEach((bundle, index) => {
        bundlesIndex[bundle.id] = index;
      });

      state.bundles = bundles;
      state.bundlesIndex = bundlesIndex;
    });

    builder.addCase(deleteBundle.rejected, (state, action) => {
      throw new Error(action.error.message);
    });
  }
});

export { fetchBundles, updateBundle, deleteBundle, createBundle };

export default bundleSlice.reducer;
