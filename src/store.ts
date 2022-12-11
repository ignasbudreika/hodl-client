import { createSlice, configureStore,PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector,TypedUseSelectorHook } from 'react-redux';

const initialState:Tokens = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || ""
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<Tokens>) => {
      console.log(action.payload)
      localStorage.setItem("accessToken", action.payload.accessToken);
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      state.refreshToken = action.payload.refreshToken;

      return state;
    },
    logout: (state) => {
      localStorage.removeItem("accessToken");
      state.accessToken = "";
      localStorage.removeItem("refreshToken");
      state.refreshToken = "";

      return state;
    }
  }
})

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  },
});


export const { login, logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;