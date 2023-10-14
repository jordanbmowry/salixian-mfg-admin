<script setup>
const route = useRoute();

definePageMeta({
  middleware: ['check-admin'],
});
</script>

<template>
  <div>/users/create</div>
</template>
