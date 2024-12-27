import { Store } from "./core/store";
import {
  StoreCreator,
  SetState,
  GetState,
  CreatorFunction,
  ERROR_CODES,
} from "./types";
import { ChuBeiError } from "./utils/error";

export const createStore: CreatorFunction = <
  T extends Record<string, any> = any,
>(
  storeCreator: StoreCreator<T>,
): Store<T> => {
  if (typeof storeCreator !== "function" || storeCreator.length !== 2) {
    throw new ChuBeiError(
      ERROR_CODES.STORE_CREATOR_REQUIRED,
      "StoreCreator function is required with setState and getState parameters",
    );
  }

  // Create set and get functions
  const setState: SetState<T> = (
    newState: Partial<T> | ((state: T) => Partial<T>),
  ) => {
    const resolvedState =
      typeof newState === "function" ? newState(store.state) : newState;

    store.state = { ...store.state, resolvedState };
    store.setState(resolvedState);
  };

  const getState: GetState<T> = () => store.state;

  // Create the store using the store creator
  const store = new Store<T>(storeCreator(setState, getState));

  return store;
};
