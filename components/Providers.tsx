'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { logout, setCredentials } from '@/store/slices/authSlice';
import { api } from '@/utils/api';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      // Silent redirect errors (401/403 handled by the axios interceptor)
      // are expected and already handled — don't log them as failures.
      if (error?.silent) return;
      console.error('Query error:', error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: (count, error: any) => {
        // never retry on 401/403/404 — retrying won't change the outcome
        const status = error?.response?.status;
        if ([401, 403, 404].includes(status)) return false;
        return count < 2;
      },
      // Never throw to a React error boundary — every query's error should
      // flow into its own `error` return value and be handled by the
      // component (e.g. ErrorFetching), not crash the tree.
      throwOnError: false,
    },
  },
});
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const publicPaths = ['/login', '/signup'];
    if (publicPaths.includes(window.location.pathname)) {
      store.dispatch(logout()); // ensure Redux is in a clean logged-out state
      return;
    }

    api
      .get('/auth/me')
      .then(({ data }) => store.dispatch(setCredentials({ user: data.data.user })))
      .catch(() => store.dispatch(logout())); // cookie invalid/expired
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );
}
