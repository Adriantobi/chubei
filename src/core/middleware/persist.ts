import {
  Middleware,
  StoreCreator,
  SetState,
  GetState,
  PersistOptions,
} from "../../types";
import { Storage } from "../../utils/storage";

export const persist: Middleware<PersistOptions> = <T>(
  store: StoreCreator<T>,
  options: PersistOptions,
) => {
  return (set: SetState<T>, get: GetState<T>): T => {
    let storage: Storage<T>;

    // Load stored state asynchronously
    (async () => {
      storage = new Storage<T>(options.key, options.storageType);
      const storedState = await storage?.get();
      if (storedState) {
        set(storedState);
      }
    })();

    return store((newState: Partial<T> | ((state: T) => Partial<T>)) => {
      const currentState = get();

      const resolvedState =
        typeof newState === "function" ? newState(currentState) : newState;

      const mergedState = { ...currentState, ...resolvedState } as T;
      set(mergedState);
      storage?.set(mergedState);
    }, get);
  };
};
