import { createAppSlice } from "@/store/createAppSlice";
import type { AppThunk } from "@/store/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BlobOptions } from "buffer";
import { JsonObject } from "type-fest";

interface User {
  id: string;
  title: string;
  password: string;
  password1: string;
  slug: string;
  description: string;
  menuList: string;
}
export interface AuthSliceState {
    username: string;
    isAdmin: boolean;
    isVisitor: boolean;
    isAgency: boolean;
    isLogin: boolean;
    isNothing: boolean;
    isCart: boolean;
    user: User;
}

const initialState: AuthSliceState = {
    username : "",
    isAdmin  : false,
    isVisitor  : false,
    isAgency  : false,
    isLogin  : false,
    isNothing: false,
    isCart: false,
    user: {
      id: "",
      title: "",
      password: "",
      password1: "",
      slug: "",
      description: "",
      menuList: "",
    },
};

export const authSlice = createAppSlice({
  name: "auth",
  
  initialState,
  
  reducers: (create) => ({
    login: create.reducer((state) => {
      state.isLogin = true;
    }), 
    logout: create.reducer((state) => {
      state.isLogin = false;
    }),
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    setUsername: create.reducer(
        (state, action: PayloadAction<string>) => {
          state.username = action.payload;
        },
      ),
    setIsAdmin: create.reducer(
      (state, action: PayloadAction<boolean>) => {
          state.isAdmin = action.payload;
      },
    ),
    setIsVisitor: create.reducer(
      (state, action: PayloadAction<boolean>) => {
          state.isVisitor = action.payload;
          state.isNothing = action.payload;
      },
    ),
    setIsAgency: create.reducer(
      (state, action: PayloadAction<boolean>) => {
          state.isAgency = action.payload;
      },
    ),
    setUser: create.reducer(
      (state, action: PayloadAction<User>) => {
          state.user = action.payload;
      },
    ),
    setNothing: create.reducer(
      (state, action: PayloadAction<boolean>) => {
          state.isNothing = action.payload;
      },
    ),
    setCart: create.reducer(
      (state, action: PayloadAction<boolean>) => {
          state.isCart = action.payload;
      },
    ),
  }),
  
  selectors: {
    selectUsername: (auth) => auth.username,
    selectIsAdmin: (auth) => auth.isAdmin,
    selectIslogin: (auth) => auth.isLogin,
    selectUser: (auth) => auth.user,
    selectIsVisitor: (auth) => auth.isVisitor,
    selectIsAgency: (auth) => auth.isAgency,
    selectIsNothing: (auth) => auth.isNothing,
    selectIsCart: (auth) => auth.isCart,
  },
});

export const { login, logout, setIsAdmin, setUsername, setUser, setIsVisitor, setIsAgency, setNothing, setCart } =
  authSlice.actions;

export const { selectUsername, selectIsAdmin, selectIslogin, selectUser, selectIsVisitor, selectIsAgency, selectIsNothing, selectIsCart } = authSlice.selectors;
