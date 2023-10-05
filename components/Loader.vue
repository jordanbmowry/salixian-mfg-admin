<template>
  <teleport to="body">
    <TransitionRoot as="template" :show="true">
      <Dialog as="div" class="fixed inset-0 z-50 overflow-y-hidden">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-stone-800 bg-opacity-20 backdrop-blur-md z-40"
          />
        </TransitionChild>

        <div
          class="fixed inset-0 z-50 flex items-center justify-center w-screen"
        >
          <div class="loader"></div>
        </div>
      </Dialog>
    </TransitionRoot>
  </teleport>
</template>

<script lang="ts" setup>
import { Dialog, TransitionChild, TransitionRoot } from '@headlessui/vue';
</script>

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
