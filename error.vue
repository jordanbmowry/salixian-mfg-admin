<script setup lang="ts">
import Error404 from '~/components/Error404.vue';
import ErrorDefault from '~/components/ErrorDefault.vue';

const error = useError();

definePageMeta({
  layout: false,
});

const isErrorWithStatusCode = (err: any): err is { statusCode: number } => {
  return !!err && typeof err.statusCode === 'number';
};

const template = computed(() => {
  const component =
    isErrorWithStatusCode(error.value) && error.value.statusCode === 404
      ? Error404
      : ErrorDefault;

  return component;
});
</script>

<template>
  <component v-if="error" :is="template" />
</template>
