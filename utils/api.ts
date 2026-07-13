// utils/api.ts
import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import socket from '@/utils/socket';
import { toast } from 'sonner';

class SilentError extends Error {
  silent = true;
  constructor(message = 'Silent — handled via redirect') {
    super(message);
    this.name = 'SilentError';
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

function hardLogout() {
  store.dispatch(logout()); // clear Redux auth + board state
  if (socket.connected) socket.disconnect(); // don't leave a stale authenticated socket dangling
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const isNetworkError = !error.response;
    const isPageLoad = error.config?.meta?.pageLoad === true;
    const backendMessage = error.response?.data?.error;
    const message = isNetworkError
      ? 'Network error — check your connection.'
      : (backendMessage ?? 'Something went wrong. Try again.');
    error.userMessage = message;
    console.error('API Error:', {
      status,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (status === 401 && typeof window !== 'undefined') {
      hardLogout();
      return Promise.reject(new SilentError('Session expired'));
    }

    if (status === 403 && isPageLoad && typeof window !== 'undefined') {
      // Not a member of this resource at all — silently bounce away
      window.location.replace('/');
      return Promise.reject(new SilentError('Not authorized for this page'));
    }
    if (!error.config?.meta?.silent) {
      const toastId = isNetworkError ? 'network-error' : error.config?.url;
      toast.error(message, { id: toastId });
    }
    // Action-level 403s (and everything else) flow through as real errors —
    // the caller decides how to surface them (toast, inline message, etc.)
    return Promise.reject(error);
  },
);
