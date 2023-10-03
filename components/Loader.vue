<template>
  <teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-stone-800 bg-opacity-20 backdrop-blur-md"
    >
      <div class="loader"></div>
    </div>
  </teleport>
</template>

<style scoped>
@keyframes spinColor {
  0% {
    border-top-color: #dbeafe; /* blue-100 */
  }
  25% {
    border-top-color: #93c5fd; /* blue-300 */
  }
  50% {
    border-top-color: #3b82f6; /* blue-500 */
  }
  75% {
    border-top-color: #1e3a8a; /* blue-700 */
  }
  100% {
    border-top-color: #1e40af; /* blue-800 */
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  border: 10px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  animation: spin 1s linear infinite, spinColor 5s linear infinite;
  background-color: transparent;
}
</style>
