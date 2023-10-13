import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();

  if (userStore.role !== 'admin') {
    return abortNavigation();
  }
});
