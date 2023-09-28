<template>
  <div class="animate-spin">
    <font-awesome-icon :icon="['fas', 'spinner']" />
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.animate-spin {
  animation: spin 1.5s infinite linear;
}
</style>
