import { Store } from "../../src/core/store";
import { Listener } from "../../src/types";

describe("Store class", () => {
  interface State {
    count: number;
    user: { name: string; age: number };
  }

  let store: Store<State>;

  beforeEach(() => {
    store = new Store<State>({
      count: 0,
      user: { name: "Alice", age: 25 },
    });
  });

  it("should initialize with the given state", () => {
    const initialState = store.getState();
    expect(initialState.count).toBe(0);
    expect(initialState.user.name).toBe("Alice");
    expect(initialState.user.age).toBe(25);
  });

  it("should update the state with setState", () => {
    store.setState({ count: 1 });
    const updatedState = store.getState();
    expect(updatedState.count).toBe(1);
    expect(updatedState.user.name).toBe("Alice");
    expect(updatedState.user.age).toBe(25);

    store.setState({ user: { name: "Bob", age: 30 } });
    const updatedUserState = store.getState();
    expect(updatedUserState.count).toBe(1);
    expect(updatedUserState.user.name).toBe("Bob");
    expect(updatedUserState.user.age).toBe(30);
  });

  it("should notify listeners on state change", () => {
    const listener: Listener<State> = jest.fn();
    store.subscribe(listener);

    store.setState({ count: 2 });
    expect(listener).toHaveBeenCalledWith({
      count: 2,
      user: { name: "Alice", age: 25 },
    });

    store.setState({ user: { name: "Charlie", age: 35 } });
    expect(listener).toHaveBeenCalledWith({
      count: 2,
      user: { name: "Charlie", age: 35 },
    });
  });

  it("should allow listeners to unsubscribe", () => {
    const listener: Listener<State> = jest.fn();
    const unsubscribe = store.subscribe(listener);

    store.setState({ count: 3 });
    expect(listener).toHaveBeenCalledWith({
      count: 3,
      user: { name: "Alice", age: 25 },
    });

    unsubscribe();
    store.setState({ count: 4 });
    expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it("should handle multiple listeners", () => {
    const listener1: Listener<State> = jest.fn();
    const listener2: Listener<State> = jest.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.setState({ count: 5 });
    expect(listener1).toHaveBeenCalledWith({
      count: 5,
      user: { name: "Alice", age: 25 },
    });
    expect(listener2).toHaveBeenCalledWith({
      count: 5,
      user: { name: "Alice", age: 25 },
    });

    store.setState({ user: { name: "Dave", age: 40 } });
    expect(listener1).toHaveBeenCalledWith({
      count: 5,
      user: { name: "Dave", age: 40 },
    });
    expect(listener2).toHaveBeenCalledWith({
      count: 5,
      user: { name: "Dave", age: 40 },
    });
  });

  it("should not notify unsubscribed listeners", () => {
    const listener1: Listener<State> = jest.fn();
    const listener2: Listener<State> = jest.fn();

    const unsubscribe1 = store.subscribe(listener1);
    store.subscribe(listener2);

    store.setState({ count: 6 });
    expect(listener1).toHaveBeenCalledWith({
      count: 6,
      user: { name: "Alice", age: 25 },
    });
    expect(listener2).toHaveBeenCalledWith({
      count: 6,
      user: { name: "Alice", age: 25 },
    });

    unsubscribe1();
    store.setState({ count: 7 });
    expect(listener1).toHaveBeenCalledTimes(1); // Should not be called again
    expect(listener2).toHaveBeenCalledWith({
      count: 7,
      user: { name: "Alice", age: 25 },
    });
  });
});
