import {
  DevtoolsOptions,
  ERROR_CODES,
  GetState,
  Middleware,
  SetState,
  StoreCreator,
} from "../../types";
import { ChuBeiError } from "../../utils/error";

export const devtools: Middleware<DevtoolsOptions> = <T>(
  store: StoreCreator<T>,
  options: DevtoolsOptions,
) => {
  return (set: SetState<T>, get: GetState<T>): T => {
    // Destructure options without default values
    const { name, anonymousActionType, serialize, enabled, trace, traceLimit } =
      options;

    // Ensure that the options are defined
    if (!options) {
      throw new ChuBeiError(
        ERROR_CODES.OPTIONS_REQUIRED,
        "Devtools middleware requires options to be provided.",
      );
    }

    // Set defaults for undefined options
    const currentName = name || "zustandStore";
    const currentActionType = anonymousActionType || "STATE_UPDATE";
    const currentSerialize = serialize !== undefined ? serialize : true;
    const currentEnabled = enabled !== undefined ? enabled : true;
    const currentTrace = trace !== undefined ? trace : false;
    const currentTraceLimit = traceLimit || 10;

    // Track the action history for tracing
    const _history: string[] = [];

    return store((newState: Partial<T> | ((state: T) => Partial<T>)) => {
      if (!currentEnabled) {
        return set(newState); // No devtools logging if not enabled
      }

      const currentState = get();
      const resolvedState =
        typeof newState === "function" ? newState(currentState) : newState;
      const mergedState = { ...currentState, ...resolvedState } as T;

      // Handle optional serialization before updating state
      const stateToLog = currentSerialize
        ? JSON.stringify(mergedState)
        : mergedState;

      // Log the action to the console (or browser devtools)
      if (currentTrace) {
        // Store action traces
        if (_history.length >= currentTraceLimit) {
          _history.shift(); // Remove the oldest trace if limit exceeded
        }
        _history.push(`Action: ${currentActionType} - State: ${stateToLog}`);
        console.groupCollapsed(
          `%c${currentName} - Action: ${currentActionType}`,
          "color: #ff6347",
        );
        console.log("New State:", stateToLog);
        console.groupEnd();
      }

      set(mergedState);
    }, get);
  };
};
