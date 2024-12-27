import { Store } from "../core/store";

export const subscribeToStore = <T>(
  store: Store<T>,
  selector: (state: T) => any,
  onChange: (newState: any) => void,
): (() => void) => {
  let currentState = selector(store.getState());

  const checkForUpdates = (newState: T) => {
    const nextState = selector(newState);
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(nextState); // Notify the subscriber
    }
  };

  return store.subscribe(checkForUpdates); // Return the unsubscribe function
};
