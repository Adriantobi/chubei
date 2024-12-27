import {
  Middleware,
  StoreCreator,
  SetState,
  GetState,
  LoggerOptions,
} from "../../types";

export const logger: Middleware<LoggerOptions> = <T>(
  store: StoreCreator<T>,
  options: LoggerOptions,
) => {
  return (set: SetState<T>, get: GetState<T>): T => {
    const log = (newState: T) => {
      if (options.collapsed) {
        console.groupCollapsed("State updated");
      } else {
        console.group("State updated");
      }

      if (options.timestamp) {
        console.log("Timestamp:", new Date().toUTCString());
      }

      if (options.duration) {
        console.time("Duration");
      }

      if (options.colors) {
        console.log("%cNew state:", "color: #4CAF50;", newState);
      } else {
        console.log("New state:", newState);
      }

      if (options.duration) {
        console.timeEnd("Duration");
      }

      console.groupEnd();
    };

    return store((newState: Partial<T> | ((state: T) => Partial<T>)) => {
      const currentState = get();

      const resolvedState =
        typeof newState === "function" ? newState(currentState) : newState;

      set(resolvedState);
      log({ ...get(), ...resolvedState });
    }, get);
  };
};
