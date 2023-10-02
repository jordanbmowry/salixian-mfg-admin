<script setup lang="ts">
import { formatDate, formatPhoneNumber } from '~/utils';

interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

const pageIsLoading = ref(false);
const route = useRoute();
const customerId = route.params.customerId;
const currentPage = ref(1);
const pageSize = ref(5);
const customerData = ref({});
const orderData = ref([]);
const paginationData = ref<PaginationData | {}>({});
const isMoreOrdersLoading = ref(false);

const buildUrl = () =>
  `/customers/${customerId}/orders?page=${currentPage.value}&pageSize=${pageSize.value}&sortBy=updated_at&order=desc`;

const url = computed(buildUrl);

const fetchAllData = async () => {
  pageIsLoading.value = true;
  try {
    const data = await useFetchWithCache(url.value);
    // @ts-ignore
    customerData.value = data.value.data?.customer;
    // @ts-ignore
    paginationData.value = data.value?.meta;
    // @ts-ignore
    orderData.value = data.value.data?.orders;
  } catch (error) {
    console.error('Error fetching the data: ', error);
  } finally {
    pageIsLoading.value = false;
  }
};
const fetchOrderData = async () => {
  isMoreOrdersLoading.value = true;

  try {
    const data = await useFetchWithCache(url.value);
    // @ts-ignore
    paginationData.value = data.value?.meta;
    // @ts-ignore
    orderData.value = data.value.data?.orders;
  } catch (error) {
    console.error('Error fetching the data: ', error);
  } finally {
    isMoreOrdersLoading.value = false;
  }
};
onMounted(fetchAllData);
watch(url, fetchOrderData);

const computeStartItem = () => (currentPage.value - 1) * pageSize.value + 1;
const startItem = computed(computeStartItem);

const computeEndItem = () => {
  return paginationData.value
    ? Math.min(
        currentPage.value * pageSize.value,
        // @ts-ignore
        paginationData.value?.totalCount
      )
    : pageSize.value;
};
const endItem = computed(computeEndItem);
// @ts-ignore
const totalItems = computed(() => paginationData.value?.totalCount || 0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const handleUpdateCurrentPage = (newCurrentPage: number) => {
  currentPage.value = newCurrentPage;
};
</script>

<template>
  <TableLoader v-if="pageIsLoading" />
  <main v-else>
    <div class="my-4 sm:ml-16 sm:mt-0 sm:flex-none flex justify-end">
      <NuxtLink
        :to="`/customers/${customerId}/edit`"
        type="submit"
        class="rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
      >
        Edit customer
      </NuxtLink>
    </div>
    <header>
      <!-- Customer full name and address -->
      <div
        class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8"
      >
        <div>
          <div class="flex items-center gap-x-3">
            <h1
              class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl break-words"
            >
              {{ customerData['first_name'] }} {{ customerData['last_name'] }}
            </h1>
          </div>
        </div>
        <div v-if="customerData.billing_address" class="flex flex-col">
          <h2>Billing Address</h2>
          <address>
            <div class="mt-2 text-sm leading-6 text-gray-900 break-words">
              {{ customerData.billing_address }}
            </div>
            <div class="text-sm leading-6 text-gray-900">
              {{ customerData.billing_city }}, {{ customerData.billing_state }}
              {{ customerData.billing_zip }}
            </div>
          </address>
        </div>
        <div v-if="customerData.shipping_address" class="flex flex-col">
          <h2>Shipping Address</h2>
          <address>
            <div class="mt-2 text-sm leading-6 text-gray-900 break-words">
              {{ customerData.shipping_address }}
            </div>
            <div class="text-sm leading-6 text-gray-900">
              {{ customerData.shipping_city }},
              {{ customerData.shipping_state }}
              {{ customerData.shipping_zip }}
            </div>
          </address>
        </div>
      </div>
    </header>

    <!-- Customer details -->
    <section class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <p class="text-sm font-medium leading-6 text-gray-900">Email</p>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            class="text-lg font-semibold tracking-tight text-gray-900 break-words"
          >
            {{ customerData.email }}</span
          >
        </p>
      </div>
      <div
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <p class="text-sm font-medium leading-6 text-gray-900">Phone</p>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-lg font-semibold tracking-tight text-gray-900">{{
            formatPhoneNumber(customerData.phone_number)
          }}</span>
        </p>
      </div>
      <div
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <p class="text-sm font-medium leading-6 text-gray-900">
          Customer since
        </p>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            v-if="customerData.created_at"
            class="text-lg font-semibold tracking-tight text-gray-900"
          >
            {{ formatDate(customerData.created_at) }}</span
          >
        </p>
      </div>
      <div
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <p class="text-sm font-medium leading-6 text-gray-900">Updated at</p>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            v-if="customerData.updated_at"
            class="text-lg font-semibold tracking-tight text-gray-900"
            >{{ formatDate(customerData.updated_at) }}</span
          >
        </p>
      </div>
    </section>

    <section
      v-if="customerData.notes"
      class="my-4 flex flex-col items-center bg-gray-50 rounded-sm py-4"
    >
      <h2>Customer Notes</h2>
      <p class="text-base break-words">
        {{ customerData.notes }}
      </p>
    </section>

    <!-- Orders -->

    <div class="my-4 sm:ml-16 sm:mt-0 sm:flex-none flex justify-end">
      <NuxtLink
        :to="`/orders/${customerId}/create`"
        type="submit"
        class="rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
      >
        Create order
      </NuxtLink>
    </div>

    <TableLoader v-if="isMoreOrdersLoading" />
    <div v-else-if="orderData.length" class="border-t border-gray-200 pt-11">
      <h2
        class="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8"
      >
        Customer orders
      </h2>
      <table class="mt-6 w-full whitespace-nowrap text-left">
        <colgroup>
          <col class="w-full sm:w-4/12" />
          <col class="lg:w-4/12" />
          <col class="lg:w-2/12" />
          <col class="lg:w-1/12" />
          <col class="lg:w-1/12" />
        </colgroup>
        <thead class="border-b border-gray-200 text-sm leading-6 text-gray-900">
          <tr>
            <th
              scope="col"
              class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Order date
            </th>
            <th
              scope="col"
              class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              Order description
            </th>
            <th
              scope="col"
              class="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              Order status
            </th>
            <th
              scope="col"
              class="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
            >
              Payment status
            </th>
            <th
              scope="col"
              class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
            >
              Customer cost
            </th>
          </tr>
        </thead>
        <tbody v-if="orderData" class="divide-y divide-white/5">
          <tr v-for="order in orderData" :key="order.order_id">
            <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div class="flex items-center gap-x-4">
                <div
                  class="truncate text-sm font-medium leading-6 text-gray-900"
                >
                  {{ order.order_date }}
                </div>
              </div>
            </td>
            <td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div class="flex gap-x-3">
                <div class="font-mono text-sm leading-6 text-gray-900">
                  {{
                    useTruncate(order.order_description, {
                      length: 50,
                      omission: '...',
                    })
                  }}
                </div>
              </div>
            </td>
            <td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div
                class="flex items-center justify-end gap-x-2 sm:justify-start"
              >
                <div class="hidden text-gray-900 sm:block">
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20"
                    :class="{
                      'bg-yellow-300 text-yellow-800':
                        order.order_status === 'pending',
                      'bg-blue-300 text-blue-800':
                        order.order_status === 'in progress',
                      'bg-green-300 text-green-800':
                        order.order_status === 'complete',
                      'bg-red-300 text-red-800':
                        order.order_status === 'canceled',
                    }"
                    >{{ order.order_status }}</span
                  >
                </div>
              </div>
            </td>
            <td
              class="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-900 md:table-cell lg:pr-20"
            >
              {{ order.payment_status }}
            </td>
            <td
              class="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-900 sm:table-cell sm:pr-6 lg:pr-8"
            >
              {{ order.customer_cost }}
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination
        @update:current-page="handleUpdateCurrentPage"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :startItem="startItem"
        :endItem="endItem"
        :totalItems="totalItems"
      />
    </div>
    <section
      v-else
      class="my-4 flex flex-col items-center bg-gray-50 rounded-sm py-4"
    >
      <h3>No orders for customer</h3>
    </section>
  </main>
</template>
