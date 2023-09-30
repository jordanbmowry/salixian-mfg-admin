import { useSessionStorage } from '@vueuse/core';

export function invalidateCache(url: string) {
  const cache = useSessionStorage(url, null);
  cache.value = null; // This will remove the cached value for the given URL.
}
