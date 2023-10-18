<script setup lang="ts">
import {
  Customer,
  ConfimationModalState,
  ApiOrderResponse,
} from '~/types/types';
import { useField, useForm } from 'vee-validate';
import { ORDER_STATUS } from '~/data/orderStatus';
import { PAYMENT_STATUS } from '~/data/paymentStatus';
import * as yup from 'yup';
import { formatDate } from '~/utils';

const route = useRoute();
const baseUrl = useRuntimeConfig().public.baseURL;

const orderId = route.params.orderId;
const orderStatus = ref(ORDER_STATUS);
const paymentStatus = ref(PAYMENT_STATUS);
const isLoading = ref(false);
const customerData = ref<Partial<Customer>>({
  customer_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  shipping_address: '',
  shipping_city: '',
  shipping_state: '',
  shipping_zip: '',
  billing_address: '',
  billing_city: '',
  billing_state: '',
  billing_zip: '',
  notes: '',
  created_at: '',
  updated_at: '',
});
const isErrorShowing = ref(false);
const confimationModalState = ref<ConfimationModalState | {}>({});
const errorMessage = ref('');
const isSubmitting = ref(false);

const isConfirmationModalOpen = ref(false);

const validations = yup.object({
  order_date: yup
    .date()
    .required('Order date is required.')
    .label('Order date'),
  order_description: yup
    .string()
    .required('Order description is required.')
    .label('Order description'),
  customer_cost: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required('Customer cost is required.')
    .min(0, 'Customer cost must be a non-negative number.')
    .label('Customer cost'),
  input_expenses: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0, 'Input expenses must be a non-negative number.')
    .nullable()
    .label('Input expenses'),
  shipping_cost: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0, 'Shipping cost must be a non-negative number.')
    .nullable()
    .label('Shipping cost'),
  taxes_fees: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0, 'Taxes & Fees must be a non-negative number.')
    .nullable()
    .label('Taxes & Fees'),
  total_write_off: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0, 'Total write off must be a non-negative number.')
    .nullable()
    .label('Total write off'),
  profit: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0, 'Profit must be a non-negative number.')
    .nullable()
    .label('Profit'),
  order_status: yup
    .string()
    .required('Order status is required.')
    .label('Order status'),
  payment_status: yup
    .string()
    .required('Payment status is required.')
    .label('Payment status'),
  notes: yup.string().nullable().label('Notes'),
});

const { handleSubmit } = useForm({
  validationSchema: validations,
});

const { value: order_date, errorMessage: orderDateError } = useField<Date>(
  'order_date',
  {
    initialValue: new Date(),
  }
);

const { value: order_description, errorMessage: orderDescriptionError } =
  useField<string>('order_description');

const { value: customer_cost, errorMessage: customerCostError } =
  useField<string>('customer_cost');

const { value: input_expenses, errorMessage: inputExpensesError } =
  useField<string>('input_expenses');

const { value: shipping_cost, errorMessage: shippingCostError } =
  useField<string>('shipping_cost');

const { value: taxes_fees, errorMessage: taxesFeesError } =
  useField<string>('taxes_fees');

const { value: total_write_off, errorMessage: totalWriteOffError } =
  useField<string>('total_write_off');

const { value: profit, errorMessage: profitError } = useField<string>('profit');

const { value: order_status, errorMessage: orderStatusError } =
  useField<string>('order_status');

const { value: payment_status, errorMessage: paymentStatusError } =
  useField<string>('payment_status');
const { value: notes, errorMessage: notesError } = useField<string>('notes');

interface State {
  name: string;
  value: string;
}

function findByValue(value: string, states: Ref<State[]>) {
  return states.value.find((s) => s.value === value) || states.value[0];
}

const selectedOrderStatus = ref(findByValue(order_status.value, orderStatus));
const selectedPaymentStatus = ref(
  findByValue(payment_status.value, paymentStatus)
);

function createStateUpdater(
  stateValueRef: Ref<string>,
  stateObjRef: Ref<State>
) {
  return (newState: State) => {
    stateValueRef.value = newState.value;
    stateObjRef.value = newState;
  };
}

const updateOrderStatus = createStateUpdater(order_status, selectedOrderStatus);
const updatePaymentStatus = createStateUpdater(
  payment_status,
  selectedPaymentStatus
);

const handleUpdateOrder = handleSubmit(async (formData) => {
  const data = {
    ...formData,
    customer_id: customerData.value?.customer_id,
  };
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/orders/${orderId}`, {
      method: 'PUT',
      body: {
        data,
      },
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    });

    if (error.value) {
      errorMessage.value = error.value?.data?.error;
      throw new Error(error.value?.data?.error);
    }
    sessionStorage.clear();
    await navigateTo('/orders');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const orderData = await useFetchWithCache<ApiOrderResponse>(
      `/orders/${orderId}`
    );
    const {
      customer_id,
      order_date: orderDate,
      order_description: orderDescription,
      customer_cost: customerCost,
      input_expenses: inputExpenses,
      taxes_fees: taxesFees,
      shipping_cost: shippingCost,
      total_write_off: totalWriteOff,
      profit: fetchedProfit,
      notes: fetchedNotes,
      order_status: fetchedOrderStatus,
      payment_status: fetchedPaymentStatus,
    } = orderData.value?.data;

    const fetchedCustomerData = await useFetchWithCache<{ data: Customer }>(
      `/customers/${customer_id}`
    );

    customerData.value = fetchedCustomerData.value.data;

    order_date.value = new Date(orderDate as string);
    order_description.value = orderDescription ?? '';
    customer_cost.value = customerCost ?? '';
    input_expenses.value = inputExpenses ?? '';
    taxes_fees.value = taxesFees ?? '';
    shipping_cost.value = shippingCost ?? '';
    total_write_off.value = totalWriteOff ?? '';
    profit.value = fetchedProfit ?? '';
    notes.value = fetchedNotes ?? '';
    order_status.value = fetchedOrderStatus ?? '';
    payment_status.value = fetchedPaymentStatus ?? '';

    selectedOrderStatus.value = findByValue(order_status.value, orderStatus);
    selectedPaymentStatus.value = findByValue(
      payment_status.value,
      paymentStatus
    );
  } catch (error) {
    isErrorShowing.value = true;
    errorMessage.value = `Failed to fetch data`;
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const handleConfirmUpdateOrder = () => {
  confimationModalState.value = {
    confirm: handleUpdateOrder,
    dangerMode: false,
    heading: 'Confirmation',
    message: 'Do you want to proceed with updating this order?',
    confirmButtonText: 'Update order',
  };

  isConfirmationModalOpen.value = true;
};

async function handleSoftDeleteOrder() {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(
      `${baseUrl}/orders/soft-delete/${orderId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
      }
    );

    if (error.value) {
      errorMessage.value = error.value?.data?.error;
      // @ts-ignore
      throw new Error(error.value?.data?.error);
    }
    sessionStorage.clear();
    await navigateTo('/orders');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

async function handleHardDeleteOrder() {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(
      `${baseUrl}/orders/hard-delete/${orderId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
      }
    );

    if (error.value) {
      errorMessage.value = error.value?.data?.error;
      // @ts-ignore
      throw new Error(error.value?.data?.error);
    }
    sessionStorage.clear();
    await navigateTo('/orders');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

const handleConfirmSoftDelete = () => {
  confimationModalState.value = {
    confirm: handleSoftDeleteOrder,
    dangerMode: true,
    heading: 'Soft delete order',
    message: 'Do you want to proceed with soft deleting the order?',
    confirmButtonText: 'Soft delete',
  };

  isConfirmationModalOpen.value = true;
};

const handleConfirmHardDelete = () => {
  confimationModalState.value = {
    confirm: handleHardDeleteOrder,
    dangerMode: true,
    heading: 'Hard delete order',
    message: 'Do you want to permanently delete this order?',
    confirmButtonText: 'Hard delete',
  };

  isConfirmationModalOpen.value = true;
};

const confirmationModalConfirmMethod = computed(() => {
  if ('confirm' in confimationModalState.value) {
    return confimationModalState.value.confirm;
  }
  return () => {};
});

const confirmationModalDangerMode = computed(() => {
  if ('dangerMode' in confimationModalState.value) {
    return confimationModalState.value.dangerMode;
  }
  return false;
});

const confirmationModalHeading = computed(() => {
  if ('heading' in confimationModalState.value) {
    return confimationModalState.value.heading;
  }
  return '';
});

const confirmationModalMessage = computed(() => {
  if ('message' in confimationModalState.value) {
    return confimationModalState.value.message;
  }
  return '';
});

const confirmationModalConfirmButtonText = computed(() => {
  if ('confirmButtonText' in confimationModalState.value) {
    return confimationModalState.value.confirmButtonText;
  }
  return '';
});
</script>

<template>
  <div v-auto-animate class="space-y-10 divide-y divide-gray-900/10">
    <ConfirmationModal
      v-if="isConfirmationModalOpen"
      :show="isConfirmationModalOpen"
      @confirm="confirmationModalConfirmMethod"
      @update:open="isConfirmationModalOpen = $event"
      :dangerMode="confirmationModalDangerMode"
      :heading="confirmationModalHeading"
      :message="confirmationModalMessage"
      :confirmButtonText="confirmationModalConfirmButtonText"
    />

    <NotificationToast
      type="error"
      :isVisible="isErrorShowing"
      :dismissible="true"
      @dismiss="() => (isErrorShowing = false)"
      :message="errorMessage"
    />
    <Loader v-if="isSubmitting" />
    <TableLoader v-if="isLoading" />
    <div
      v-if="!isLoading && customerData.last_name"
      class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3"
    >
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Update order for {{ customerData.first_name }}
          {{ customerData.last_name }}
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Updated customer order will be stored in the database.
        </p>
      </div>

      <form
        @submit.prevent="handleConfirmUpdateOrder"
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div class="sm:col-span-3 self-end">
              <p class="text-sm">
                Order date:
                <span class="font-bold">{{
                  formatDate(order_date.toString())
                }}</span>
              </p>
              <DatePicker type="date" v-model="order_date" label="Order date" />
              <p v-if="orderDateError" class="text-red-600 text-sm m-0 p-0">
                {{ orderDateError }}
              </p>
            </div>
            <InputField
              class="sm:col-span-3"
              required
              label="Order description"
              v-model.trim="order_description"
              type="text"
              name="order-description"
              id="order-description"
              autocomplete="order-description"
              :error="orderDescriptionError"
              autofocus
            />

            <MonetaryInputField
              class="sm:col-span-3"
              label="Customer cost"
              required
              v-model="customer_cost"
              name="customer-cost"
              id="customer-cost"
              placeholder="0.00"
              prefix="$"
              suffix="USD"
              :error="customerCostError"
            />

            <SelectDropdown
              :required="true"
              label="Order status"
              class="sm:col-span-3"
              :modelValue="order_status"
              :items="orderStatus"
              @update:modelValue="updateOrderStatus"
              :error="orderStatusError ?? ''"
            />

            <SelectDropdown
              :required="true"
              label="Payment status"
              class="sm:col-span-3"
              :modelValue="payment_status"
              :items="paymentStatus"
              @update:modelValue="updatePaymentStatus"
              :error="paymentStatusError ?? ''"
            />

            <MonetaryInputField
              class="sm:col-span-3"
              label="Input expenses"
              v-model="input_expenses"
              name="input-expenses"
              id="input-expenses"
              placeholder="0.00"
              prefix="$"
              suffix="USD"
              :error="inputExpensesError"
            />

            <MonetaryInputField
              class="sm:col-span-3"
              label="Shipping cost"
              v-model="shipping_cost"
              name="shipping-cost"
              id="shipping-cost"
              placeholder="0.00"
              prefix="$"
              suffix="USD"
              :error="shippingCostError"
            />

            <MonetaryInputField
              class="sm:col-span-3"
              label="Taxes & Fees"
              v-model="taxes_fees"
              name="taxes-fees"
              id="taxes-fees"
              placeholder="0.00"
              prefix="$"
              suffix="USD"
              :error="taxesFeesError"
            />

            <MonetaryInputField
              class="sm:col-span-3"
              label="Total write off"
              v-model="total_write_off"
              name="total-write-off"
              id="total-write-off"
              placeholder="0.00"
              prefix="$"
              suffix="USD"
              :error="totalWriteOffError"
            />

            <MonetaryInputField
              class="sm:col-span-3"
              label="Profit"
              v-model="profit"
              name="profit"
              id="profit"
              placeholder="0.00"
              prefix="$"
              suffix="USD"
              :error="profitError"
            />

            <TextAreaField
              v-model.trim="notes"
              class="col-span-full"
              label="Notes"
              name="notes"
              id="notes"
              :rows="3"
              description="Notes regarding the order."
              :error="notesError"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
        >
          <NuxtLink
            to="/orders"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            class="rounded-md bg-stone-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          >
            Save
          </button>
        </div>
        <div
          class="bg-red-100 shadow-sm ring-1 ring-red-900/5 rounded md:col-span-2 border border-red-600"
        >
          <div class="bg-white px-4 py-5 sm:px-6">
            <h3 class="text-xl font-extrabold leading-6 text-red-600 my-4">
              Danger zone
            </h3>
            <div class="flex justify-between items-center gap-6 my-6">
              <div class="flex flex-col">
                <p class="text-base text-bold">Soft delete this order</p>
                <p class="text-base text-gray-600">
                  The order will still remain in the database but will no longer
                  appear in the UI
                </p>
              </div>
              <button
                type="button"
                @click="handleConfirmSoftDelete"
                class="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Soft Delete
              </button>
            </div>
            <div class="flex justify-between items-center gap-6 my-6">
              <div class="flex flex-col">
                <p class="text-base text-bold">Hard delete this order</p>
                <p class="text-base text-gray-600">
                  Once you delete this order, there is no going back. Please be
                  certain.
                </p>
              </div>
              <button
                @click="handleConfirmHardDelete"
                type="button"
                class="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Hard Delete
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
