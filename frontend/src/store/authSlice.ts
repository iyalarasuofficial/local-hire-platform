import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';



interface AuthState {
  uid: string | null;
  email: string | null;
  name: string | null;
  role: 'user' | 'worker' | 'admin' | null;
  profilePic: string;
}

const initialState: AuthState = {
  uid: null,
  email: null,
  name: null,
  role: null,
  profilePic: "",
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
    },

    updateUserProfile: (
      state,
      action: PayloadAction<Partial<Omit<AuthState, 'uid' | 'role'>>>
    ) => {
      // Only update provided fields
      if (action.payload.email !== undefined) state.email = action.payload.email;
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.profilePic !== undefined)
        state.profilePic = action.payload.profilePic;
    },

    logoutUser: (state) => {
      state.uid = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.profilePic = "";
    },
  },
});

export const { setUser, updateUserProfile, logoutUser } = authSlice.actions;
export default authSlice.reducer;
