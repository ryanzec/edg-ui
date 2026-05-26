import { logManager } from './log-manager';

/** the shape of data stored in local storage with optional expiration support */
export type LocalStorageCacheData = {
  // any is being used as we do want to be able to store any kind of data here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  expires: number | null;
};

class LocalStorageManager {
  /** retrieves a typed value from local storage, returning undefined if missing or expired */
  public get<T = unknown>(key: string | undefined): T | undefined {
    if (!key) {
      return;
    }

    const now = new Date().getTime();
    const rawData = localStorage.getItem(key);

    if (!rawData) {
      return;
    }

    try {
      const storedData = JSON.parse(rawData);

      if (storedData?.expires !== null && storedData.expires <= now) {
        localStorage.removeItem(key);

        return;
      }

      if (storedData) {
        return storedData.value;
      }
    } catch (error: unknown) {
      logManager.error({
        type: 'local-storage-manager-error',
        message: 'a value was stored in localStorage but it was invalid JSON',
        error,
      });

      // since there is nothing else we can do, we just log and remove the invalid data
      localStorage.removeItem(key);

      return;
    }

    return;
  }

  /** stores a typed value in local storage with an optional expiration duration in milliseconds */
  public set<T = unknown>(key: string | undefined, value: T, expireIn = 0): void {
    if (!key) {
      return;
    }

    const now = new Date().getTime();

    const data: LocalStorageCacheData = {
      value,
      expires: expireIn > 0 ? now + expireIn : null,
    };

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error: unknown) {
      logManager.error({
        type: 'local-storage-manager-set-data-error',
        message: 'failed to set localStorage item',
        error,
      });
    }
  }

  /** removes a single entry from local storage by key */
  public remove(key: string | undefined): void {
    if (!key) {
      return;
    }

    localStorage.removeItem(key);
  }

  /** clears all entries from local storage */
  public clear(): void {
    localStorage.clear();
  }

  /** returns true if the key exists in local storage and has not expired */
  public has(key: string | undefined): boolean {
    if (!key) {
      return false;
    }

    return this.get(key) !== undefined;
  }

  /** returns all keys currently stored in local storage */
  public getAllKeys(): string[] {
    return Object.keys(localStorage);
  }

  /** returns the number of entries currently stored in local storage */
  public size(): number {
    return localStorage.length;
  }
}

export const localStorageManager = new LocalStorageManager();
