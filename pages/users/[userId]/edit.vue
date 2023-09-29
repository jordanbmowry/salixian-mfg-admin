<script setup>
const route = useRoute();

console.log(route.params.userId);
</script>

<template>
  <div>/users/{{ route.params.userId }}/edit</div>
</template>
