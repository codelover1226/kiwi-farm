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
    // Load state from local storage if available, or create a new store instance
    const persistedState = loadState();
    storeRef.current = makeStore(persistedState);
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // Configure listeners using the provided defaults
      // Optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      
      // Save state to local storage whenever the store updates
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

// Load state from local storage
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

// Save state to local storage
const saveState = (state: any): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore write errors
  }
};
