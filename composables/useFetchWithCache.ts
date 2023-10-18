import { StorageSerializers } from '@vueuse/core';

const baseUrl = useRuntimeConfig().public.baseURL;

export default async <T>(url: string) => {
  const cacheKey = `${baseUrl}${url}`;

  const cached = useSessionStorage<T>(cacheKey, null, {
    serializer: StorageSerializers.object,
  });

  if (!cached.value) {
    const { data, error } = await useFetch<T>(cacheKey, {
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    });

    if (error.value || !data.value) {
      const errorMessage = `Could not fetch data from ${cacheKey}`;
      if (error.value) {
        throw createError({
          ...error.value,
          statusMessage: errorMessage,
        });
      } else {
        throw new Error(errorMessage);
      }
    }

    cached.value = data.value as T;
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`Getting value from cache for ${cacheKey}`);
  }

  return cached;
};
