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
    console.error(error);
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

  <div>
    <h1 class="font-semibold leading-6 text-4xl pb-10">
      Order <span class="text-base bold">{{ orderId }}</span>
    </h1>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <div class="px-4 sm:px-0">
        <h3 class="text-base font-semibold leading-7 text-gray-900">
          Customer Information
        </h3>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Customer details and information.
        </p>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink
          class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          :to="`/customers/${customerId}`"
        >
          <font-awesome-icon :icon="['fas', 'binoculars']" size="2x" />
        </NuxtLink>
        <NuxtLink
          class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          :to="`/customers/${customerId}/edit`"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="2x" />
        </NuxtLink>
      </div>
    </div>
    <div class="mt-6 border-t border-gray-300">
      <dl class="divide-y divide-gray-300">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">
            Customer name
          </dt>
          <dd
            class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
          >
            {{ customerData.first_name }} {{ customerData.last_name }}
          </dd>
        </div>
        <div
          class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
          v-if="customerData.billing_address"
        >
          <dt class="text-sm font-medium leading-6 text-gray-900">
            Billing Address
          </dt>
          <dd
            class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
          >
            <address class="flex flex-col">
              <span>{{ customerData.billing_address }}</span>
              <span
                >{{ customerData.billing_city }},
                {{ customerData.billing_state }}</span
              >
              <span>{{ customerData.billing_zip }}</span>
            </address>
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt
            v-if="customerData.shipping_address"
            class="text-sm font-medium leading-6 text-gray-900"
          >
            Shipping Address
          </dt>
          <dd
            class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
          >
            <address class="flex flex-col">
              <span>{{ customerData.shipping_address }}</span>
              <span
                >{{ customerData.shipping_city }},
                {{ customerData.shipping_state }}</span
              >
              <span>{{ customerData.shipping_zip }}</span>
            </address>
          </dd>
        </div>
        <div
          v-if="customerData.email"
          class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
        >
          <dt class="text-sm font-medium leading-6 text-gray-900">Email</dt>
          <dd
            class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
          >
            <NuxtLink
              class="cursor-pointer underline"
              target="_blank"
              :to="`mailto:${customerData.email}`"
              >{{ customerData.email }}</NuxtLink
            >
          </dd>
        </div>
        <div
          v-if="customerData.phone_number"
          class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
        >
          <dt class="text-sm font-medium leading-6 text-gray-900">
            Phone Number
          </dt>
          <dd
            class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
          >
            <NuxtLink
              class="cursor-pointer underline"
              target="_blank"
              :to="`tel:${stripDashesFromPhoneNumber(
                customerData.phone_number
              )}`"
            >
              {{ formatPhoneNumber(customerData.phone_number) }}</NuxtLink
            >
          </dd>
        </div>
      </dl>
    </div>
    <div
      class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-y border-gray-300"
    >
      <div class="px-4 sm:px-0">
        <h3 class="text-base font-semibold leading-7 text-gray-900">
          Order Information
        </h3>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Order Details and information.
        </p>
      </div>
      <div class="flex items-center">
        <NuxtLink
          class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          :to="`/orders/${orderId}/edit`"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="2x" />
        </NuxtLink>
      </div>
    </div>
    <dl class="divide-y divide-gray-300">
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Customer name
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ customerData.first_name }} {{ customerData.last_name }}
        </dd>
      </div>
      <div
        v-if="orderData.order_date"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">Order date</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatDate(orderData.order_date) }}
        </dd>
      </div>
      <div
        v-if="orderData.updated_at"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Last updated
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatDate(orderData.updated_at) }}
        </dd>
      </div>
      <div
        v-if="orderData.order_description"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Order description
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <p>
            {{ orderData.order_description }}
          </p>
        </dd>
      </div>
      <div
        v-if="orderData.customer_cost"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Customer cost
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatMoney(+orderData.customer_cost) }}
        </dd>
      </div>
      <div
        v-if="orderData.input_expenses"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Input expenses
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatMoney(+orderData.input_expenses) }}
        </dd>
      </div>
      <div
        v-if="orderData.shipping_cost"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Shipping cost
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatMoney(+orderData.shipping_cost) }}
        </dd>
      </div>
      <div
        v-if="orderData.taxes_fees"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Taxes & Fees
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatMoney(+orderData.taxes_fees) }}
        </dd>
      </div>
      <div
        v-if="orderData.total_write_off"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Total write off
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatMoney(+orderData.total_write_off) }}
        </dd>
      </div>
      <div
        v-if="orderData.profit"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Total profit
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ formatMoney(+orderData.profit) }}
        </dd>
      </div>
      <div
        v-if="orderData.order_status"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Order status
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <span
            :class="orderStatusClass(orderData.order_status)"
            class="inline-flex items-center px-2 py-1 text-xl font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20 rounded-md"
          >
            {{ orderData.order_status }}
          </span>
        </dd>
      </div>
      <div
        v-if="orderData.payment_status"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">
          Payment status
        </dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <span
            :class="paymentStatusClass(orderData.payment_status)"
            class="inline-flex items-center px-2 py-1 text-xl font-medium text-gray-900 ring-1 ring-inset ring-gray-400/20 rounded-md"
          >
            {{ orderData.payment_status }}
          </span>
        </dd>
      </div>
      <div
        v-if="orderData.notes"
        class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
      >
        <dt class="text-sm font-medium leading-6 text-gray-900">Order notes</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <p>
            {{ orderData.notes }}
          </p>
        </dd>
      </div>
    </dl>
  </div>
</template>
