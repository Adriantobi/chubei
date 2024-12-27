import { Store } from "../../src/core/store";
import { useSelector } from "../../src/hooks/useSelector";

describe("useSelector", () => {
  interface State {
    pets: { name: string; type: string }[];
    owner: { name: string; age: number };
  }

  let store: Store<State>;

  beforeEach(() => {
    store = new Store<State>({
      pets: [
        { name: "Fluffy", type: "cat" },
        { name: "Rex", type: "dog" },
      ],
      owner: { name: "Alice", age: 30 },
    });
  });

  it("should initialize with the selected state", () => {
    const selectedPets = useSelector(store, (state) => state.pets);
    expect(selectedPets).toEqual([
      { name: "Fluffy", type: "cat" },
      { name: "Rex", type: "dog" },
    ]);

    const selectedOwner = useSelector(store, (state) => state.owner);
    expect(selectedOwner).toEqual({ name: "Alice", age: 30 });
  });

  it("should update the selected state when the store state changes", () => {
    let selectedPets = useSelector(store, (state) => state.pets);
    expect(selectedPets).toEqual([
      { name: "Fluffy", type: "cat" },
      { name: "Rex", type: "dog" },
    ]);

    store.setState({
      pets: [
        { name: "Fluffy", type: "cat" },
        { name: "Rex", type: "dog" },
        { name: "Goldie", type: "fish" },
      ],
    });

    selectedPets = useSelector(store, (state) => state.pets);
    expect(selectedPets).toEqual([
      { name: "Fluffy", type: "cat" },
      { name: "Rex", type: "dog" },
      { name: "Goldie", type: "fish" },
    ]);
  });

  it("should not update the selected state if the relevant part of the store state does not change", () => {
    let selectedOwner = useSelector(store, (state) => state.owner);
    expect(selectedOwner).toEqual({ name: "Alice", age: 30 });

    store.setState({
      pets: [
        { name: "Fluffy", type: "cat" },
        { name: "Rex", type: "dog" },
        { name: "Goldie", type: "fish" },
      ],
    });

    selectedOwner = useSelector(store, (state) => state.owner);
    expect(selectedOwner).toEqual({ name: "Alice", age: 30 });
  });

  it("should handle multiple selectors", () => {
    // First selection
    let selectedPets = useSelector(store, (state) => state.pets);
    let selectedOwner = useSelector(store, (state) => state.owner);

    expect(selectedPets).toEqual([
      { name: "Fluffy", type: "cat" },
      { name: "Rex", type: "dog" },
    ]);
    expect(selectedOwner).toEqual({ name: "Alice", age: 30 });

    // Update store state
    store.setState({
      pets: [
        { name: "Fluffy", type: "cat" },
        { name: "Rex", type: "dog" },
        { name: "Goldie", type: "fish" },
      ],
      owner: { name: "Bob", age: 40 },
    });

    // Re-fetch the selected state after state change
    selectedPets = useSelector(store, (state) => state.pets);
    selectedOwner = useSelector(store, (state) => state.owner);

    expect(selectedPets).toEqual([
      { name: "Fluffy", type: "cat" },
      { name: "Rex", type: "dog" },
      { name: "Goldie", type: "fish" },
    ]);
    expect(selectedOwner).toEqual({ name: "Bob", age: 40 });
  });
});
