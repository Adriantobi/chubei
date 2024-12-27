import { createStore } from "../src/vanilla";
import { Store } from "../src/core/store";

describe("useFishStore", () => {
  it("should handle complex state changes correctly", () => {
    const useFishStore = createStore<{
      fishes: number;
      addAFish: () => void;
      removeAllFishes: () => void;
      fishCount: () => number;
      fishTypes: string[];
      addFishType: (type: string) => void;
      removeFishType: (type: string) => void;
    }>((set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
      removeAllFishes: () => set({ fishes: 0 }),
      fishCount: () => get().fishes,
      fishTypes: [],
      addFishType: (type: string) =>
        set({ fishTypes: [...get().fishTypes, type] }),
      removeFishType: (type: string) =>
        set({ fishTypes: get().fishTypes.filter((t) => t !== type) }),
    }));

    const store = useFishStore as Store<{
      fishes: number;
      addAFish: () => void;
      removeAllFishes: () => void;
      fishCount: () => number;
      fishTypes: string[];
      addFishType: (type: string) => void;
      removeFishType: (type: string) => void;
    }>;

    // Initial state
    let initialState = store.getState();
    expect(initialState.fishes).toBe(0);
    expect(initialState.fishTypes).toEqual([]);

    // Add a fish
    store.getState().addAFish();
    let afterAddOneFish = store.getState();
    expect(afterAddOneFish.fishes).toBe(1);

    // Add another fish
    store.getState().addAFish();
    let afterAddTwoFish = store.getState();
    expect(afterAddTwoFish.fishes).toBe(2);

    // Add fish types
    store.getState().addFishType("Goldfish");
    store.getState().addFishType("Betta");
    let afterAddFishTypes = store.getState();
    expect(afterAddFishTypes.fishTypes).toEqual(["Goldfish", "Betta"]);

    // Remove a fish type
    store.getState().removeFishType("Goldfish");
    let afterRemoveFishType = store.getState();
    expect(afterRemoveFishType.fishTypes).toEqual(["Betta"]);

    // Remove all fishes
    store.getState().removeAllFishes();
    let afterRemoveAllFishes = store.getState();
    expect(afterRemoveAllFishes.fishes).toBe(0);

    // Check fish count
    let fishCount = store.getState().fishCount();
    expect(fishCount).toBe(0);

    // Log the output of each test case
    console.log({
      initialState: {
        fishes: initialState.fishes,
        fishTypes: initialState.fishTypes,
      },
      afterAddOneFish: {
        fishes: afterAddOneFish.fishes,
        fishTypes: afterAddOneFish.fishTypes,
      },
      afterAddTwoFish: {
        fishes: afterAddTwoFish.fishes,
        fishTypes: afterAddTwoFish.fishTypes,
      },
      afterAddFishTypes: {
        fishes: afterAddFishTypes.fishes,
        fishTypes: afterAddFishTypes.fishTypes,
      },
      afterRemoveFishType: {
        fishes: afterRemoveFishType.fishes,
        fishTypes: afterRemoveFishType.fishTypes,
      },
      afterRemoveAllFishes: {
        fishes: afterRemoveAllFishes.fishes,
        fishTypes: afterRemoveAllFishes.fishTypes,
      },
      fishCount,
    });
  });
});
