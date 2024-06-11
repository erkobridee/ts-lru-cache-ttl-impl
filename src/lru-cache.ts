/**
 * A Least Recently Used (LRU) cache with Time-to-Live (TTL) support. Items are kept in the cache until they either
 * reach their TTL or the cache reaches its size and/or item limit. When the limit is exceeded, the cache evicts the
 * item that was least recently accessed (based on the timestamp of access). Items are also automatically evicted if they
 * are expired, as determined by the TTL.
 *
 * An item is considered accessed, and its last accessed timestamp is updated, whenever `has`, `get`, or `set` is called with its key.
 *
 * See the lru-cache.test.ts to check the behavior.
 */

interface LRUCacheProviderOptions {
  ttl: number; // Time to live in milliseconds
  itemLimit: number;
}

interface LRUCacheProvider<T> {
  has: (key: string) => boolean;
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
}

interface LRUCachedItem<T> {
  value: T;
  ttl: number;
}

//----------------------------------------------------------------------------//

export function createLRUCacheProvider<T>({ ttl, itemLimit }: LRUCacheProviderOptions): LRUCacheProvider<T> {
  const cache = new Map<string, LRUCachedItem<T>>();

  /**
   * store the key,value setting the ttl for the LRU cached item
   *
   * @param {string} key
   * @param {T} value
   */
  const store = (key: string, value: T) => {
    cache.set(key, {
      value,
      ttl: Date.now() + ttl,
    });
  };

  /**
   * Implemented as a LRU cache logic considering the items limit size.
   * In case of storing a item that already exists, it will renew its TTL time.
   *
   * @param {string} key
   * @param {T} value
   */
  const set = (key: string, value: T) => {
    if (cache.size >= itemLimit) {
      const [firstKey] = cache.keys();
      cache.delete(firstKey);
    }

    store(key, value);
  };

  /**
   * Retrieves the stored value by its key.
   * It will return undefined if it's not present or expired.
   * For an existent item, it will renew its TTL time.
   *
   * @param {string} key
   * @returns {T} the stored value
   */
  const get = (key: string) => {
    const item = cache.get(key);
    if (item !== undefined) {
      cache.delete(key);
      const { value, ttl } = item;
      if (Date.now() > ttl) return undefined;
      store(key, value);
      return value;
    }

    return undefined;
  };

  /**
   * Check if a given key exists in the cache and also consider its TTL.
   * For an existent item, with a TTL valid it will renew its TTL value.
   *
   * @param {string} key
   * @returns {boolean} true if the key exists
   */
  const has = (key: string) => {
    return get(key) !== undefined;
  };

  return {
    has,
    get,
    set,
  };
}
