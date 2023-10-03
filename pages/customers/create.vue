<template>
  <div v-auto-animate class="space-y-10 divide-y divide-gray-900/10">
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
          Create new customer
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          This customer will be stored in your database.
        </p>
      </div>

      <form
        @submit="onSubmit"
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div class="sm:col-span-3">
              <label
                for="first-name"
                class="block text-sm font-medium leading-6 text-gray-900"
                >First name<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="first_name"
                  type="text"
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="firstNameError">
                  {{ firstNameError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label
                for="last-name"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Last name<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="last_name"
                  type="text"
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="lastNameError">
                  {{ lastNameError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-4">
              <label
                for="phone-number"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Phone number<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="relative mt-2 rounded-md shadow-sm">
                <input
                  v-model.trim="phone_number"
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  class="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                  placeholder="999-999-9999"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="phoneNumberError">
                  {{ phoneNumberError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-4">
              <label
                for="email"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Email address<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="email"
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="emailError">
                  {{ emailError }}
                </p>
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="shipping-address"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Shipping address<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="shipping_address"
                  type="text"
                  name="shipping-address"
                  id="shipping-address"
                  autocomplete="shipping street-address"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p
                  class="text-red-600 text-sm m-0 p-0"
                  v-if="shippingAddressError"
                >
                  {{ shippingAddressError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-2 sm:col-start-1">
              <label
                for="shipping-city"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Shipping City<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="shipping_city"
                  type="text"
                  name="shipping-city"
                  id="shipping-city"
                  autocomplete="shipping address-level2"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p
                  class="text-red-600 text-sm m-0 p-0"
                  v-if="shippingCityError"
                >
                  {{ shippingCityError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label
                for="shipping-region"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Shipping State / Province<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="shipping_state"
                  type="text"
                  name="shipping-region"
                  id="shipping-region"
                  autocomplete="address-level1"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p
                  class="text-red-600 text-sm m-0 p-0"
                  v-if="shippingStateError"
                >
                  {{ shippingStateError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label
                for="shipping-postal-code"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Shipping ZIP / Postal code<font-awesome-icon
                  class="text-red-500 ml-2"
                  :icon="['fas', 'asterisk']"
              /></label>
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="shipping_zip"
                  type="text"
                  name="shipping-postal-code"
                  id="shipping-postal-code"
                  autocomplete="shipping postal-code"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="shippingZipError">
                  {{ shippingZipError }}
                </p>
              </div>
            </div>
            <div class="col-span-full">
              <label
                for="billing-address"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Billing address</label
              >
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="billing_address"
                  type="text"
                  name="billing-address"
                  id="billing-address"
                  autocomplete="billing street-address"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p
                  class="text-red-600 text-sm m-0 p-0"
                  v-if="billingAddressError"
                >
                  {{ billingAddressError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-2 sm:col-start-1">
              <label
                for="billing-city"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Billing City</label
              >
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="billing_city"
                  type="text"
                  name="billing-city"
                  id="billing-city"
                  autocomplete="billing address-level2"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="billingCityError">
                  {{ billingCityError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label
                for="billing-region"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Billing State / Province</label
              >
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="billing_state"
                  type="text"
                  name="billing-region"
                  id="billing-region"
                  autocomplete="billing address-level1"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p
                  class="text-red-600 text-sm m-0 p-0"
                  v-if="billingStateError"
                >
                  {{ billingStateError }}
                </p>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label
                for="billing-postal-code"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Billing ZIP / Postal code</label
              >
              <div v-auto-animate class="mt-2">
                <input
                  v-model.trim="billing_zip"
                  type="text"
                  name="billing-postal-code"
                  id="billing-postal-code"
                  autocomplete="billing postal-code"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="billingZipError">
                  {{ billingZipError }}
                </p>
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="notes"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Notes</label
              >
              <div v-auto-animate class="mt-2">
                <textarea
                  @input="e => notes = (e.target as HTMLTextAreaElement).value.trim()"
                  id="notes"
                  name="notes"
                  rows="3"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                />
                <p class="text-red-600 text-sm m-0 p-0" v-if="notesError">
                  {{ notesError }}
                </p>
              </div>
              <p class="mt-3 text-sm leading-6 text-gray-600">
                Notes regarding the customer.
              </p>
            </div>
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
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';

const isSubmitting = ref(false);
const isErrorShowing = ref(false);
const errorMessage = ref('');

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

const { value: first_name, errorMessage: firstNameError } = useField(
  'first_name',
  {
    initialValue: '',
  }
);
const { value: last_name, errorMessage: lastNameError } = useField(
  'last_name',
  {
    initialValue: '',
  }
);
const { value: phone_number, errorMessage: phoneNumberError } = useField(
  'phone_number',
  {
    initialValue: '',
  }
);
const { value: email, errorMessage: emailError } = useField('email', {
  initialValue: '',
});
const { value: shipping_address, errorMessage: shippingAddressError } =
  useField('shipping_address', {
    initialValue: '',
  });
const { value: shipping_city, errorMessage: shippingCityError } = useField(
  'shipping_city',
  {
    initialValue: '',
  }
);
const { value: shipping_state, errorMessage: shippingStateError } = useField(
  'shipping_state',
  {
    initialValue: '',
  }
);
const { value: shipping_zip, errorMessage: shippingZipError } = useField(
  'shipping_zip',
  {
    initialValue: '',
  }
);
const { value: billing_address, errorMessage: billingAddressError } = useField(
  'billing_address',
  {
    initialValue: '',
  }
);
const { value: billing_city, errorMessage: billingCityError } = useField(
  'billing_city',
  {
    initialValue: '',
  }
);
const { value: billing_state, errorMessage: billingStateError } = useField(
  'billing_state',
  {
    initialValue: '',
  }
);
const { value: billing_zip, errorMessage: billingZipError } = useField(
  'billing_zip',
  {
    initialValue: '',
  }
);
const { value: notes, errorMessage: notesError } = useField('notes', {
  initialValue: '',
});

const onSubmit = handleSubmit(async (formData) => {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/customers`, {
      method: 'POST',
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
</script>
