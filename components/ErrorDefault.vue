<script setup>
const error = useError();

const handleError = () => {
  clearError({
    redirect: '/',
  });
};
</script>

<template>
  <main id="error-page" class="relative isolate min-h-full bg-stone-900">
    <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
      <font-awesome-icon
        :icon="['fas', 'triangle-exclamation']"
        size="4x"
        class="text-red-600"
      />
      <p class="text-base font-semibold leading-8 text-white">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
        Shit! 💩
      </h1>
      <p class="mt-4 text-base text-white/70 sm:mt-6">
        <strong>{{ error.message }}</strong>
      </p>
      <p class="mt-4 text-base text-white/70 sm:mt-6">
        It looks like something broke.
      </p>
      <p class="mt-4 text-base text-white/70 sm:mt-6">Sorry about that.</p>
      <div class="mt-10 flex justify-center">
        <button
          class="rounded-md bg-stone-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
          @click="handleError"
        >
          <span aria-hidden="true">&larr;</span>
          Back to home
        </button>
      </div>
    </div>
  </main>
</template>
