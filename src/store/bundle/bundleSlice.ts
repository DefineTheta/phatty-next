import bundle, { Bundle } from '@app-src/server/bundle';
import { TReturnType } from '@app-src/utils/tapi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BundleState } from './types';

const initialState: BundleState = {
  bundlesIndex: {},
  bundles: [],
  currentBundle: null,
  publicBundlesIndex: {},
  publicBundles: [],
  currentPublicBundle: null
};

const fetchBundle = createAsyncThunk<
  TReturnType<typeof bundle.fetch>,
  string,
  { state: RootState }
>('bundle/fetchBundle', async (bundleId, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.fetch(bundleId, { signal: controller.signal, cache: 'no-store' });
});

const fetchPublicBundle = createAsyncThunk<
  TReturnType<typeof bundle.fetch>,
  string,
  { state: RootState }
>('bundle/fetchPublicBundle', async (bundleId, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.fetch(bundleId, { signal: controller.signal, cache: 'no-store' });
});

const fetchBundles = createAsyncThunk<
  TReturnType<typeof bundle.fetchAll>,
  void,
  { state: RootState }
>('bundle/fetchBundles', async (_, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.fetchAll(false, { signal: controller.signal, cache: 'no-store' });
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

const fetchPublicBundles = createAsyncThunk<
  TReturnType<typeof bundle.fetchAll>,
  void,
  { state: RootState }
>('bundle/fetchPublicBundles', async (_, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.fetchAll(true, { signal: controller.signal, cache: 'no-store' });
});

const likeBundle = createAsyncThunk<TReturnType<typeof bundle.like>, string, { state: RootState }>(
  'bundle/likeBundle',
  async (bundleId, thunkAPI) => {
    const controller = new AbortController();

    thunkAPI.signal.onabort = () => {
      controller.abort();
    };

    return await bundle.like(bundleId, { signal: controller.signal, cache: 'no-store' });
  }
);

const dislikeBundle = createAsyncThunk<
  TReturnType<typeof bundle.dislike>,
  string,
  { state: RootState }
>('bundle/dislikeBundles', async (bundleId, thunkAPI) => {
  const controller = new AbortController();

  thunkAPI.signal.onabort = () => {
    controller.abort();
  };

  return await bundle.dislike(bundleId, { signal: controller.signal, cache: 'no-store' });
});

export const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBundle.pending, (state) => {});

    builder.addCase(fetchBundle.fulfilled, (state, action) => {
      state.currentBundle = action.payload;
    });

    builder.addCase(fetchBundle.rejected, (state, action) => {
      console.error(action.error.message);
    });

    builder.addCase(fetchPublicBundle.pending, (state) => {});

    builder.addCase(fetchPublicBundle.fulfilled, (state, action) => {
      state.currentPublicBundle = action.payload;
    });

    builder.addCase(fetchPublicBundle.rejected, (state, action) => {
      console.error(action.error.message);
    });

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

    builder.addCase(fetchPublicBundles.pending, (state) => {});

    builder.addCase(fetchPublicBundles.fulfilled, (state, action) => {
      const bundlesIndex: { [k: string]: number } = {};
      action.payload.forEach((bundle, index) => {
        bundlesIndex[bundle.id] = index;
      });

      state.publicBundles = action.payload;
      state.publicBundlesIndex = bundlesIndex;
    });

    builder.addCase(fetchPublicBundles.rejected, (state, action) => {
      console.error(action.error.message);
    });

    builder.addCase(likeBundle.pending, (state) => {});

    builder.addCase(likeBundle.fulfilled, (state, action) => {
      const index = state.publicBundlesIndex[action.payload.id];
      state.publicBundles[index] = action.payload;
    });

    builder.addCase(likeBundle.rejected, (state, action) => {
      console.error(action.error.message);
    });

    builder.addCase(dislikeBundle.pending, (state) => {});

    builder.addCase(dislikeBundle.fulfilled, (state, action) => {
      const index = state.publicBundlesIndex[action.payload.id];
      state.publicBundles[index] = action.payload;
    });

    builder.addCase(dislikeBundle.rejected, (state, action) => {
      console.error(action.error.message);
    });
  }
});

export {
  fetchBundle,
  fetchBundles,
  updateBundle,
  deleteBundle,
  createBundle,
  fetchPublicBundles,
  fetchPublicBundle,
  likeBundle,
  dislikeBundle
};

export default bundleSlice.reducer;
