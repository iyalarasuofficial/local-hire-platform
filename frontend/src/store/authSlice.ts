import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  uid: string | null;
  email: string | null;
  name: string | null;
  role: 'user' | 'worker' | 'admin' | null;
  profilePic: string;
  loading: boolean; // ✅ added loading state
}

const initialState: AuthState = {
  uid: null,
  email: null,
  name: null,
  role: null,
  profilePic: "",
  loading: true, // starts loading until auth check completes
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
        profilePic?: string;
      }>
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.profilePic = action.payload.profilePic || "";
      state.loading = false; // ✅ auth check done
    },

    updateUserProfile: (
      state,
      action: PayloadAction<Partial<Omit<AuthState, 'uid' | 'role' | 'loading'>>>
    ) => {
      if (action.payload.email !== undefined) state.email = action.payload.email;
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.profilePic !== undefined) state.profilePic = action.payload.profilePic;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    logoutUser: (state) => {
      state.uid = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.profilePic = "";
      state.loading = false;
    },
  },
});

export const { setUser, updateUserProfile, logoutUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
