<script setup lang="ts">
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { useUserStore } from '.././stores/userStore';
import type { User } from '.././stores/userStore';

definePageMeta({
  layout: false,
});

const userStore = useUserStore();
const baseURL = useRuntimeConfig().public.baseURL;

const formSubmittingInProcess = ref(false);
const isToastVisible = ref(false);
const errorMessage = ref('');

const validations = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const { handleSubmit } = useForm({
  validationSchema: validations,
});

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

const onSubmit = handleSubmit(async (formData) => {
  try {
    formSubmittingInProcess.value = true;
    const { data, error } = await useFetch<Partial<User>>(
      `${baseURL}/users/login`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: formData,
        },
      }
    );
    if (error.value) {
      errorMessage.value =
        //@ts-ignore
        error.value?.data?.error ?? error.value?.cause?.message;
      throw new Error(error.value?.data?.error);
    }

    //@ts-ignore
    const userData: User = data.value?.data;

    if (userData) {
      userStore.$state = userData;
      userStore.isAuthenticated = true;
      return await navigateTo('/');
    }
  } catch (error) {
    isToastVisible.value = true;
    console.error(error);
  } finally {
    formSubmittingInProcess.value = false;
    sessionStorage.clear();
  }
});
function handleDismiss() {
  isToastVisible.value = false;
}
</script>

<template>
  <NotificationToast
    type="error"
    :isVisible="isToastVisible"
    :dismissible="true"
    @dismiss="handleDismiss"
    :message="errorMessage"
  />

  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 container mx-auto sm:px-6 lg:px-8 mt-10"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-20 w-auto"
        src="~/assets/images/ak-47.png"
        alt="Your Company"
      />
      <h1
        class="mt-10 mb-5 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900"
      >
        SalixianMFG Admin
      </h1>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit="onSubmit">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >
          <div v-auto-animate class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              v-model="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
            />
            <p class="text-red-600 text-sm m-0 p-0" v-if="emailError">
              {{ emailError }}
            </p>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >
          </div>
          <div v-auto-animate class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              v-model="password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
            />
            <p class="text-red-600 text-sm" v-if="passwordError">
              {{ passwordError }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
            :disabled="formSubmittingInProcess"
          >
            <div v-if="!formSubmittingInProcess">Sign in</div>
            <SpinnerMini v-else />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
