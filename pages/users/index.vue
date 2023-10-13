<script setup lang="ts">
import { useUserStore } from '~/stores/userStore';
import { User } from '~/stores/userStore';
import { formatDate } from '~/utils';

const usersData = ref([]);

async function navigateToUser(user_id: string) {
  await navigateTo(`/users/${user_id}`);
}

async function fetchData(url: string) {
  try {
    const data = await useFetchWithCache<{ data: Partial<User>[] }>(url);

    usersData.value = data.value.data;
  } catch (error) {
    console.error('Error fetching the data: ', error);
  }
}

onMounted(() => {
  fetchData(`/users`);
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
  middleware: ['check-admin'],
});
</script>

<template>
  <main>
    <h1 class="font-semibold leading-6 text-4xl pb-10">Users</h1>
    <div v-if="usersData.length" class="px-4 sm:px-6 lg:px-8">
      <div class="mt-4 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 sm:pl-6"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Last login
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      User since
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody
                  v-if="usersData.length"
                  class="divide-y divide-gray-200 bg-white"
                >
                  <tr
                    v-for="user in usersData"
                    :key="user.user_id"
                    class="cursor-pointer"
                    @click="() => navigateToUser(user.user_id)"
                  >
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      {{ user.email }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4">
                      <span
                        :class="`${userRoleClass(
                          user.role
                        )} py-1 px-3 text-xs font-medium rounded-md`"
                      >
                        <font-awesome-icon
                          :icon="userRoleIcon(user.role)"
                          class="mr-2"
                        />
                        {{ user.role }}
                      </span>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ formatDate(user.last_login) }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ formatDate(user.created_at) }}
                    </td>

                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <NuxtLink :to="`/users/${user.user_id}/edit`"
                        ><font-awesome-icon
                          size="2x"
                          class="text-stone-600 hover:text-stone-900"
                          :icon="['fas', 'pen-to-square']"
                        /><span class="sr-only">
                          user: {{ user.user_id }}</span
                        ></NuxtLink
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TableLoader v-else />
  </main>
</template>

<style scoped>
tr.cursor-pointer:hover {
  transform: scale(1.01);
  transition: all 0.6s;
}
</style>
