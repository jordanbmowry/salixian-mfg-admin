<script setup lang="ts">
import {
  formatDate,
  formatPhoneNumber,
  stripDashesFromPhoneNumber,
  orderStatusClass,
  paymentStatusClass,
} from '~/utils';

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
const isErrorShowing = ref(false);

const buildUrl = () =>
  `/customers/${customerId}/orders?page=${currentPage.value}&pageSize=${pageSize.value}&orderBy=updated_at&order=desc`;

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
    isErrorShowing.value = true;
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
    isErrorShowing.value = true;
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
  <NotificationToast
    type="error"
    :isVisible="isErrorShowing"
    :dismissible="true"
    @dismiss="() => (isErrorShowing = false)"
    message="Failed to fetch data."
  />

  <TableLoader v-if="pageIsLoading" />
  <main v-else>
    <div class="my-4 sm:ml-16 sm:mt-0 sm:flex-none flex justify-end">
      <NuxtLink
        :to="`/customers/${customerId}/edit`"
        type="submit"
        class="rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 cursor-pointer"
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
            <div
              class="text-lg font-semibold tracking-tight text-stone-500 break-words"
            >
              {{ customerData.billing_address }}
            </div>
            <div
              class="text-lg font-semibold tracking-tight text-stone-500 break-words"
            >
              {{ customerData.billing_city }}, {{ customerData.billing_state }}
              {{ customerData.billing_zip }}
            </div>
          </address>
        </div>
        <div v-if="customerData.shipping_address" class="flex flex-col">
          <h2>Shipping Address</h2>
          <address>
            <div
              class="text-lg font-semibold tracking-tight text-stone-500 break-words"
            >
              {{ customerData.shipping_address }}
            </div>
            <div
              class="text-lg font-semibold tracking-tight text-stone-500 break-words"
            >
              {{ customerData.shipping_city }},
              {{ customerData.shipping_state }}
              {{ customerData.shipping_zip }}
            </div>
          </address>
        </div>
      </div>
    </header>

    <!-- Customer details -->
    <section
      class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
    >
      <div
        v-if="customerData.email"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">Email</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            class="text-lg font-semibold tracking-tight text-stone-500 break-words"
          >
            <NuxtLink
              class="cursor-pointer"
              target="_blank"
              :to="`mailto:${customerData.email}`"
              >{{ customerData.email }}</NuxtLink
            ></span
          >
        </p>
      </div>
      <div
        v-if="customerData.phone_number"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">Phone</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-lg font-semibold tracking-tight text-stone-500">
            <NuxtLink
              class="cursor-pointer"
              target="_blank"
              :to="`tel:${stripDashesFromPhoneNumber(
                customerData.phone_number
              )}`"
            >
              {{ formatPhoneNumber(customerData.phone_number) }}</NuxtLink
            ></span
          >
        </p>
      </div>
      <div
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">Customer since</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            v-if="customerData.created_at"
            class="text-lg font-semibold tracking-tight text-stone-500"
          >
            {{ formatDate(customerData.created_at) }}</span
          >
        </p>
      </div>
      <div
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="leading-6 text-gray-900">Updated at</h2>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span
            v-if="customerData.updated_at"
            class="text-lg font-semibold tracking-tight text-stone-500"
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
      <p class="text-base break-words text-stone-500">
        {{ customerData.notes }}
      </p>
    </section>

    <!-- Orders -->

    <div class="my-4 sm:ml-16 sm:flex-none flex justify-end">
      <NuxtLink
        :to="`/orders/${customerId}/create`"
        type="submit"
        class="rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 cursor-pointer"
      >
        Create order
      </NuxtLink>
    </div>

    <TableLoader v-if="isMoreOrdersLoading" />

    <div v-else-if="orderData.length" class="border-t border-gray-200 pt-11">
      <div class="border-b border-stone-200 bg-white px-4 py-5 sm:px-6">
        <h3
          class="text-base font-extrabold leading-6 text-stone-900 drop-shadow-md"
        >
          Customer order history
        </h3>
      </div>

      <!-- Mobile view -->
      <div class="lg:hidden px-4 py-6">
        <div
          v-for="order in orderData"
          :key="order.order_id"
          class="border rounded-lg my-4 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
          @click="
            async () =>
              await navigateTo(`/orders/${customerId}/${order.order_id}`)
          "
        >
          <!-- Order Description -->
          <div class="mb-4">
            <h3 class="text-base font-medium text-gray-800 mb-2">
              Order Description
            </h3>
            <p class="text-sm text-gray-600">
              {{ order.order_description }}
            </p>
          </div>

          <!-- Order Status -->
          <div class="mb-4">
            <h4 class="text-base font-medium text-gray-700 mb-2">
              Order Status
            </h4>
            <span
              :class="orderStatusClass(order.order_status)"
              class="text-xs py-1 px-2 rounded-full"
            >
              {{ order.order_status }}
            </span>
          </div>

          <!-- Payment Status -->
          <div class="mb-4">
            <h4 class="text-md font-semibold text-gray-700 mb-2">
              Payment Status
            </h4>
            <span
              :class="paymentStatusClass(order.payment_status)"
              class="text-sm py-1 px-2 rounded-full"
            >
              {{ order.payment_status }}
            </span>
          </div>

          <!-- Customer Cost -->
          <div class="mb-4">
            <h4 class="text-base font-medium text-gray-700 mb-2">
              Customer Cost
            </h4>
            <p class="text-sm text-gray-600">${{ order.customer_cost }}</p>
          </div>

          <!-- Updated -->
          <div class="mb-4">
            <h4 class="text-base font-medium text-gray-700 mb-2">Updated</h4>
            <p class="text-sm text-gray-600">
              {{ formatDate(order.updated_at) }}
            </p>
          </div>

          <!-- Edit Button -->
          <div class="mt-4">
            <NuxtLink
              :to="`/orders/${order.order_id}/edit`"
              class="text-sm font-semibold leading-6 text-white bg-stone-600 px-3 py-1.5 rounded-md shadow-sm hover:bg-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-600"
            >
              Edit
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Desktop View -->
      <table class="hidden lg:table w-full mt-6">
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
            <th
              scope="col"
              class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Updated
            </th>
          </tr>
        </thead>
        <tbody v-if="orderData" class="divide-y divide-stone-800/5 bg-gray-50">
          <tr
            v-for="order in orderData"
            :key="order.order_id"
            @click="
              async () =>
                await navigateTo(`/orders/${customerId}/${order.order_id}`)
            "
            class="cursor-pointer"
          >
            <td class="hidden py-4 px-4 sm:table-cell sm:pr-8">
              <div class="flex gap-x-3">
                <div class="font-mono text-sm leading-6 text-gray-900">
                  {{
                    useTruncate(order.order_description, {
                      length: 30,
                      omission: '...',
                    })
                  }}
                </div>
              </div>
            </td>
            <td class="py-4 px-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div
                class="flex items-center justify-end gap-x-2 sm:justify-start"
              >
                <div class="hidden text-gray-900 sm:block">
                  <span
                    :class="orderStatusClass(order.order_status)"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20 rounded-md"
                  >
                    {{ order.order_status }}
                  </span>
                </div>
              </div>
            </td>
            <td class="py-4 px-4 text-sm leading-6">
              <span
                :class="paymentStatusClass(order.payment_status)"
                class="py-1 px-3 text-xs font-medium text-gray-900 rounded-md"
              >
                {{ order.payment_status }}
              </span>
            </td>

            <td
              class="hidden py-4 px-4 text-right text-sm leading-6 text-gray-900 sm:table-cell sm:pr-6 lg:pr-8"
            >
              {{ order.customer_cost }}
            </td>
            <td class="py-4 px-4 sm:pl-6 lg:pl-8">
              <div class="flex items-center gap-x-4">
                <div
                  class="truncate text-sm font-medium leading-6 text-gray-900"
                >
                  {{ formatDate(order.updated_at) }}
                </div>
                <NuxtLink
                  :to="`/orders/${order.order_id}/edit`"
                  class="text-stone-600 hover:text-stone-900 text-sm"
                  >Edit<span class="sr-only"
                    >, {{ order.order_id }}</span
                  ></NuxtLink
                >
              </div>
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

<style scoped>
tr.cursor-pointer:hover {
  transform: scale(1.01);
  transition: all 0.6s;
}
</style>
