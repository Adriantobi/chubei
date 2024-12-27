# Chǔbèi (储备) - A Lightweight State Machine Inspired by Zustand

## 🌟 Overview

Chǔbèi (储备) is a modern, lightweight state management library designed to bring simplicity and power to your JavaScript or React applications. Inspired by Zustand, it offers a minimal API for managing your application state while giving you full control over your app's logic. Whether you're building a small app or a complex state machine, Chǔbèi will help you streamline state management without the bloat.

## 🚀 Features

- **Inspired by Zustand**: A minimal API with a focus on simplicity.
- **TypeScript Support**: Fully typed for safer and more predictable state management.
- **React Integration**: Seamlessly integrates with React for managing state in your components.
- **State Machine**: Chǔbèi makes it easy to handle finite states and transitions.
- **No Boilerplate**: Forget about reducers and action creators—just define your state logic directly.

---

## 📦 Installation

To install `Chǔbèi`, simply use npm or yarn:

```bash
npm install chubei
```

or

```bash
yarn add chubei
```

---

## 🧑‍💻 Usage

Chǔbèi's API is inspired by Zustand, making it intuitive and straightforward. Here's how to get started:

### 1\. Create a Store

To create a store, just pass a store creator function that defines your state and actions.

```typescript
import { createStore } from "chubei";
const useFishStore = createStore<{
  fishes: number;
  addAFish: () => void;
  removeAllFishes: () => void;
  fishTypes: string[];
  addFishType: (type: string) => void;
  removeFishType: (type: string) => void;
}>((set, get) => ({
  fishes: 0,
  addAFish: () => set({ fishes: get().fishes + 1 }),
  removeAllFishes: () => set({ fishes: 0 }),
  fishTypes: [],
  addFishType: (type: string) => set({ fishTypes: [...get().fishTypes, type] }),
  removeFishType: (type: string) =>
    set({ fishTypes: get().fishTypes.filter((t) => t !== type) }),
}));

// Access state and actions
let state = store.getState();
state.addFishType("salmon");
```

### 2\. React Hook Usage

In a React component, you can simply use the `useFishStore` hook to interact with your store.

```jsx
import React from "react";
import { useFishStore } from "./path/to/store";
const FishComponent = () => {
  const { fishes, addAFish, removeAllFishes } = useFishStore();
  return (
    <div>
      <h1>Fish Count: {fishes}</h1>
      <button onClick={addAFish}>Add a Fish</button>
      <button onClick={removeAllFishes}>Remove All Fishes</button>
    </div>
  );
};
export default FishComponent;
```

### 3\. State Transitions

You can easily define state transitions and conditions based on your app's logic:

```typescript
const useStateMachine = create<{
  currentState: "idle" | "loading" | "done";
  transitionToLoading: () => void;
  transitionToDone: () => void;
}>((set) => ({
  currentState: "idle",
  transitionToLoading: () => set({ currentState: "loading" }),
  transitionToDone: () => set({ currentState: "done" }),
}));

// Usage
const { currentState, transitionToLoading, transitionToDone } =
  useStateMachine();
console.log(currentState); // 'idle'
transitionToLoading();
console.log(currentState); // 'loading'
transitionToDone();
console.log(currentState); // 'done'
```

---

## 🛠️ API

### `create(storeCreator: StoreCreator)`

Creates a new store. The `storeCreator` function takes `set` and `get` functions to define the state and actions.

- `set`: Used to update the state.
- `get`: Retrieves the current state.

### Example storeCreator:

```typescript
create<{
  fishes: number;
  addAFish: () => void;
  removeAllFishes: () => void;
}>((set, get) => ({
  fishes: 0,
  addAFish: () => set({ fishes: get().fishes + 1 }),
  removeAllFishes: () => set({ fishes: 0 }),
}));
```

### `useStore()`

This hook gives you access to your state and actions in a React component.

### `useSelector()`

`useSelector` is a custom hook that allows you to select and subscribe to a specific piece of state in the store. This is helpful when you want to avoid re-rendering the entire component but need access to a specific state value.

---

## 🧩 Middlewares

Chǔbèi supports middlewares to extend functionality and provide features like logging, persistence, and devtools integration. You can easily apply these middlewares to your store for more robust state management.

### 1\. **DevTools Middleware**

Chǔbèi includes a devtools middleware for debugging your state changes. This middleware logs state changes to the console, optionally serializes the state, and tracks action history.

```typescript
import { devtools } from "chubei";
const useStore = create(
  devtools((set, get) => ({
    state: 0,
    increment: () => set({ state: get().state + 1 }),
  })),
);
```

#### Options:

- `name`: Name of the store for identification in the DevTools.
- `anonymousActionType`: The action type for state updates.
- `serialize`: Whether to serialize the state before logging.
- `enabled`: Enable/disable DevTools logging.
- `trace`: Enables action tracing.
- `traceLimit`: Limits the number of actions stored for tracing.

### 2\. **Logger Middleware**

The logger middleware adds console logging functionality for state updates. You can customize whether you want to display the timestamp, duration, and apply color coding.

```typescript
import { logger } from "chubei";
const useStore = create(
  logger((set, get) => ({
    state: 0,
    increment: () => set({ state: get().state + 1 }),
  })),
);
```

#### Options:

- `collapsed`: Whether the log should be collapsed.
- `timestamp`: Whether to log the timestamp.
- `duration`: Whether to log the duration of state updates.
- `colors`: Whether to use colored output in the console.

### 3\. **Persistence Middleware**

Chǔbèi's persistence middleware allows you to persist state to localStorage, sessionStorage, or custom storage. This ensures that state is saved across page reloads.

```typescript
import { persist } from "chubei";
const useStore = create(
  persist(
    (set, get) => ({
      state: 0,
      increment: () => set({ state: get().state + 1 }),
    }),
    { key: "myStore", storageType: "localStorage" },
  ),
);
```

#### Options:

- `key`: The key under which the state is stored.
- `storageType`: The type of storage (`localStorage`, `sessionStorage`, or a custom implementation).

---

## 🧩 Why Chǔbèi?

- **Minimalistic**: Just like Zustand, Chǔbèi focuses on simplicity—no more complicated boilerplate.
- **TypeScript**: Fully typed for a smooth developer experience and predictable state management.
- **React-Friendly**: Integrates seamlessly with React components.
- **State Machine Logic**: Easily define finite states and transitions in your app.
- **Middleware Support**: Add logging, persistence, and devtools integration to your state management.

---

## ⚡ Performance

Chǔbèi is built with performance in mind. The state updates are efficient and ensure minimal re-renders in React. It’s a perfect fit for modern web applications where performance is critical.

---

## 🐛 Error Handling

Chǔbèi includes robust error handling, ensuring that you’ll be notified of any issues. If something’s wrong, the library will throw a descriptive error to make debugging easier.

---

## 📝 License

Chǔbèi is open-source and available under the MIT License.

---

## 🔄 Contributing

We welcome contributions! If you find a bug or have an idea for a new feature, feel free to fork the repo, make your changes, and submit a pull request.

---

## 📦 Chǔbèi in Action

If you're ready to explore Chǔbèi in your projects, clone the repo, install the dependencies, and start building your state machine with ease.
