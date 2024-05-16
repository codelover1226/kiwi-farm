import { createAppSlice } from "@/store/createAppSlice";
import type { AppThunk } from "@/store/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JsonObject } from "type-fest";
import { fetchProducts, IProduct } from "./productsAPI";

export interface AgentsSliceState {
    isSuccess : boolean;
    products  : IProduct[];
    selectedIndex : string;
    status    : "idle" | "loading" | "failed";
    msg       : string;
}

const initialState: AgentsSliceState = {
    isSuccess : false,
    products    : [],
    status    : "idle",
    msg       :"",
    selectedIndex : "-1",
};

export const productsSlice = createAppSlice({
  name: "products",
  
  initialState,
  
  reducers: (create) => ({
    getProducts: create.asyncThunk(
      async ({type, user}:{type:string, user:string}) => {
        console.log(type, user)
        const response = await fetchProducts({type, user});
        return response;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          if(action.payload.isSuccess) {
              state.products = JSON.parse(action.payload.data);
          }else{
              state.msg = action.payload.data;
          }
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
    setSelectedProduct: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.selectedIndex = action.payload;
      },
    ),
  }),
  
  selectors: {
    selectProducts : (products) => products.products,
    selectMsg      : (products) => products.msg,
    selectIsSuccess: (products) => products.isSuccess,
    selectStatus   : (products) => products.status,
    selectProduct  : (products) => products.selectedIndex,
  },
});

// Action creators are generated for each case reducer function.
export const { getProducts, setSelectedProduct } =
  productsSlice.actions;
 
// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectProduct ,selectProducts, selectMsg, selectIsSuccess, selectStatus } = productsSlice.selectors;

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
