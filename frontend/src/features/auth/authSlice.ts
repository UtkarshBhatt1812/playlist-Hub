import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthState } from "./auth.types";

const initialState: AuthState = {
  user: {
    id: "",
    name: "",
    isAuthenticated: false,
  },
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setUser(
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) {
      state.user = {
        ...action.payload,
        isAuthenticated: true,
      };
      state.loading = false;
    },

    logout(state) {
      state.user.id = "";
      state.user.name = "";
      state.user.isAuthenticated = false;
      state.loading = false;
    },

  },
});

export const { setLoading, setUser, logout } = authSlice.actions;

export default authSlice.reducer;