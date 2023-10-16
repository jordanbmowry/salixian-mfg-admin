<script setup>
import Error404 from '~/components/Error404.vue';
import ErrorDefault from '~/components/ErrorDefault.vue';

const error = useError();

definePageMeta({
  layout: false,
});

const template = computed(() => {
  const component = error.value.statusCode === 404 ? Error404 : ErrorDefault;

  return component;
});
</script>

<template>
  <component :is="template" />
</template>
