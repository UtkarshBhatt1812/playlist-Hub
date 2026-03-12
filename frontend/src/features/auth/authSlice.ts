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
      action: PayloadAction<{ id: string; name: string; isAuthenticated: boolean }>
    ) 
    {
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
        isAuthenticated: action.payload.isAuthenticated ,
      } ;
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