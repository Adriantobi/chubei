import { Store } from "../../src/core/store";
import { subscribeToStore } from "../../src/utils/subscription";

describe("subscribeToStore", () => {
  interface State {
    user: { name: string; age: number };
    settings: { theme: string; notifications: boolean };
    cart: { items: { id: number; name: string; price: number }[] };
  }

  let store: Store<State>;

  beforeEach(() => {
    store = new Store<State>({
      user: { name: "Alice", age: 25 },
      settings: { theme: "light", notifications: true },
      cart: { items: [] },
    });
  });

  it("should initialize with the given state", () => {
    const initialState = store.getState();
    expect(initialState.user.name).toBe("Alice");
    expect(initialState.user.age).toBe(25);
    expect(initialState.settings.theme).toBe("light");
    expect(initialState.settings.notifications).toBe(true);
    expect(initialState.cart.items).toEqual([]);
  });

  it("should notify on state change", () => {
    const onChange = jest.fn();
    const unsubscribe = subscribeToStore(
      store,
      (state) => state.user.name,
      onChange,
    );

    store.setState({ user: { name: "Bob", age: 30 } });
    expect(onChange).toHaveBeenCalledWith("Bob");

    store.setState({ user: { name: "Charlie", age: 35 } });
    expect(onChange).toHaveBeenCalledWith("Charlie");

    unsubscribe();
    store.setState({ user: { name: "Dave", age: 40 } });
    expect(onChange).toHaveBeenCalledTimes(2); // Should not be called again
  });

  it("should not notify if selected state does not change", () => {
    const onChange = jest.fn();
    const unsubscribe = subscribeToStore(
      store,
      (state) => state.user.name,
      onChange,
    );

    store.setState({ settings: { theme: "dark", notifications: false } });
    expect(onChange).not.toHaveBeenCalled();

    unsubscribe();
  });

  it("should handle multiple subscriptions", () => {
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    const unsubscribe1 = subscribeToStore(
      store,
      (state) => state.user.name,
      onChange1,
    );
    const unsubscribe2 = subscribeToStore(
      store,
      (state) => state.settings.theme,
      onChange2,
    );

    store.setState({ user: { name: "Charlie", age: 35 } });
    expect(onChange1).toHaveBeenCalledWith("Charlie");
    expect(onChange2).not.toHaveBeenCalled();

    store.setState({ settings: { theme: "dark", notifications: true } });
    expect(onChange1).toHaveBeenCalledTimes(1);
    expect(onChange2).toHaveBeenCalledWith("dark");

    unsubscribe1();
    unsubscribe2();
  });

  it("should unsubscribe correctly", () => {
    const onChange = jest.fn();
    const unsubscribe = subscribeToStore(
      store,
      (state) => state.user.name,
      onChange,
    );

    store.setState({ user: { name: "Bob", age: 30 } });
    expect(onChange).toHaveBeenCalledWith("Bob");

    unsubscribe();
    store.setState({ user: { name: "Charlie", age: 35 } });
    expect(onChange).toHaveBeenCalledTimes(1); // Should not be called again
  });
});
