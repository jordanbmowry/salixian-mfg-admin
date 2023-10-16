<script setup>
const error = useError();

const handleError = () => {
  clearError({
    redirect: '/',
  });
};
</script>

<template>
  <main
    id="error-page"
    class="absolute top-0 bottom-0 left-0 right-0 isolate min-h-full"
  >
    <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
      <p class="text-base font-semibold leading-8 text-white">404</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
        Page not found
      </h1>
      <p class="mt-4 text-base text-white/70 sm:mt-6">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div class="mt-10 flex justify-center">
        <button
          @click="handleError"
          class="rounded-md bg-stone-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
        >
          <span aria-hidden="true">&larr;</span> Back to home
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
#error-page {
  background-image: url('https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
