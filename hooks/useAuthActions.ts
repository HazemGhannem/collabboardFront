import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { LoginData, SignupData } from '@/types/type';
import { api } from '@/utils/api';

export function useAuthActions() {
  const router = useRouter();
  const { login: save } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      const { data: response } = await api.post('/auth/signup', data);

      save(response.user, response.token);
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

      save(response.user, response.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loading, error, setError };
}
