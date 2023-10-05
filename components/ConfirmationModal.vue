<template>
  <teleport to="body">
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog as="div" class="fixed inset-0 z-50" @close="closeModal">
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
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
          ></div>
        </TransitionChild>

        <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div
            class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                    :class="{
                      'bg-red-100': dangerMode,
                      'bg-stone-100': !dangerMode,
                    }"
                  >
                    <font-awesome-icon
                      v-if="dangerMode"
                      aria-hidden="true"
                      class="h-6 w-6 text-red-600"
                      :icon="['fas', 'triangle-exclamation']"
                    />
                    <font-awesome-icon
                      v-else
                      :icon="['fas', 'circle-info']"
                      aria-hidden="true"
                      class="h-6 w-6 text-stone-600"
                    />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                      >{{ heading }}</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">{{ message }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    :class="{
                      'bg-red-600': dangerMode,
                      'hover:bg-red-500': dangerMode,
                      'bg-stone-600': !dangerMode,
                      'hover:bg-stone-500': !dangerMode,
                    }"
                    @click="confirmAction"
                  >
                    {{ confirmButtonText }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';

interface Props {
  heading: string;
  message: string;
  confirmButtonText: string;
  show: boolean;
  dangerMode?: boolean;
}

const { heading, message, confirmButtonText, show, dangerMode } =
  defineProps<Props>();
const emit = defineEmits(['update:open', 'confirm']);
const isModalOpen = ref(show);
watch(
  () => show,
  (newVal) => {
    isModalOpen.value = newVal;
  }
);
const closeModal = () => {
  isModalOpen.value = false;
  emit('update:open', false);
};
const confirmAction = () => {
  emit('confirm');
  closeModal();
};
</script>
