<template>
  <nav
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    aria-label="Pagination"
  >
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-bold">{{ startItem }}</span>
        to
        <span class="font-bold">{{ endItem }}</span>
        of
        <span class="font-bold">{{ totalItems }}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      <button
        @click.prevent="handlePrev"
        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        :class="{
          'opacity-50 cursor-not-allowed':
            currentPage === 1 || totalPages === 0,
        }"
      >
        Previous
      </button>
      <button
        @click.prevent="handleNext"
        class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        :class="{
          'opacity-50 cursor-not-allowed':
            currentPage === totalPages || totalPages === 0,
        }"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  startItem: {
    type: Number,
    default: 1,
  },
  endItem: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['update:currentPage']);

const handlePrev = (event: MouseEvent): void => {
  if (props.currentPage > 1) {
    const newPage = props.currentPage - 1;
    emit('update:currentPage', newPage);
  }
};

const handleNext = (event: MouseEvent): void => {
  if (props.currentPage < props.totalPages) {
    const newPage = props.currentPage + 1;
    emit('update:currentPage', newPage);
  }
};
</script>
