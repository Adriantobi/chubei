import { Store } from "../core/store";

export const useSelector = <T, U>(
  store: Store<T>,
  selector: (state: T) => U,
): U => {
  let selectedState = selector(store.getState());

  store.subscribe((state) => {
    selectedState = selector(state);
  });

  return selectedState;
};
