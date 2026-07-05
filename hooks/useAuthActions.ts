'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LoginData, SignupData } from '@/types/type';
import { api } from '@/utils/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { logout as disconnect} from '@/store/slices/authSlice';
export function useAuthActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.post('/auth/signup', data);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.post('/auth/login', data);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
      dispatch(disconnect());
  };

  return { login, signup, loading, error, setError, logout };
}
