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
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Edit {{ first_name }} {{ last_name }}
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Customer's info will be changed and stored in the database.
        </p>
      </div>

      <form
        @submit.prevent="handleConfirmUpdate"
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <InputField
              class="sm:col-span-3"
              required
              label="First name"
              v-model.trim="first_name"
              type="text"
              name="first-name"
              id="first-name"
              autocomplete="given-name"
              :error="firstNameError"
              autofocus
            />

            <InputField
              class="sm:col-span-3"
              required
              label="Last name"
              v-model.trim="last_name"
              type="text"
              name="last-name"
              id="last-name"
              autocomplete="family-name"
              :error="lastNameError"
            />

            <InputField
              class="sm:col-span-4"
              required
              label="Phone number"
              v-model.trim="phone_number"
              type="text"
              name="phone-number"
              id="phone-number"
              autocomplete="true"
              :error="phoneNumberError"
            />

            <InputField
              class="sm:col-span-4"
              required
              label="Email"
              v-model.trim="email"
              type="text"
              name="email"
              id="email"
              autocomplete="email"
              :error="emailError"
            />

            <InputField
              class="sm:col-span-4"
              required
              label="Shipping address"
              v-model.trim="shipping_address"
              type="text"
              name="shipping-address"
              id="shipping-address"
              autocomplete="shipping street-address"
              :error="shippingAddressError"
            />

            <InputField
              class="sm:col-span-full xl:sm:col-span-2 xl:sm:col-start-1"
              required
              label="Shipping City"
              v-model.trim="shipping_city"
              type="text"
              name="shipping-city"
              id="shipping-city"
              autocomplete="shipping address-level2"
              :error="shippingCityError"
            />

            <SelectDropdown
              :required="true"
              label="Shipping state"
              class="sm:col-span-full xl:sm:col-span-2"
              :modelValue="shipping_state"
              :items="states"
              @update:modelValue="updateShippingState"
              :error="shippingStateError ?? ''"
            />

            <InputField
              class="sm:col-span-full xl:sm:col-span-2"
              required
              label="Shipping ZIP / Postal code"
              v-model.trim="shipping_zip"
              type="text"
              name="shipping-postal-code"
              id="shipping-postal-code"
              autocomplete="shipping postal-code"
              :error="shippingZipError"
            />

            <div class="col-span-full">
              <ToggleSwitch
                v-model="useShippingForBilling"
                label="Shipping and billing address are the same"
                description="Use the shipping address also as the billing address."
                :activeClass="'bg-stone-600'"
                :inactiveClass="'bg-gray-200'"
              />
            </div>

            <InputField
              class="col-span-full"
              label="Billing address"
              v-model.trim="billing_address"
              type="text"
              name="billing-address"
              id="billing-address"
              autocomplete="billing street-address"
              :error="billingAddressError"
            />

            <InputField
              class="sm:col-span-full xl:sm:col-span-2 xl:sm:col-start-1"
              label="Billing City"
              v-model.trim="billing_city"
              type="text"
              name="billing-city"
              id="billing-city"
              autocomplete="billing address-level2"
              :error="billingCityError"
            />

            <SelectDropdown
              label="Billing State"
              class="sm:col-span-full xl:sm:col-span-2"
              :modelValue="billing_state"
              :items="states"
              @update:modelValue="updateBillingState"
              :error="billingStateError ?? ''"
            />

            <InputField
              class="sm:col-span-full xl:sm:col-span-2"
              label="Billing Zip / Postal code"
              v-model.trim="billing_zip"
              type="text"
              name="billing-postal-code"
              id="billing-postal-code"
              autocomplete="billing address-level2"
              :error="billingZipError"
            />
            <TextAreaField
              v-model.trim="notes"
              class="col-span-full"
              label="Notes"
              name="notes"
              id="notes"
              :rows="3"
              description="Notes regarding the customer."
              :error="notesError"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
        >
          <NuxtLink
            to="/customers"
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
                <p class="text-base text-bold">Soft delete this customer</p>
                <p class="text-base text-gray-600">
                  The customer will still remain in the database but will no
                  longer appear in the UI
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
                <p class="text-base text-bold">Hard delete this customer</p>
                <p class="text-base text-gray-600">
                  Once you delete this customer, there is no going back. Please
                  be certain.
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

<script setup lang="ts">
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from '@headlessui/vue';
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { STATES } from '~/data/states';
import { Customer, ConfimationModalState } from '~/types/types';

const route = useRoute();

const customerId = route.params.customerId;
const isConfirmationModalOpen = ref(false);
const confimationModalState = ref<ConfimationModalState | {}>({});
const useShippingForBilling = ref(false);
const isSubmitting = ref(false);
const isErrorShowing = ref(false);
const errorMessage = ref('');
const states = ref(STATES);

const baseUrl = useRuntimeConfig().public.baseURL;

const validations = yup.object({
  first_name: yup.string().required('First name is required.'),
  last_name: yup.string().required('Last name is required.'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\d{3}-\d{3}-\d{4}$/,
      'Phone number must be in the format 999-999-9999'
    ),
  email: yup
    .string()
    .required('Email is required.')
    .email('Enter a valid email.'),
  shipping_address: yup.string().required('Shipping address is required.'),
  shipping_city: yup.string().required('Shipping city is required.'),
  shipping_state: yup
    .string()
    .required('Shipping state/province is required.')
    .matches(/^[A-Z]{2}$/, 'Shipping state must be two capital letters.'),
  shipping_zip: yup
    .string()
    .required('Shipping ZIP/Postal code is required.')
    .matches(/^\d{5}$/, 'Shipping ZIP code must be exactly 5 digits.'),
  billing_address: yup.string(),
  billing_city: yup.string(),
  billing_state: yup
    .string()
    .nullable()
    .test(
      'billing-state-format',
      'Billing state must be two capital letters or left blank.',
      (value) => {
        if (!value || value === '') return true;
        return /^[A-Z]{2}$/.test(value);
      }
    ),

  billing_zip: yup
    .string()
    .nullable()
    .test(
      'billing-zip-format',
      'Billing ZIP code must be exactly 5 digits or left blank.',
      (value) => {
        if (!value || value === '') return true;
        return /^\d{5}$/.test(value);
      }
    ),
  notes: yup.string(),
});

const { handleSubmit } = useForm({
  validationSchema: validations,
});

const { value: first_name, errorMessage: firstNameError } = useField<string>(
  'first_name',
  {
    initialValue: '',
  }
);
const { value: last_name, errorMessage: lastNameError } = useField<string>(
  'last_name',
  {
    initialValue: '',
  }
);
const { value: phone_number, errorMessage: phoneNumberError } =
  useField<string>('phone_number', {
    initialValue: '',
  });
const { value: email, errorMessage: emailError } = useField<string>('email', {
  initialValue: '',
});
const { value: shipping_address, errorMessage: shippingAddressError } =
  useField<string>('shipping_address', {
    initialValue: '',
  });
const { value: shipping_city, errorMessage: shippingCityError } =
  useField<string>('shipping_city', {
    initialValue: '',
  });
const { value: shipping_state, errorMessage: shippingStateError } =
  useField<string>('shipping_state', {
    initialValue: '',
  });
const { value: shipping_zip, errorMessage: shippingZipError } =
  useField<string>('shipping_zip', {
    initialValue: '',
  });
const { value: billing_address, errorMessage: billingAddressError } =
  useField<string>('billing_address', {
    initialValue: '',
  });
const { value: billing_city, errorMessage: billingCityError } =
  useField<string>('billing_city', {
    initialValue: '',
  });
const { value: billing_state, errorMessage: billingStateError } =
  useField<string>('billing_state', {
    initialValue: '',
  });
const { value: billing_zip, errorMessage: billingZipError } = useField<string>(
  'billing_zip',
  {
    initialValue: '',
  }
);

const { value: notes, errorMessage: notesError } = useField<string | null>(
  'notes',
  {
    initialValue: '',
  }
);

function findStateByValue(value: string | null) {
  return states.value.find((s) => s.value === value) || states.value[0];
}

const selectedShippingState = ref(findStateByValue(shipping_state.value));
const selectedBillingState = ref(findStateByValue(billing_state.value));

onMounted(async () => {
  try {
    const data = await useFetchWithCache<{ data: Customer }>(
      `/customers/${customerId}`
    );

    const {
      billing_address: billingAddress,
      billing_city: billingCity,
      billing_state: billingState,
      billing_zip: billingZip,
      email: currentEmail,
      first_name: firstName,
      last_name: lastName,
      notes: currentNotes,
      phone_number: phoneNumber,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_state: shippingState,
      shipping_zip: shippingZip,
    } = data.value?.data;

    billing_address.value = billingAddress || '';
    billing_city.value = billingCity || '';
    billing_state.value = billingState || '';
    billing_zip.value = billingZip || '';
    email.value = currentEmail;
    first_name.value = firstName;
    last_name.value = lastName;
    notes.value = currentNotes;
    phone_number.value = phoneNumber;
    shipping_address.value = shippingAddress;
    shipping_city.value = shippingCity;
    shipping_state.value = shippingState;
    shipping_zip.value = shippingZip;
    notes.value = currentNotes;

    selectedShippingState.value = findStateByValue(shipping_state.value);
    selectedBillingState.value = findStateByValue(billing_state.value);
  } catch (error) {
    isErrorShowing.value = true;
    errorMessage.value = `Failed to fetch cusomer data`;
    console.error(error);
  }
});

const handleUpdateCustomer = handleSubmit(async (formData) => {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/customers/${customerId}`, {
      method: 'PUT',
      body: {
        data: formData,
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
    await navigateTo('/customers');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
});

async function handleSoftDeleteCustomer() {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(
      `${baseUrl}/customers/soft-delete/${customerId}`,
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
    await navigateTo('/customers');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

async function handleHardDeleteCustomer() {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(
      `${baseUrl}/customers/hard-delete/${customerId}`,
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
    await navigateTo('/customers');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

function formatToPhoneNumber(value: string) {
  let cleaned = ('' + value).replace(/\D/g, '');
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return value;
}

watch(
  phone_number,
  (newValue) => {
    phone_number.value = formatToPhoneNumber(newValue);
  },
  { deep: true }
);

watch(useShippingForBilling, (newValue) => {
  if (newValue) {
    billing_address.value = shipping_address.value;
    billing_city.value = shipping_city.value;
    billing_state.value = shipping_state.value;
    billing_zip.value = shipping_zip.value;
    selectedBillingState.value = selectedShippingState.value;
  } else {
    selectedBillingState.value = { name: 'Select a state', value: '' };
    billing_address.value = '';
    billing_city.value = '';
    billing_state.value = '';
    billing_zip.value = '';
  }
});

watch(selectedShippingState, (newState) => {
  shipping_state.value = newState.value;
});

watch(selectedBillingState, (newState) => {
  billing_state.value = newState.value;
});

interface State {
  name: string;
  value: string;
}

function createStateUpdater(
  stateValueRef: Ref<string>,
  stateObjRef: Ref<State>
) {
  return (newState: State) => {
    stateValueRef.value = newState.value;
    stateObjRef.value = newState;
  };
}

const updateShippingState = createStateUpdater(
  shipping_state,
  selectedShippingState
);
const updateBillingState = createStateUpdater(
  billing_state,
  selectedBillingState
);

const handleConfirmUpdate = () => {
  confimationModalState.value = {
    confirm: handleUpdateCustomer,
    dangerMode: false,
    heading: 'Confirmation',
    message: 'Do you want to proceed with updating the customer?',
    confirmButtonText: 'Yes',
  };

  isConfirmationModalOpen.value = true;
};
const handleConfirmSoftDelete = () => {
  confimationModalState.value = {
    confirm: handleSoftDeleteCustomer,
    dangerMode: true,
    heading: 'Soft delete customer',
    message: 'Do you want to proceed with soft deleting the customer?',
    confirmButtonText: 'Soft delete',
  };

  isConfirmationModalOpen.value = true;
};

const handleConfirmHardDelete = () => {
  confimationModalState.value = {
    confirm: handleHardDeleteCustomer,
    dangerMode: true,
    heading: 'Hard delete customer',
    message:
      'Do you want to permanently delete this customer? All orders for this customer will be deleted as well.',
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
