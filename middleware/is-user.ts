import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (userStore.role !== 'admin' && userStore.user_id !== to.params.userId) {
    return abortNavigation();
  }
});
