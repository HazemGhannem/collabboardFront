'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { rehydrate } from '@/store/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(rehydrate()); // ← rehydrate auth from localStorage on mount
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
