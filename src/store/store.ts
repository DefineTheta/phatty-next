import { configureStore } from '@reduxjs/toolkit';
import bundlesReducer from './bundles/bundleSlice';
import historySlice from './history/historySlice';
// import chainsReducer from './chains/chainsSlice';
// import historiesReducer from './histories/historiesSlice';
import protocolsReducer from './protocol/protocolSlice';
// import utilityReducer from './utility/utilitySlice';

// import cryptoReducer from './crypto/reducer';
// import historyReducer from './history/reducer';

export const store = configureStore({
  // reducer: { crypto: cryptoReducer, history: historyReducer }
  reducer: {
    // utility: utilityReducer,
    // histories: historiesReducer,
    history: historySlice,
    protocols: protocolsReducer,
    // chains: chainsReducer,
    bundles: bundlesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
