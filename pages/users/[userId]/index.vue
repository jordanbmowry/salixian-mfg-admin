<script setup lang="ts">
import { formatDate } from '~/utils';
import { ApiUserResponse, User, Role } from '~/types/types';

const pageIsLoading = ref(false);
const route = useRoute();
const userData = ref<User>({
  user_id: '',
  email: '',
  role: Role.USER,
  first_name: null,
  last_name: null,
  last_login: '',
  created_at: '',
  updated_at: '',
  notes: null,
});
const isErrorShowing = ref(false);
const userId = route.params.userId;

onMounted(async () => {
  pageIsLoading.value = true;
  try {
    const data = await useFetchWithCache<ApiUserResponse>(`/users/${userId}`);

    userData.value = data.value.data;
  } catch (error) {
    isErrorShowing.value = true;
    console.error('Error fetching the data: ', error);
  } finally {
    pageIsLoading.value = false;
  }
});

const userRoleClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-green-200 text-green-800';
    case 'user':
      return 'bg-blue-200 text-blue-800';
    default:
      return '';
  }
};

const userRoleIcon = (role: string) => {
  return role === 'admin' ? ['fas', 'shield-alt'] : ['fas', 'user'];
};

definePageMeta({
  middleware: ['is-user'],
});
</script>

<template>
  <NotificationToast
    type="error"
    :isVisible="isErrorShowing"
    :dismissible="true"
    @dismiss="() => (isErrorShowing = false)"
    message="Failed to fetch data."
  />

  <TableLoader v-if="pageIsLoading" />
  <main>
    <div class="my-4 sm:ml-16 sm:mt-0 sm:flex-none flex justify-end">
      <NuxtLink
        :to="`/users/${userId}/edit`"
        type="submit"
        class="rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 cursor-pointer"
      >
        Edit user
      </NuxtLink>
    </div>
    <header>
      <div
        class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8"
      >
        <div v-if="userData.first_name && userData.last_name">
          <div class="flex items-center gap-x-3">
            <h1
              class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl break-words"
            >
              {{ userData.first_name }} {{ userData.last_name }}
            </h1>
          </div>
        </div>
        <div v-if="userData.email" class="flex flex-col">
          <h2>Email</h2>
          <address>
            <div
              class="text-lg font-semibold tracking-tight text-stone-500 break-words"
            >
              <NuxtLink
                class="cursor-pointer"
                target="_blank"
                :to="`mailto:${userData.email}`"
                >{{ userData.email }}</NuxtLink
              >
            </div>
          </address>
        </div>
        <div v-if="userData.role" class="flex flex-col">
          <h2>Role</h2>
          <span
            :class="`${userRoleClass(
              userData.role
            )} py-1 px-3 text-xs font-medium rounded-md`"
          >
            <font-awesome-icon
              :icon="userRoleIcon(userData.role)"
              class="mr-2"
            />
            {{ userData.role }}
          </span>
        </div>
      </div>
    </header>

    <!-- Customer details -->
    <section
      class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
    >
      <div
        v-if="userData.last_login"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">Last login</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            class="text-lg font-semibold tracking-tight text-stone-500 break-words"
          >
            {{ formatDate(userData.last_login) }}
          </span>
        </p>
      </div>
      <div
        v-if="userData.updated_at"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">Last updated</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-lg font-semibold tracking-tight text-stone-500">
            {{ formatDate(userData.updated_at) }}
          </span>
        </p>
      </div>
      <div
        v-if="userData.created_at"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">User since</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-lg font-semibold tracking-tight text-stone-500">
            {{ formatDate(userData.created_at) }}</span
          >
        </p>
      </div>
    </section>
    <section
      v-if="userData.notes"
      class="my-4 flex flex-col items-center bg-gray-50 rounded-sm py-4"
    >
      <h2>User Notes</h2>
      <p class="text-base break-words text-stone-500">
        {{ userData.notes }}
      </p>
    </section>
  </main>
</template>
