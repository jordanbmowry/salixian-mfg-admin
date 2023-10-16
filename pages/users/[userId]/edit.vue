<script setup lang="ts">
import { USER_ROLES } from '~/data/userRoles';
import { useField, useForm } from 'vee-validate';
import { useUserStore } from '~/stores/userStore';
import { User } from '~/stores/userStore';
import * as yup from 'yup';

const route = useRoute();
const userRoles = ref(USER_ROLES);
const isErrorShowing = ref(false);
const isConfirmationModalOpen = ref(false);
const confimationModalState = ref({});
const errorMessage = ref('');
const isSubmitting = ref(false);
const baseUrl = useRuntimeConfig().public.baseURL;
const { userId } = route.params;
const userStore = useUserStore();
const userData = ref({});

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
    .test('password', 'Password is required.', function (value) {
      const { confirmPassword } = this.parent;
      if (!value && !confirmPassword) return true;
      if (value && confirmPassword) return true;
      return !!value;
    })
    .label('Password'),
  confirmPassword: yup
    .string()
    .trim()
    .test('match', 'Passwords must match.', function (value) {
      const { password } = this.parent;
      return !value || !password || value === password;
    })
    .test('confirmPassword', 'Confirm password is required.', function (value) {
      const { password } = this.parent;
      if (!value && !password) return true;
      if (value && password) return true;
      return !!value;
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

async function fetchData(url: string) {
  try {
    const data = await useFetchWithCache<{ data: Partial<User> }>(url);
    userData.value = data.value.data;
    const {
      first_name: fetchedFirstName,
      last_name: fetchedLastName,
      email: fetchedEmail,
      role: fetchedRole,
      notes: fetchedNotes,
    } = data.value.data;

    first_name.value = fetchedFirstName || '';
    last_name.value = fetchedLastName || '';
    email.value = fetchedEmail;
    role.value = fetchedRole;
    notes.value = fetchedNotes || '';
  } catch (error) {
    console.error('Error fetching the data: ', error);
  }
}

onMounted(() => {
  fetchData(`/users/${userId}`);
});

const handleUpdateUser = handleSubmit(async (formData) => {
  const data = {
    ...formData,
    user_id: userId,
  };

  if (!formData.password || !formData.confirmPassword) {
    delete data?.password;
  }

  if (userStore.role !== 'admin') {
    delete data?.role;
  }

  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/users/${userId}`, {
      method: 'PUT',
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
    userStore.role === 'admin'
      ? await navigateTo('/users')
      : await navigateTo('/');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
});

const isYourAccount = () => userId === userStore.user_id;

const handleConfirmUpdate = () => {
  confimationModalState.value = {
    confirm: handleUpdateUser,
    dangerMode: false,
    heading: 'Confirmation',
    message: isYourAccount()
      ? `Do you want to proceed with updating your account?`
      : `Do you want to proceed with the user's your account?`,
    confirmButtonText: 'Update',
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

async function handleDeleteUser() {
  try {
    isSubmitting.value = true;
    const { error } = await useFetch(`${baseUrl}/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    });

    if (error.value) {
      errorMessage.value = error.value?.data?.error;
      // @ts-ignore
      throw new Error(error.value?.data?.error);
    }
    sessionStorage.clear();

    if (userId !== userStore.user_id) {
      await navigateTo('/');
      return;
    }
    await useFetch(`${baseUrl}/users/logout`, {
      method: 'GET',
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    });
    await navigateTo('/login');
  } catch (err) {
    console.error(err);
    isErrorShowing.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

const handleConfirmDelete = () => {
  confimationModalState.value = {
    confirm: handleDeleteUser,
    dangerMode: true,
    heading: 'Delete user',
    message: 'Do you want to permanently delete this user?',
    confirmButtonText: 'Delete',
  };

  isConfirmationModalOpen.value = true;
};

definePageMeta({
  middleware: ['is-user'],
});
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
          Edit {{ email }}
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          User info will be changed and stored in the database.
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
              required
              label="Email"
              v-model.trim="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              :error="emailError"
            />

            <StateDropdown
              v-if="userStore.role === 'admin'"
              :required="true"
              label="User Role"
              class="sm:col-span-full xl:sm:col-span-2"
              :modelValue="role"
              :states="userRoles"
              @update:modelValue="updateUserRole"
              :error="roleError ?? ''"
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
            v-if="userStore.role === 'admin'"
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
        <div
          v-if="userStore.role === 'admin' && userData.role !== 'admin'"
          class="bg-red-100 shadow-sm ring-1 ring-red-900/5 rounded md:col-span-2 border border-red-600"
        >
          <div class="bg-white px-4 py-5 sm:px-6">
            <h3 class="text-xl font-extrabold leading-6 text-red-600 my-4">
              Danger zone
            </h3>

            <div class="flex justify-between items-center gap-6 my-6">
              <div class="flex flex-col">
                <p v-if="isYourAccount()" class="text-base text-bold">
                  Delete your account
                </p>
                <p v-else class="text-base text-bold">Delete user</p>

                <p v-if="isYourAccount()" class="text-base text-gray-600">
                  Once you delete your account, you will no longer be able to
                  access the application.
                </p>
                <p v-else class="text-base text-gray-600">
                  Once you delete the user account, they will no longer be able
                  to access the application.
                </p>
              </div>
              <button
                @click="handleConfirmDelete"
                type="button"
                class="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
