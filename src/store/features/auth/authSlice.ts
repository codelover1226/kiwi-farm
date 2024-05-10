import { createAppSlice } from "@/store/createAppSlice";
import type { AppThunk } from "@/store/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JsonObject } from "type-fest";

interface User {
  id: string;
  title: string;
  password: string;
  password1: string;
  slug: string;
  description: string;
}
export interface AuthSliceState {
    username: string;
    isAdmin: boolean;
    isVisitor: boolean;
    isLogin: boolean;
    user: User;
}

const initialState: AuthSliceState = {
    username : "",
    isAdmin  : false,
    isVisitor  : false,
    isLogin  : false,
    user: {
      id: "",
      title: "",
      password: "",
      password1: "",
      slug: "",
      description: "",
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
      },
    ),
    setUser: create.reducer(
      (state, action: PayloadAction<User>) => {
          state.user = action.payload;
      },
    ),
  }),
  
  selectors: {
    selectUsername: (auth) => auth.username,
    selectIsAdmin: (auth) => auth.isAdmin,
    selectIslogin: (auth) => auth.isLogin,
    selectUser: (auth) => auth.user,
    selectIsVisitor: (auth) => auth.isVisitor,
  },
});

// Action creators are generated for each case reducer function.
export const { login, logout, setIsAdmin, setUsername, setUser, setIsVisitor } =
  authSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUsername, selectIsAdmin, selectIslogin, selectUser, selectIsVisitor } = authSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };
