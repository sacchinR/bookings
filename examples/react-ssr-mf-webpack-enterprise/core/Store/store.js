import { configureStore } from '@reduxjs/toolkit';
import shellReducer from './shellSlice';

export function createAppStore(preloadedState) {
  return configureStore({
    reducer: {
      shell: shellReducer
    },
    preloadedState
  });
}

export const store = createAppStore();
