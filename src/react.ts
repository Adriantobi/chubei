import { useState, useEffect } from "react";
import { StoreCreator, SetState, GetState, ERROR_CODES } from "./types";
import { ChuBeiError } from "./utils/error";

export const create = <T extends Record<string, any> = any>(
  storeCreator: StoreCreator<T>,
): (() => T & { setState: SetState<T>; getState: GetState<T> }) => {
  if (typeof storeCreator !== "function" || storeCreator.length !== 2) {
    throw new ChuBeiError(
      ERROR_CODES.STORE_CREATOR_REQUIRED,
      "StoreCreator function is required with setState and getState parameters",
    );
  }

  let state: T; // Initial state storage
  let listeners: (() => void)[] = []; // Listeners for React components

  const setState: SetState<T> = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener()); // Notify all listeners
  };

  const getState: GetState<T> = () => state;

  // Initialize the store using the creator function
  state = storeCreator(setState, getState);

  // Hook to use the store in React
  return () => {
    const [, setReactState] = useState(0); // Force re-render when state updates

    useEffect(() => {
      const listener = () => setReactState((prev) => prev + 1); // Increment to trigger render
      listeners.push(listener); // Add this component's listener

      return () => {
        listeners = listeners.filter((l) => l !== listener); // Remove listener on unmount
      };
    }, []);

    return {
      ...state,
      setState,
      getState,
    };
  };
};
