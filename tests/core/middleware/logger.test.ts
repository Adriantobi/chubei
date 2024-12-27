import { logger } from "../../../src/core/middleware/logger";
import { createStore } from "../../../src/vanilla";
import { Store } from "../../../src/core/store";

describe("logger middleware", () => {
  const useLoggerStore = createStore<{
    count: number;
    increment: () => void;
    decrement: () => void;
  }>(
    logger(
      (set) => ({
        count: 0,
        decrement: () => set((state) => ({ count: state.count - 1 })),
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      { collapsed: true, timestamp: true, duration: true, colors: true },
    ),
  );

  const store = useLoggerStore as Store<{
    count: number;
    increment: () => void;
    decrement: () => void;
  }>;

  beforeEach(() => {
    // Reset the store state before each test
    store.setState({ count: 0 });
  });

  it("should log state changes", () => {
    // Initial state
    let initialState = store.getState();
    expect(initialState.count).toBe(0);

    // Increment count
    store.getState().increment();
    let incrementedState = store.getState();
    expect(incrementedState.count).toBe(1);

    // Decrement count
    store.getState().decrement();
    let decrementedState = store.getState();
    expect(decrementedState.count).toBe(0);

    console.log({
      initialState,
      incrementedState,
      decrementedState,
    });
  });
});
