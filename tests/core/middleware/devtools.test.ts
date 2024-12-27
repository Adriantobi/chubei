import { devtools } from "../../../src/core/middleware/devtools";
import { createStore } from "../../../src/vanilla";
import { Store } from "../../../src/core/store";

describe("devtools middleware", () => {
  const useComplexStore = createStore<{
    users: { id: number; name: string }[];
    activeUserId: number | null;
    settings: { theme: string; notifications: boolean };
    setUsers: (users: { id: number; name: string }[]) => void;
    setActiveUserId: (id: number | null) => void;
    setSettings: (settings: { theme: string; notifications: boolean }) => void;
  }>(
    devtools(
      (set) => ({
        users: [],
        activeUserId: null,
        settings: { theme: "light", notifications: true },
        setUsers: (users) => set({ users }),
        setActiveUserId: (id) => set({ activeUserId: id }),
        setSettings: (settings) => set({ settings }),
      }),
      {
        name: "ComplexStore",
        anonymousActionType: "UPDATE_STATE",
        serialize: true,
        enabled: true,
        trace: true,
        traceLimit: 5,
      },
    ),
  );

  const store = useComplexStore as Store<{
    users: { id: number; name: string }[];
    activeUserId: number | null;
    settings: { theme: string; notifications: boolean };
    setUsers: (users: { id: number; name: string }[]) => void;
    setActiveUserId: (id: number | null) => void;
    setSettings: (settings: { theme: string; notifications: boolean }) => void;
  }>;

  beforeEach(() => {
    // Reset the store state before each test
    store.setState({
      users: [],
      activeUserId: null,
      settings: { theme: "light", notifications: true },
    });
  });

  it("should log state updates when trace is enabled", () => {
    const consoleGroupCollapsedSpy = jest
      .spyOn(console, "groupCollapsed")
      .mockImplementation();
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(console, "groupEnd")
      .mockImplementation();

    // Perform a state update
    store.getState().setUsers([{ id: 1, name: "Alice" }]);

    expect(consoleGroupCollapsedSpy).toHaveBeenCalledWith(
      "%cComplexStore - Action: UPDATE_STATE",
      "color: #ff6347",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "New State:",
      JSON.stringify({
        users: [{ id: 1, name: "Alice" }],
        activeUserId: null,
        settings: { theme: "light", notifications: true },
      }),
    );
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    consoleGroupCollapsedSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });

  it("should handle optional serialization", () => {
    store.setState({
      settings: { theme: "dark", notifications: false },
    });

    const serializedState = JSON.stringify(store.getState());
    expect(serializedState).toContain("dark");
    expect(serializedState).toContain("false");
  });

  it("should not log state updates when disabled", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    store.setState({
      settings: { theme: "dark", notifications: false },
    });

    expect(consoleLogSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
