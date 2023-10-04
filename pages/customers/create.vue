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
                  autofocus
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
                  placeholder="example@email.com"
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

            <div class="sm:col-span-full xl:sm:col-span-2 xl:sm:col-start-1">
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

            <div v-auto-animate class="sm:col-span-full xl:sm:col-span-2">
              <Listbox as="div" v-model="selectedShippingState">
                <label
                  for="shipping-state"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Shipping State / Province
                  <font-awesome-icon
                    class="text-red-500 ml-2"
                    :icon="['fas', 'asterisk']"
                  />
                </label>
                <div class="relative">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <span class="block truncate">{{
                      selectedShippingState.name
                    }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <p
                    class="text-red-600 text-sm m-0 p-0"
                    v-if="shippingStateError"
                  >
                    {{ shippingStateError }}
                  </p>
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
                        v-for="state in states"
                        :key="state.value"
                        :value="state"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-stone-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ state.name }}</span
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
            </div>

            <div class="sm:col-span-full xl:sm:col-span-2">
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
                  placeholder="12345"
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
              <SwitchGroup as="div" class="flex items-center justify-between">
                <span class="flex flex-grow flex-col">
                  <SwitchLabel
                    as="span"
                    class="text-sm font-medium leading-6 text-gray-900"
                    passive
                    >Shipping and billing address are the same</SwitchLabel
                  >
                  <SwitchDescription as="span" class="text-sm text-gray-500"
                    >Use the shipping address also as the billing
                    address.</SwitchDescription
                  >
                </span>
                <Switch
                  v-model="useShippingForBilling"
                  :class="[
                    useShippingForBilling ? 'bg-stone-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2',
                  ]"
                >
                  <span
                    aria-hidden="true"
                    :class="[
                      useShippingForBilling ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    ]"
                  />
                </Switch>
              </SwitchGroup>
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

            <div class="sm:col-span-full xl:sm:col-span-2 xl:sm:col-start-1">
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

            <div class="sm:col-span-full xl:sm:col-span-2">
              <Listbox as="div" v-model="selectedBillingState">
                <label
                  for="shipping-state"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Billing State / Province
                  <font-awesome-icon
                    class="text-red-500 ml-2"
                    :icon="['fas', 'asterisk']"
                  />
                </label>
                <div class="relative">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <span class="block truncate">{{
                      selectedBillingState.name
                    }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <p
                    class="text-red-600 text-sm m-0 p-0"
                    v-if="billingStateError"
                  >
                    {{ billingStateError }}
                  </p>
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
                        v-for="state in states"
                        :key="state.value"
                        :value="state"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-stone-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ state.name }}</span
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
            </div>

            <div class="sm:col-span-full xl:sm:col-span-2">
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
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';

const useShippingForBilling = ref(false);
const isSubmitting = ref(false);
const isErrorShowing = ref(false);
const errorMessage = ref('');
const states = ref([
  { name: 'Select a state', value: '' },
  { name: 'Alabama', value: 'AL' },
  { name: 'Alaska', value: 'AK' },
  { name: 'Arizona', value: 'AZ' },
  { name: 'Arkansas', value: 'AR' },
  { name: 'California', value: 'CA' },
  { name: 'Colorado', value: 'CO' },
  { name: 'Connecticut', value: 'CT' },
  { name: 'Delaware', value: 'DE' },
  { name: 'Florida', value: 'FL' },
  { name: 'Georgia', value: 'GA' },
  { name: 'Hawaii', value: 'HI' },
  { name: 'Idaho', value: 'ID' },
  { name: 'Illinois', value: 'IL' },
  { name: 'Indiana', value: 'IN' },
  { name: 'Iowa', value: 'IA' },
  { name: 'Kansas', value: 'KS' },
  { name: 'Kentucky', value: 'KY' },
  { name: 'Louisiana', value: 'LA' },
  { name: 'Maine', value: 'ME' },
  { name: 'Maryland', value: 'MD' },
  { name: 'Massachusetts', value: 'MA' },
  { name: 'Michigan', value: 'MI' },
  { name: 'Minnesota', value: 'MN' },
  { name: 'Mississippi', value: 'MS' },
  { name: 'Missouri', value: 'MO' },
  { name: 'Montana', value: 'MT' },
  { name: 'Nebraska', value: 'NE' },
  { name: 'Nevada', value: 'NV' },
  { name: 'New Hampshire', value: 'NH' },
  { name: 'New Jersey', value: 'NJ' },
  { name: 'New Mexico', value: 'NM' },
  { name: 'New York', value: 'NY' },
  { name: 'North Carolina', value: 'NC' },
  { name: 'North Dakota', value: 'ND' },
  { name: 'Ohio', value: 'OH' },
  { name: 'Oklahoma', value: 'OK' },
  { name: 'Oregon', value: 'OR' },
  { name: 'Pennsylvania', value: 'PA' },
  { name: 'Rhode Island', value: 'RI' },
  { name: 'South Carolina', value: 'SC' },
  { name: 'South Dakota', value: 'SD' },
  { name: 'Tennessee', value: 'TN' },
  { name: 'Texas', value: 'TX' },
  { name: 'Utah', value: 'UT' },
  { name: 'Vermont', value: 'VT' },
  { name: 'Virginia', value: 'VA' },
  { name: 'Washington', value: 'WA' },
  { name: 'West Virginia', value: 'WV' },
  { name: 'Wisconsin', value: 'WI' },
  { name: 'Wyoming', value: 'WY' },
]);

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
const { value: notes, errorMessage: notesError } = useField<string>('notes', {
  initialValue: '',
});

function findStateByValue(value: string) {
  return states.value.find((s) => s.value === value) || states.value[0];
}

const selectedShippingState = ref(findStateByValue(shipping_state.value));
const selectedBillingState = ref(findStateByValue(billing_state.value));

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
</script>
