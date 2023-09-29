import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin(async (nuxt) => {
  const baseURL = useRuntimeConfig().public.baseURL;
  const userStore = useUserStore(nuxt.$pinia);

  addRouteMiddleware(
    'store-user-auth',
    async (to, from) => {
      const router = useRouter();

      const { data } = await useFetch(`${baseURL}/users/auth/status`, {
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
      });

      const isAuthenticated = data.value?.data?.isAuthenticated;

      if (!isAuthenticated && to.path !== '/login') {
        return router.push('/login');
      }

      if (isAuthenticated) {
        if (to.path === '/login') {
          return router.push('/');
        }
        if (userStore.user_id) return;
        userStore.$state = data.value?.data;
      }
    },
    { global: true }
  );
});
