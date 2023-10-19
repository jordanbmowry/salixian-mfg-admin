<script setup lang="ts">
import { USER_ROLES } from '~/data/userRoles';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { ConfimationModalState } from '~/types/types';

const route = useRoute();
const userRoles = ref(USER_ROLES);
const isErrorShowing = ref(false);
const isConfirmationModalOpen = ref(false);
const confimationModalState = ref<ConfimationModalState | {}>({});
const errorMessage = ref('');
const isSubmitting = ref(false);
const baseUrl = useRuntimeConfig().public.baseURL;

const validations = yup.object({
  first_name: yup.string().trim().label('First name'),
  last_name: yup.string().trim().label('Last name'),
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .required('Email is required.')
    .label('Email'),
  password: yup
    .string()
    .trim()
    .required('Password is required.')
    .label('Password'),
  confirmPassword: yup
    .string()
    .trim()
    .required('Confirm password is required.')
    .test('match', 'Passwords must match.', function (value) {
      const { password } = this.parent;
      return !value || !password || value === password;
    })
    .label('Confirm Password'),
  role: yup
    .string()
    .trim()
    .required('User role is required.')
    .label('User Role'),
  notes: yup.string().trim().nullable().label('Notes'),
});

const { handleSubmit } = useForm({
  validationSchema: validations,
});

const { value: first_name, errorMessage: firstNameError } =
  useField<string>('first_name');
const { value: last_name, errorMessage: lastNameError } =
  useField<string>('last_name');
const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: password, errorMessage: passwordError } =
  useField<string>('password');
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField<string>('confirmPassword');
const { value: role, errorMessage: roleError } = useField<string>('role');
const { value: notes, errorMessage: notesError } = useField<string>('notes');

const handleCreateUser = handleSubmit(async (formData) => {
  const clone = structuredClone(formData);

  delete clone?.confirmPassword;

  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/users/register`, {
      method: 'POST',
      body: {
        data: clone,
      },
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    });

    if (error.value) {
      errorMessage.value =
        // @ts-ignore
        error.value?.data?.error ?? error.value?.cause?.message;
      // @ts-ignore
      throw new Error(error.value?.data?.error);
    }
    sessionStorage.clear();
    await navigateTo('/users');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
});

const handleConfirmCreateUser = () => {
  confimationModalState.value = {
    confirm: handleCreateUser,
    dangerMode: false,
    heading: 'Confirmation',
    message: `Do you want to proceed with creating a new user account?`,
    confirmButtonText: 'Create user',
  };

  isConfirmationModalOpen.value = true;
};

interface State {
  name: string;
  value: string;
}

function findByValue(value: string, states: Ref<State[]>) {
  return states.value.find((s) => s.value === value) || states.value[0];
}

const selectedUserRole = ref(findByValue(role.value, userRoles));

function createStateUpdater(
  stateValueRef: Ref<string>,
  stateObjRef: Ref<State>
) {
  return (newState: State) => {
    stateValueRef.value = newState.value;
    stateObjRef.value = newState;
  };
}

const updateUserRole = createStateUpdater(role, selectedUserRole);

definePageMeta({
  middleware: ['check-admin'],
});

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
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Create user
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          New user will be created and stored in the database.
        </p>
      </div>

      <form
        @submit.prevent="handleConfirmCreateUser"
        class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <InputField
              class="sm:col-span-4"
              required
              label="Email"
              v-model.trim="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              :error="emailError"
            />

            <SelectDropdown
              :required="true"
              label="User Role"
              class="sm:col-span-full xl:sm:col-span-2"
              :modelValue="role"
              :items="userRoles"
              @update:modelValue="updateUserRole"
              :error="roleError ?? ''"
            />
            <InputField
              class="sm:col-span-3"
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
              label="Password"
              v-model.trim="password"
              type="password"
              name="password"
              id="password"
              :error="passwordError"
            />
            <InputField
              class="sm:col-span-4"
              label="Confirm Password"
              v-model.trim="confirmPassword"
              type="password"
              name="confirm-password"
              id="confirm-password"
              :error="confirmPasswordError"
            />

            <TextAreaField
              v-model.trim="notes"
              class="col-span-full"
              label="Notes"
              name="notes"
              id="notes"
              :rows="3"
              description="User notes"
              :error="notesError"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
        >
          <NuxtLink
            to="/users"
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
