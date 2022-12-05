import { configureStore } from '@reduxjs/toolkit';
import historySlice from './history/historySlice';
import portfolioSlice from './portfolio/portfolioSlice';
// import chainsReducer from './chains/chainsSlice';
// import utilityReducer from './utility/utilitySlice';

// import cryptoReducer from './crypto/reducer';
// import historyReducer from './history/reducer';

export const store = configureStore({
  // reducer: { crypto: cryptoReducer, history: historyReducer }
  reducer: {
    // utility: utilityReducer,
    // histories: historiesReducer,
    history: historySlice,
    // protocols: protocolsReducer,
    portfolio: portfolioSlice
    // chains: chainsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
