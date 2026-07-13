'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { LoginData, SignupData } from '@/types/type';
import { api } from '@/utils/api';
import { useAppDispatch } from '@/store/hooks';
import {
  setCredentials,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { useBoardSocketActions } from './useBoardSocketActions';

async function signupRequest(data: SignupData) {
  const { data: response } = await api.post('/auth/signup', data);
  return response;
}
async function loginRequest(data: LoginData) {
  const { data: response } = await api.post('/auth/login', data);
  return response;
}

export function useAuthActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { emitDisconnectSocket } = useBoardSocketActions();

  const signupMutation = useMutation({
    mutationFn: signupRequest,
    onSuccess: (response) => {
      dispatch(setCredentials({ user: response.user }));
      router.push('/');
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      dispatch(setCredentials({ user: response.user }));
      router.push('/');
    },
  });

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // best-effort — proceed with client-side cleanup regardless
    }
    emitDisconnectSocket();
    dispatch(logoutAction());
    router.push('/login');
  };

  return {
    signup: signupMutation.mutate,
    login: loginMutation.mutate,
    loading: signupMutation.isPending || loginMutation.isPending,
    error: (signupMutation.error ?? loginMutation.error) as any,
    logout,
  };
}
