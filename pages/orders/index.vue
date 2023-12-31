<template>
  <main>
    <h1 class="font-semibold leading-6 text-4xl pb-10">Orders</h1>
    <div v-if="!isLoading" class="px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:justify-between gap-4">
        <DatePicker
          class="max-w-sm self-end mx-auto 2xl:mx-0"
          type="date"
          v-model="selectedDates"
          range
        />

        <form class="grow" @submit="debounceOnSubmit">
          <div class="flex flex-col items-center">
            <Listbox as="div" v-model="selected" class="w-full">
              <div class="relative">
                <ListboxButton
                  class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-stone-600 text-xs sm:text-sm"
                >
                  <span class="block truncate">{{ selected.name }}</span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <ChevronUpDownIcon
                      class="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <ListboxOption
                      as="template"
                      v-for="search in searchBy"
                      :key="search.id"
                      :value="search"
                      v-slot="{ active, selected }"
                    >
                      <li
                        :class="[
                          active ? 'bg-stone-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        ]"
                      >
                        <span
                          :class="[
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          ]"
                          >{{ search.name }}</span
                        >

                        <span
                          v-if="selected"
                          :class="[
                            active ? 'text-white' : 'text-stone-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                          ]"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
            <div class="w-full">
              <label for="search" class="sr-only">Search</label>
              <div class="relative w-full self-end">
                <div
                  class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                >
                  <font-awesome-icon
                    class="h-5 w-5 text-gray-400"
                    :icon="['fas', 'magnifying-glass']"
                  />
                </div>
                <input
                  id="search"
                  name="search"
                  class="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                  :placeholder="`${selected.name}`"
                  type="search"
                  v-model="search"
                  @input="debounceOnSubmit"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

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
                      Customer
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Order Date
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Order Status
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Payment Status
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody
                  v-if="orders.length"
                  class="divide-y divide-gray-200 bg-white"
                >
                  <tr
                    v-for="order in orders"
                    :key="order.order_id"
                    class="cursor-pointer"
                    @click="
                      () => navigateToOrder(order?.order_id!, order.customer_id!)
                    "
                  >
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      <address class="flex flex-col justify-center gap-2">
                        <div class="font-semibold">
                          {{
                            createFullName(order?.first_name, order?.last_name)
                          }}
                        </div>
                        <div class="text-gray-500">
                          {{ formatPhoneNumber(order?.phone_number) }}
                        </div>
                        <div class="text-gray-500">
                          {{ order?.email }}
                        </div>
                      </address>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ formatDate(order?.order_date) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4">
                      <span
                        :class="orderStatusClass(order?.order_status)"
                        class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20 rounded-md"
                      >
                        {{ order.order_status }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4">
                      <span
                        :class="paymentStatusClass(order?.payment_status)"
                        class="py-1 px-3 text-xs font-medium text-gray-900 rounded-md"
                      >
                        {{ order.payment_status }}
                      </span>
                    </td>
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <NuxtLink :to="`/orders/${order.order_id}/edit`"
                        ><font-awesome-icon
                          size="2x"
                          class="text-stone-600 hover:text-stone-900"
                          :icon="['fas', 'pen-to-square']"
                        /><span class="sr-only">
                          order: {{ order.order_id }}</span
                        ></NuxtLink
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Pagination
              @update:current-page="handleUpdateCurrentPage"
              :currentPage="currentPage"
              :totalPages="totalPages"
              :startItem="startItem"
              :endItem="endItem"
              :totalItems="totalItems"
            />
          </div>
        </div>
      </div>
    </div>
    <TableLoader v-else />
  </main>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { formatPhoneNumber, formatDate } from '~/utils';
import type {
  ApiOrdersResponse,
  Meta,
  OrderWithCustomerName,
} from '~/types/types';

const searchBy = [
  { id: 1, name: 'Phone number', value: 'phoneNumber' },
  { id: 2, name: 'Email address', value: 'email' },
  { id: 3, name: 'First name', value: 'firstName' },
  { id: 4, name: 'Last name', value: 'lastName' },
];

const selected = ref(searchBy[0]);

const orders = ref<OrderWithCustomerName[]>([]);
const currentPage = ref(1);
const isLoading = ref(false);
const pageSize = ref(10);
const search = ref('');
const selectedDates = ref([]);
const meta = ref<Meta>({
  currentPage: 0,
  totalPages: 0,
  pageSize: 0,
  totalCount: 0,
});

const buildUrl = () => {
  let url = `/orders/orders-with-customers?page=${currentPage.value}&size=${pageSize.value}&orderBy=updated_at&order=desc`;
  if (search.value) {
    url += `&${selected.value.value}=${search.value}`;
  }

  if (selectedDates.value?.length) {
    url += `&startDate=${selectedDates.value[0]}&endDate=${selectedDates.value[1]}`;
  }

  return url;
};
const url = computed(buildUrl);

const fetchData = async () => {
  try {
    isLoading.value = true;
    const data = await useFetchWithCache<ApiOrdersResponse>(url.value);
    orders.value = data.value.data;
    meta.value = data.value.meta;
  } catch (error) {
    console.error('Error fetching the data: ', error);
  } finally {
    isLoading.value = false;
  }
};

watch(url, fetchData, { immediate: true });

watch([selected, selectedDates], () => {
  search.value = '';
  currentPage.value = 1;
});

const onSubmit = () => {
  currentPage.value = 1;
  fetchData();
};
const debounceOnSubmit = useDebounceFn(onSubmit, 500);

function createFullName(first_name: string, last_name: string) {
  return `${first_name} ${last_name}`;
}

const computeStartItem = () => (currentPage.value - 1) * pageSize.value + 1;
const startItem = computed(computeStartItem);

const computeEndItem = () => {
  return orders.value
    ? Math.min(currentPage.value * pageSize.value, meta.value.totalCount)
    : pageSize.value;
};
const endItem = computed(computeEndItem);
const totalItems = computed(() => meta.value.totalCount || 0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const handleUpdateCurrentPage = (newCurrentPage: number) => {
  currentPage.value = newCurrentPage;
};

const navigateToOrder = async (orderId: string, customerId: string) => {
  await navigateTo(`/orders/${customerId}/${orderId}`);
};

function orderStatusClass(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-300 text-yellow-800 px-2 py-1 rounded';
    case 'in progress':
      return 'bg-blue-300 text-blue-800 px-2 py-1 rounded';
    case 'complete':
      return 'bg-green-300 text-green-800 px-2 py-1 rounded';
    case 'canceled':
      return 'bg-red-300 text-red-800 px-2 py-1 rounded';
    default:
      return '';
  }
}

function paymentStatusClass(status: string) {
  switch (status) {
    case 'not paid':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded';
    case 'partially paid':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded';
    case 'fully paid':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded';
    default:
      return '';
  }
}
</script>

<style scoped>
tr.cursor-pointer:hover {
  transform: scale(1.01);
  transition: all 0.6s;
}
</style>
