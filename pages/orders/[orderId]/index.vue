<script setup>
const route = useRoute();
</script>

<template>
  <div>/orders/{{ route.params.orderId }}</div>
</template>
