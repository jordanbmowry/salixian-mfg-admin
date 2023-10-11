<script setup lang="ts">
import {
  formatDate,
  formatPhoneNumber,
  stripDashesFromPhoneNumber,
  orderStatusClass,
  paymentStatusClass,
  formatMoney,
} from '~/utils';
const route = useRoute();

const pageIsLoading = ref(false);
const customerId = route.params.customerId;
const orderId = route.params.orderId;
const customerData = ref({});
const orderData = ref({});
const isErrorShowing = ref(false);

const fetchCustomerUrl = `/customers/${customerId}`;
const fetchOrderUrl = `/orders/${orderId}`;

const fetchAllData = async () => {
  pageIsLoading.value = true;
  try {
    const [fetchedCustomer, fetchedOrder] = await Promise.all([
      useFetchWithCache(fetchCustomerUrl),
      useFetchWithCache(fetchOrderUrl),
    ]);

    customerData.value = fetchedCustomer.value.data;
    orderData.value = fetchedOrder.value.data;
  } catch (error) {
    console.log(error);
    isErrorShowing.value = true;
    console.error('Error fetching the data: ', error);
  } finally {
    pageIsLoading.value = false;
  }
};

onMounted(fetchAllData);
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
    <h1 class="font-semibold leading-6 text-4xl pb-10">Order {{ orderId }}</h1>
    <header>
      <!-- Customer full name and address -->
      <div class="border-b border-stone-200 bg-white px-4 py-5 sm:px-6">
        <h3
          class="text-base font-extrabold leading-6 text-stone-900 drop-shadow-md"
        >
          Customer details
        </h3>
      </div>
      <div
        class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8"
      >
        <div>
          <div class="flex items-center gap-x-3">
            <h3
              class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl break-words"
            >
              {{ customerData.first_name }} {{ customerData.last_name }}
            </h3>
          </div>
        </div>
        <div v-if="customerData.billing_address" class="flex flex-col">
          <h3>Billing Address</h3>
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
          <h3>Shipping Address</h3>
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
    <section
      class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
    >
      <div
        v-if="customerData.email"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900">Email</h3>
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
        <h3 class="leading-6 text-gray-900">Phone</h3>
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
        <h3 class="leading-6 text-gray-900 mb-4">View customer</h3>
        <NuxtLink
          class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          :to="`/customers/${customerId}`"
        >
          <font-awesome-icon :icon="['fas', 'binoculars']" size="2x" />
        </NuxtLink>
      </div>
      <div
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Update customer</h3>
        <NuxtLink
          class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          :to="`/customers/${customerId}/edit`"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="2x" />
        </NuxtLink>
      </div>
    </section>
    <div class="border-b border-stone-200 bg-white px-4 py-5 sm:px-6">
      <h3
        class="text-base font-extrabold leading-6 text-stone-900 drop-shadow-md"
      >
        Order details
      </h3>
    </div>
    <section
      class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
    >
      <div
        v-if="orderData.order_date"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900">Order date</h3>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-lg font-semibold tracking-tight text-stone-500">{{
            formatDate(orderData.order_date)
          }}</span>
        </p>
      </div>
      <div
        v-if="orderData.updated_at"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Last update</h3>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-lg font-semibold tracking-tight text-stone-500">{{
            formatDate(orderData.updated_at)
          }}</span>
        </p>
      </div>
      <div
        v-if="orderData.order_description"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900">Order description</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ orderData.order_description }}
        </p>
      </div>
      <div
        v-if="orderData.customer_cost"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Customer cost</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ formatMoney(+orderData.customer_cost) }}
        </p>
      </div>
    </section>

    <section
      class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
    >
      <div
        v-if="orderData.input_expenses"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900">Input expenses</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ formatMoney(+orderData.input_expenses) }}
        </p>
      </div>
      <div
        v-if="orderData.shipping_cost"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Shipping cost</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ formatMoney(+orderData.shipping_cost) }}
        </p>
      </div>
      <div
        v-if="orderData.taxes_fees"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900">Taxes & Fees</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ formatMoney(+orderData.taxes_fees) }}
        </p>
      </div>
      <div
        v-if="orderData.total_write_off"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Total write off</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ formatMoney(+orderData.total_write_off) }}
        </p>
      </div>
    </section>

    <section
      class="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
    >
      <div
        v-if="orderData.profit"
        class="sm:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900">Profit</h3>
        <p
          class="mt-2 text-lg flex items-baseline tracking-tight text-stone-500 gap-x-2"
        >
          {{ formatMoney(+orderData.profit) }}
        </p>
      </div>
      <div
        v-if="orderData.order_status"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Order status</h3>
        <span
          :class="orderStatusClass(orderData.order_status)"
          class="inline-flex items-center px-2 py-1 text-xl font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20 rounded-md"
        >
          {{ orderData.order_status }}
        </span>
      </div>
      <div
        v-if="orderData.payment_status"
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Payment status</h3>
        <span
          :class="paymentStatusClass(orderData.payment_status)"
          class="inline-flex items-center px-2 py-1 text-xl font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20 rounded-md"
        >
          {{ orderData.payment_status }}
        </span>
      </div>
      <div
        class="lg:border-l border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8"
      >
        <h3 class="leading-6 text-gray-900 mb-4">Update order</h3>
        <NuxtLink
          class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          :to="`/orders/${orderId}/edit`"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="2x" />
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
