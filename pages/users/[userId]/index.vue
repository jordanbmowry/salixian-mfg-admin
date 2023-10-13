<script setup>
const route = useRoute();

definePageMeta({
  middleware: ['is-user'],
});
</script>

<template>
  <div>/users/{{ route.params.userId }}</div>
</template>
