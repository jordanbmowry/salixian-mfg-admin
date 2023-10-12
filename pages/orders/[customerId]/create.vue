<script setup lang="ts">
import { ORDER_STATUS } from '~/data/orderStatus';
import { PAYMENT_STATUS } from '~/data/paymentStatus';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const route = useRoute();
const baseUrl = useRuntimeConfig().public.baseURL;

const orderStatus = ref(ORDER_STATUS);
const paymentStatus = ref(PAYMENT_STATUS);
const isLoading = ref(false);
const customerData = ref({});
const isErrorShowing = ref(false);
const confimationModalState = ref({});
const errorMessage = ref('');
const isSubmitting = ref(false);
const isConfirmationModalOpen = ref(false);

const customerId = route.params.customerId;

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
  useField<number>('customer_cost');

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

const fetchCustomerData = async (url: string) => {
  try {
    isLoading.value = true;
    const data = await useFetchWithCache(url);
    // @ts-ignore
    customerData.value = data.value.data;
  } catch (error) {
    errorMessage.value = 'Error fetching the data.';
    isErrorShowing.value = true;
    console.error('Error fetching the data: ', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  order_date.value = new Date();
  await fetchCustomerData(`/customers/${customerId}`);
});

const handleCreateOrder = handleSubmit(async (formData) => {
  const data = {
    ...formData,
    customer_id: customerId,
  };
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/orders`, {
      method: 'POST',
      body: {
        data,
      },
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    });

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
});

const handleConfirmCreateOrder = () => {
  confimationModalState.value = {
    confirm: handleCreateOrder,
    dangerMode: false,
    heading: 'Confirmation',
    message: 'Do you want to proceed with creating a new order?',
    confirmButtonText: 'Create order',
  };

  isConfirmationModalOpen.value = true;
};
</script>

<template>
  <div v-auto-animate class="space-y-10 divide-y divide-gray-900/10">
    <ConfirmationModal
      v-if="isConfirmationModalOpen"
      :show="isConfirmationModalOpen"
      @confirm="confimationModalState.confirm"
      @update:open="isConfirmationModalOpen = $event"
      :dangerMode="confimationModalState.dangerMode"
      :heading="confimationModalState.heading"
      :message="confimationModalState.message"
      :confirmButtonText="confimationModalState.confirmButtonText"
    />

    <NotificationToast
      type="error"
      :isVisible="isErrorShowing"
      :dismissible="true"
      @dismiss="() => (isErrorShowing = false)"
      :message="errorMessage"
    />
    <Loader v-if="isSubmitting" />
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Create order for {{ customerData.first_name }}
          {{ customerData.last_name }}
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          New customer order will be stored in the database.
        </p>
      </div>

      <form
        @submit.prevent="handleConfirmCreateOrder"
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div class="sm:col-span-3 self-end">
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

            <StateDropdown
              :required="true"
              label="Order status"
              class="sm:col-span-3"
              :modelValue="order_status"
              :states="orderStatus"
              @update:modelValue="updateOrderStatus"
              :error="orderStatusError ?? ''"
            />

            <StateDropdown
              :required="true"
              label="Payment status"
              class="sm:col-span-3"
              :modelValue="payment_status"
              :states="paymentStatus"
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
      </form>
    </div>
  </div>
</template>
