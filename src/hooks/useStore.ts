import { Store } from "../core/store";
import { subscribeToStore } from "../utils/subscription";

export const useStore = <T>(
  store: Store<T>,
  selector: (state: T) => any,
  onUpdate: (selectedState: any) => void,
) => {
  return subscribeToStore(store, selector, onUpdate);
};
