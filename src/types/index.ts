import { Store } from "../core/store";

export type StorageType = "localStorage" | "sessionStorage" | "cookies";
export enum ERROR_CODES {
  SET_STATE_ERROR = "SET_STATE_ERROR",
  SEND_EVENT_ERROR = "SEND_EVENT_ERROR",
  LOAD_STATE_ERROR = "LOAD_STATE_ERROR",
  SAVE_STATE_ERROR = "SAVE_STATE_ERROR",
  UNSUPPORTED_STORAGE_TYPE = "UNSUPPORTED_STORAGE_TYPE",
  GET_STATE_ERROR = "GET_STATE_ERROR",
  VALIDATE_STATE_ERROR = "VALIDATE_STATE_ERROR",
  REMOVE_STATE_ERROR = "REMOVE_STATE_ERROR",
  PERSIST_LOAD_ERROR = "PERSIST_LOAD_ERROR",
  PERSIST_SAVE_ERROR = "PERSIST_SAVE_ERROR",
  OPTIONS_REQUIRED = "OPTIONS_REQUIRED",
  STORE_CREATOR_REQUIRED = "STORE_CREATOR_REQUIRED",
}

export type State = Record<string | number | symbol, any>;
export type SetState<T> = (
  newState: Partial<T> | ((state: T) => Partial<T>),
) => void;
export type GetState<T> = () => T;
export type StoreCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

export type Listener<T> = (state: T) => void;
export type Middleware<O = MiddlewareOptions> = <T>(
  store: StoreCreator<T>,
  options: O,
) => StoreCreator<T>;

export type MiddlewareOptions =
  | DevtoolsOptions
  | PersistOptions
  | LoggerOptions;
export type DevtoolsOptions = {
  name?: string;
  anonymousActionType?: string;
  serialize?: boolean;
  enabled?: boolean;
  trace?: boolean;
  traceLimit?: number;
};
export type PersistOptions = {
  key: string;
  storageType: StorageType;
};
export type LoggerOptions = {
  collapsed?: boolean;
  duration?: boolean;
  timestamp?: boolean;
  colors?: boolean;
  logTrace?: boolean;
};

export type CreatorFunction = <T extends Record<string, any>>(
  storeCreator: StoreCreator<T>,
) => Store<T>;
