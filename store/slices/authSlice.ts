import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUserPublic } from '@/types/type';

interface AuthState {
  user: IUserPublic | null;
}

const initialState: AuthState = {
  user: null,
};

// authSlice.ts — no localStorage at all
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null as IUserPublic | null, checked: false },
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUserPublic }>) => {
      state.user = action.payload.user;
      state.checked = true;
    },
    logout: (state) => {
      state.user = null;
      state.checked = true;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
