import { StorageType, ERROR_CODES } from "../types";
import { ChuBeiError } from "./error";

export class Storage<T> {
  private key: string;
  private storageType: StorageType;

  constructor(key: string, storageType: StorageType = "localStorage") {
    if (!["localStorage", "sessionStorage", "cookies"].includes(storageType)) {
      throw new ChuBeiError(
        "Unsupported storage type",
        ERROR_CODES.UNSUPPORTED_STORAGE_TYPE,
        { storageType },
      );
    }

    this.key = key;
    this.storageType = storageType;
  }

  set(store: T) {
    const storeObj = JSON.stringify(store);

    try {
      switch (this.storageType) {
        case "localStorage":
          localStorage.setItem(this.key, storeObj);
          break;
        case "sessionStorage":
          sessionStorage.setItem(this.key, storeObj);
          break;
        case "cookies":
          this.setCookie(storeObj);
          break;
        default:
          throw new ChuBeiError(
            "Unsupported storage type",
            ERROR_CODES.UNSUPPORTED_STORAGE_TYPE,
            { storageType: this.storageType },
          );
      }
    } catch {
      throw new ChuBeiError(
        "Failed to set state",
        ERROR_CODES.SET_STATE_ERROR,
        { state: store, storageType: this.storageType },
      );
    }
  }

  get(): T | null {
    try {
      switch (this.storageType) {
        case "localStorage":
          return this.getFromLocalStorage();
        case "sessionStorage":
          return this.getFromSessionStorage();
        case "cookies":
          return this.getFromCookies();
        default:
          throw new ChuBeiError(
            "Unsupported storage type",
            ERROR_CODES.UNSUPPORTED_STORAGE_TYPE,
            { storageType: this.storageType },
          );
      }
    } catch {
      throw new ChuBeiError(
        "Failed to get state",
        ERROR_CODES.GET_STATE_ERROR,
        { storageType: this.storageType },
      );
    }
  }

  validate(): boolean {
    try {
      switch (this.storageType) {
        case "localStorage":
          return this.getFromLocalStorage() !== null;
        case "sessionStorage":
          return this.getFromSessionStorage() !== null;
        case "cookies":
          return this.getFromCookies() !== null;
        default:
          throw new ChuBeiError(
            "Unsupported storage type",
            ERROR_CODES.UNSUPPORTED_STORAGE_TYPE,
            { storageType: this.storageType },
          );
      }
    } catch {
      throw new ChuBeiError(
        "Failed to validate state",
        ERROR_CODES.VALIDATE_STATE_ERROR,
        { storageType: this.storageType },
      );
    }
  }

  remove() {
    try {
      switch (this.storageType) {
        case "localStorage":
          localStorage.removeItem(this.key);
          break;
        case "sessionStorage":
          sessionStorage.removeItem(this.key);
          break;
        case "cookies":
          this.removeCookie();
          break;
        default:
          throw new ChuBeiError(
            "Unsupported storage type",
            ERROR_CODES.UNSUPPORTED_STORAGE_TYPE,
            { storageType: this.storageType },
          );
      }
    } catch {
      throw new ChuBeiError(
        "Failed to remove state",
        ERROR_CODES.REMOVE_STATE_ERROR,
        { storageType: this.storageType },
      );
    }
  }

  private getFromLocalStorage(): T | null {
    const storedState = localStorage.getItem(this.key);
    return storedState ? JSON.parse(storedState) : null;
  }

  private getFromSessionStorage(): T | null {
    const storedState = sessionStorage.getItem(this.key);
    return storedState ? JSON.parse(storedState) : null;
  }

  private getFromCookies(): T | null {
    const match = document.cookie?.match(
      new RegExp("(^| )" + this.key + "=([^;]+)"),
    );
    return match ? JSON.parse(match[2]) : null;
  }

  private setCookie(state: string) {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // 1 hour expiration
    document.cookie = `${this.key}=${state}; expires=${expiration.toUTCString()}; path=/`;
  }

  private removeCookie() {
    document.cookie = `${this.key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
