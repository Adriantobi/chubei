import { StorageType } from "../../src/types";
import { ChuBeiError } from "../../src/utils/error";
import { Storage } from "../../src/utils/storage";

describe("Storage", () => {
  let localStorageMock: Storage<string>;
  let sessionStorageMock: Storage<string>;
  let cookiesStorageMock: Storage<string>;

  beforeEach(() => {
    localStorageMock = new Storage<string>("testKey", "localStorage");
    sessionStorageMock = new Storage<string>("testKey", "sessionStorage");
    cookiesStorageMock = new Storage<string>("testKey", "cookies");

    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "";
  });

  test("should set and get localStorage", async () => {
    localStorageMock.set("testValue");
    const result = localStorageMock.get();
    expect(result).toBe("testValue");
  });

  test("should set and get sessionStorage", async () => {
    sessionStorageMock.set("testValue");
    const result = sessionStorageMock.get();
    expect(result).toBe("testValue");
  });

  test("should set and get cookies", async () => {
    cookiesStorageMock.set("testValue");
    const result = cookiesStorageMock.get();
    expect(result).toBe("testValue");
  });

  test("should validate localStorage", () => {
    localStorageMock.set("testValue");
    const result = localStorageMock.validate();
    expect(result).toBe(true);
  });

  test("should validate sessionStorage", () => {
    sessionStorageMock.set("testValue");
    const result = sessionStorageMock.validate();
    expect(result).toBe(true);
  });

  test("should validate cookies", () => {
    cookiesStorageMock.set("testValue");
    const result = cookiesStorageMock.validate();
    expect(result).toBe(true);
  });

  test("should remove localStorage", () => {
    localStorageMock.set("testValue");
    localStorageMock.remove();
    const result = localStorageMock.validate();
    expect(result).toBe(false);
  });

  test("should remove sessionStorage", () => {
    sessionStorageMock.set("testValue");
    sessionStorageMock.remove();
    const result = sessionStorageMock.validate();
    expect(result).toBe(false);
  });

  test("should remove cookies", () => {
    cookiesStorageMock.set("testValue");
    cookiesStorageMock.remove();
    const result = cookiesStorageMock.validate();
    expect(result).toBe(false);
  });

  test("should throw error for unsupported storage type", () => {
    expect(
      () =>
        new Storage<string>("testKey", "unsupportedStorageType" as StorageType),
    ).toThrow(ChuBeiError);
  });
});
