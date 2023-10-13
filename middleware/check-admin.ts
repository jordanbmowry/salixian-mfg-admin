import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();
  console.log(userStore.role);

  if (userStore.role !== 'admin') {
    return abortNavigation();
  }
});
