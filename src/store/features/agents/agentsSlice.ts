import { createAppSlice } from "@/store/createAppSlice";
import type { AppThunk } from "@/store/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JsonObject } from "type-fest";
import { fetchAgents } from "./agentsAPI";

interface User {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: JsonObject;
    password: string;
    password1: string;
    menuList: string;
}
export interface AgentsSliceState {
    isSuccess : boolean;
    agents    : User[];
    status    : "idle" | "loading" | "failed";
    msg       : string;
}

const initialState: AgentsSliceState = {
    isSuccess : false,
    agents    : [],
    status    : "idle",
    msg       :"",
};

export const agentsSlice = createAppSlice({
  name: "agents",
  
  initialState,
  
  reducers: (create) => ({
    getAgents: create.asyncThunk(
        async (isSuperUser:boolean = false) => {
          const response = await fetchAgents(isSuperUser);
          // The value we return becomes the `fulfilled` action payload
          return response;
        },
        {
          pending: (state) => {
            state.status = "loading";
          },
          fulfilled: (state, action) => {
            state.status = "idle";
            if(action.payload.isSuccess) {
                state.agents = JSON.parse(action.payload.data);
            }else{
                state.msg = action.payload.data;
            }
          },
          rejected: (state) => {
            state.status = "failed";
          },
        },
      ),
  }),
  
  selectors: {
    selectAgents   : (agents) => agents.agents,
    selectMsg      : (agents) => agents.msg,
    selectIsSuccess: (agents) => agents.isSuccess,
    selectStatus   : (agents) => agents.status,
  },
});

// Action creators are generated for each case reducer function.
export const { getAgents } =
  agentsSlice.actions;
 
// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAgents, selectMsg, selectIsSuccess, selectStatus } = agentsSlice.selectors;

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
