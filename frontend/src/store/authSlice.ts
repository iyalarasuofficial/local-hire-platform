import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  uid: string | null;
  email: string | null;
  name: string | null;
  role: 'user' | 'worker' | 'admin' | null;
}

const initialState: AuthState = {
  uid: null,
  email: null,
  name: null,
  role: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        uid: string;
        email: string;
        name: string;
        role: 'user' | 'worker' | 'admin';
      }>
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    logoutUser: (state) => {
      state.uid = null;
      state.email = null;
      state.name = null;
      state.role = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
