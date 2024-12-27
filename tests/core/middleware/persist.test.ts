import { persist } from "../../../src/core/middleware/persist";
import { createStore } from "../../../src/vanilla";
import { Store } from "../../../src/core/store";

describe("persist middleware", () => {
  const useUserStore = createStore<{
    name: string;
    age: number;
    email: string;
    setName: (name: string) => void;
    setAge: (age: number) => void;
    setEmail: (email: string) => void;
  }>(
    persist(
      (set) => ({
        name: "",
        age: 0,
        email: "",
        setName: (name: string) => set({ name }),
        setAge: (age: number) => set({ age }),
        setEmail: (email: string) => set({ email }),
      }),
      { key: "userStore", storageType: "localStorage" },
    ),
  );

  const store = useUserStore as Store<{
    name: string;
    age: number;
    email: string;
    setName: (name: string) => void;
    setAge: (age: number) => void;
    setEmail: (email: string) => void;
  }>;

  beforeEach(() => {
    localStorage.clear();
  });

  it("should persist and retrieve state", () => {
    // Initial state
    let initialState = store.getState();
    expect(initialState.name).toBe("");
    expect(initialState.age).toBe(0);
    expect(initialState.email).toBe("");

    // Set user details
    store.getState().setName("John Doe");
    store.getState().setAge(30);
    store.getState().setEmail("john.doe@example.com");

    let updatedState = store.getState();
    expect(updatedState.name).toBe("John Doe");
    expect(updatedState.age).toBe(30);
    expect(updatedState.email).toBe("john.doe@example.com");

    // Check localStorage
    const persistedState = JSON.parse(
      localStorage.getItem("userStore") || "{}",
    );
    expect(persistedState.name).toBe("John Doe");
    expect(persistedState.age).toBe(30);
    expect(persistedState.email).toBe("john.doe@example.com");

    // Retrieve persisted state
    const retrievedState = JSON.parse(
      localStorage.getItem("userStore") || "{}",
    );
    store.getState().setName(retrievedState.name);
    store.getState().setAge(retrievedState.age);
    store.getState().setEmail(retrievedState.email);

    // Clear state
    store.getState().setName("");
    store.getState().setAge(0);
    store.getState().setEmail("");

    let clearedState = store.getState();
    expect(clearedState.name).toBe("");
    expect(clearedState.age).toBe(0);
    expect(clearedState.email).toBe("");

    // Final state
    let finalState = store.getState();
    expect(finalState.name).toBe("");
    expect(finalState.age).toBe(0);
    expect(finalState.email).toBe("");

    console.log({
      initialState,
      updatedState,
      persistedState,
      retrievedState,
      clearedState,
      finalState,
    });
  });
});
