'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ApiResponseError, LoginData, SignupData } from '@/types/type';
import { api } from '@/utils/api';
import { useAppDispatch } from '@/store/hooks';
import {
  setCredentials,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { useBoardSocketActions } from './useBoardSocketActions';

export function useAuthActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { emitDisconnectSocket } = useBoardSocketActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiResponseError | null>(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.post('/auth/signup', data);
      dispatch(setCredentials({ user: response.user }));
      router.push('/');
    } catch (err: any) {
      setError(err.response ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.post('/auth/login', data);
      dispatch(setCredentials({ user: response.user }));
      router.push('/');
    } catch (err: any) {
      setError(err.response ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // clears the httpOnly cookie server-side
    } catch {
      // best-effort — proceed with client-side cleanup regardless
    }
    emitDisconnectSocket(); // kill the live socket, was authenticated as this user
    dispatch(logoutAction());
    router.push('/login');
  };
  const getMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      dispatch(setCredentials({ user: data.user }));
    } catch {
      dispatch(logoutAction()); // cookie invalid/expired
    }
  };

  return { login, signup, loading, error, setError, logout, getMe };
}
