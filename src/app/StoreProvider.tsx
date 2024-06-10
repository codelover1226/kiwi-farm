"use client";
import type { AppStore } from "@/store/store";
import { makeStore } from "@/store/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    const persistedState = loadState();
    storeRef.current = makeStore(persistedState);
  }

  useEffect(() => {
    if (storeRef.current != null) {
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      
      const saveStateToLocalStorage = () => {
        saveState(storeRef.current?.getState());
      };
      storeRef.current.subscribe(saveStateToLocalStorage);

      return () => {
        unsubscribe();
        storeRef.current?.subscribe(saveStateToLocalStorage);
      };
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

const loadState = (): any => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: any): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
    window.dispatchEvent(new Event("storage"));
  } catch {
  }
};
