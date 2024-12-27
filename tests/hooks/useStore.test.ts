import { Store } from "../../src/core/store";
import { useStore } from "../../src/hooks/useStore";

describe("useStore", () => {
  interface State {
    spaceship: { name: string; fuel: number };
    crew: { name: string; role: string }[];
    mission: { destination: string; status: string };
  }

  let store: Store<State>;

  beforeEach(() => {
    store = new Store<State>({
      spaceship: { name: "Apollo", fuel: 100 },
      crew: [
        { name: "John", role: "Captain" },
        { name: "Jane", role: "Engineer" },
      ],
      mission: { destination: "Mars", status: "Preparing" },
    });
  });

  it("should initialize with the given state", () => {
    const initialState = store.getState();
    expect(initialState.spaceship.name).toBe("Apollo");
    expect(initialState.spaceship.fuel).toBe(100);
    expect(initialState.crew).toEqual([
      { name: "John", role: "Captain" },
      { name: "Jane", role: "Engineer" },
    ]);
    expect(initialState.mission.destination).toBe("Mars");
    expect(initialState.mission.status).toBe("Preparing");
  });

  it("should notify on state change", () => {
    const onUpdate = jest.fn();
    const unsubscribe = useStore(
      store,
      (state) => state.spaceship.fuel,
      onUpdate,
    );

    store.setState({ spaceship: { name: "Apollo", fuel: 90 } });
    expect(onUpdate).toHaveBeenCalledWith(90);

    store.setState({ spaceship: { name: "Apollo", fuel: 80 } });
    expect(onUpdate).toHaveBeenCalledWith(80);

    unsubscribe();
    store.setState({ spaceship: { name: "Apollo", fuel: 70 } });
    expect(onUpdate).toHaveBeenCalledTimes(2); // Should not be called again
  });

  it("should not notify if selected state does not change", () => {
    const onUpdate = jest.fn();
    const unsubscribe = useStore(
      store,
      (state) => state.spaceship.fuel,
      onUpdate,
    );

    store.setState({ crew: [{ name: "Alice", role: "Pilot" }] });
    expect(onUpdate).not.toHaveBeenCalled();

    unsubscribe();
  });

  it("should handle multiple subscriptions", () => {
    const onUpdate1 = jest.fn();
    const onUpdate2 = jest.fn();

    const unsubscribe1 = useStore(
      store,
      (state) => state.spaceship.fuel,
      onUpdate1,
    );
    const unsubscribe2 = useStore(
      store,
      (state) => state.mission.status,
      onUpdate2,
    );

    store.setState({ spaceship: { name: "Apollo", fuel: 90 } });
    expect(onUpdate1).toHaveBeenCalledWith(90);
    expect(onUpdate2).not.toHaveBeenCalled();

    store.setState({ mission: { destination: "Mars", status: "Launched" } });
    expect(onUpdate1).toHaveBeenCalledTimes(1);
    expect(onUpdate2).toHaveBeenCalledWith("Launched");

    unsubscribe1();
    unsubscribe2();
  });

  it("should unsubscribe correctly", () => {
    const onUpdate = jest.fn();
    const unsubscribe = useStore(
      store,
      (state) => state.spaceship.fuel,
      onUpdate,
    );

    store.setState({ spaceship: { name: "Apollo", fuel: 90 } });
    expect(onUpdate).toHaveBeenCalledWith(90);

    unsubscribe();
    store.setState({ spaceship: { name: "Apollo", fuel: 80 } });
    expect(onUpdate).toHaveBeenCalledTimes(1); // Should not be called again
  });
});
