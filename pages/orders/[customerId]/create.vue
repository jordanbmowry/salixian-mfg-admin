<script setup>
const route = useRoute();

// When accessing /posts/1, route.params.id will be 1
console.log(route.params.customerId);
</script>

<template>
  <div>/Orders/{{ route.params.customerId }}/create</div>
</template>
