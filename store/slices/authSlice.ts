import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUserPublic } from '@/types/type';

interface AuthState {
  user: IUserPublic | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null, // ← remove localStorage access here
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUserPublic; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    // ← Add this to rehydrate on client mount
    rehydrate: (state) => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token) state.token = token;
      if (user) state.user = JSON.parse(user);
    },
  },
});

export const { setCredentials, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;
